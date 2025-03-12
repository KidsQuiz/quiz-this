
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Question, AnswerOption } from '@/hooks/questionsTypes';

export const useQuestionSession = (kidId: string, kidName: string, onClose: () => void) => {
  const { toast } = useToast();
  const [timeBetweenQuestions, setTimeBetweenQuestions] = useState(5);
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
  const [questionPackages, setQuestionPackages] = useState<{ id: string, name: string }[]>([]);
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showWowEffect, setShowWowEffect] = useState(false);

  // Load assigned packages
  useEffect(() => {
    const loadAssignedPackages = async () => {
      if (!kidId) return;
      
      try {
        setIsLoading(true);
        
        // First get the kid's assigned packages
        const { data: assignedPackages, error: assignmentsError } = await supabase
          .from('kid_packages')
          .select('package_id')
          .eq('kid_id', kidId);
          
        if (assignmentsError) throw assignmentsError;
        
        if (!assignedPackages || assignedPackages.length === 0) {
          toast({
            title: "No packages assigned",
            description: `${kidName} doesn't have any question packages assigned yet.`,
            variant: "destructive"
          });
          onClose();
          return;
        }
        
        // Get package details
        const packageIds = assignedPackages.map(p => p.package_id);
        const { data: packagesData, error: packagesError } = await supabase
          .from('packages')
          .select('id, name')
          .in('id', packageIds);
          
        if (packagesError) throw packagesError;
        
        setQuestionPackages(packagesData || []);
      } catch (error: any) {
        console.error('Error loading assigned packages:', error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load assigned packages"
        });
        onClose();
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAssignedPackages();
  }, [kidId, kidName, onClose, toast]);

  // Load questions when packages are selected
  const loadQuestions = useCallback(async () => {
    if (!selectedPackageIds.length) return;
    
    try {
      setIsLoading(true);
      
      let allQuestions: Question[] = [];
      
      // Get questions for all selected packages
      for (const packageId of selectedPackageIds) {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('package_id', packageId)
          .order('created_at');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          allQuestions = [...allQuestions, ...data];
        }
      }
      
      if (allQuestions.length === 0) {
        toast({
          title: "No questions found",
          description: "The selected packages don't have any questions.",
          variant: "destructive"
        });
        return;
      }
      
      // Randomize the order of questions
      const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
      setQuestions(shuffledQuestions);
      
    } catch (error: any) {
      console.error('Error loading questions:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load questions"
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedPackageIds, toast]);

  // Load answer options for the current question
  const loadAnswerOptions = useCallback(async (questionId: string) => {
    try {
      const { data, error } = await supabase
        .from('answer_options')
        .select('*')
        .eq('question_id', questionId)
        .order('id');
        
      if (error) throw error;
      
      // Randomize the order of answers
      const shuffledAnswers = [...(data || [])].sort(() => Math.random() - 0.5);
      setAnswerOptions(shuffledAnswers);
      
    } catch (error: any) {
      console.error('Error loading answer options:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load answer options"
      });
    }
  }, [toast]);

  // Handle package selection
  const togglePackageSelection = (packageId: string) => {
    setSelectedPackageIds(prev => {
      if (prev.includes(packageId)) {
        return prev.filter(id => id !== packageId);
      } else {
        return [...prev, packageId];
      }
    });
  };

  // Select all packages
  const selectAllPackages = () => {
    setSelectedPackageIds(questionPackages.map(pkg => pkg.id));
  };

  // Deselect all packages
  const deselectAllPackages = () => {
    setSelectedPackageIds([]);
  };

  // Start session
  const handleStartSession = async () => {
    if (selectedPackageIds.length === 0) {
      toast({
        title: "No packages selected",
        description: "Please select at least one package to start the session.",
        variant: "destructive"
      });
      return;
    }

    await loadQuestions();
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setTotalPoints(0);
    setSessionComplete(false);
    setIsConfiguring(false);
  };

  // Display the current question
  useEffect(() => {
    if (isConfiguring || questions.length === 0) return;
    
    const loadCurrentQuestion = async () => {
      // Check if we've reached the end of questions
      if (currentQuestionIndex >= questions.length) {
        setSessionComplete(true);
        
        // Update kid's points in the database
        if (totalPoints > 0) {
          try {
            const { data: kidData, error: kidError } = await supabase
              .from('kids')
              .select('points')
              .eq('id', kidId)
              .single();
              
            if (kidError) throw kidError;
            
            const currentPoints = kidData?.points || 0;
            const newTotalPoints = currentPoints + totalPoints;
            
            const { error: updateError } = await supabase
              .from('kids')
              .update({ points: newTotalPoints })
              .eq('id', kidId);
              
            if (updateError) throw updateError;
            
            toast({
              title: "Points updated!",
              description: `${kidName} now has ${newTotalPoints} points!`,
            });
          } catch (error) {
            console.error('Error updating points:', error);
          }
        }
        return;
      }
      
      const question = questions[currentQuestionIndex];
      setCurrentQuestion(question);
      setTimeRemaining(question.time_limit);
      setAnswerSubmitted(false);
      setSelectedAnswerId(null);
      setIsCorrect(false);
      setShowWowEffect(false);
      
      await loadAnswerOptions(question.id);
      
      // Start the timer for this question
      setTimerActive(true);
    };
    
    loadCurrentQuestion();
  }, [currentQuestionIndex, isConfiguring, questions, loadAnswerOptions, kidId, kidName, toast, totalPoints]);

  // Timer logic
  useEffect(() => {
    if (!timerActive || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerActive(false);
          if (!answerSubmitted) {
            handleTimeUp();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timerActive, timeRemaining, answerSubmitted]);

  // Handle when time is up
  const handleTimeUp = () => {
    if (answerSubmitted) return;
    
    setAnswerSubmitted(true);
    setTimerActive(false);
    setIsCorrect(false);
    
    // Wait for the time between questions before moving to next
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev + 1);
    }, timeBetweenQuestions * 1000);
  };

  // Handle answer selection
  const handleSelectAnswer = async (answerId: string) => {
    if (answerSubmitted) return;
    
    setSelectedAnswerId(answerId);
    setAnswerSubmitted(true);
    setTimerActive(false);
    
    // Find if the selected answer is correct
    const selectedAnswer = answerOptions.find(option => option.id === answerId);
    const wasCorrect = selectedAnswer?.is_correct || false;
    setIsCorrect(wasCorrect);
    
    // Update scores
    if (wasCorrect && currentQuestion) {
      setCorrectAnswers(prev => prev + 1);
      setTotalPoints(prev => prev + currentQuestion.points);
      setShowWowEffect(true);
      
      // Hide the effect after 2 seconds
      setTimeout(() => {
        setShowWowEffect(false);
      }, 2000);
    }
    
    // Wait for the time between questions before moving to next
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev + 1);
    }, timeBetweenQuestions * 1000);
  };

  return {
    timeBetweenQuestions,
    setTimeBetweenQuestions,
    isConfiguring,
    isLoading,
    currentQuestion,
    answerOptions,
    questionPackages,
    selectedPackageIds,
    questions,
    currentQuestionIndex,
    timeRemaining,
    sessionComplete,
    correctAnswers,
    totalPoints,
    selectedAnswerId,
    answerSubmitted,
    isCorrect,
    showWowEffect,
    togglePackageSelection,
    selectAllPackages,
    deselectAllPackages,
    handleStartSession,
    handleSelectAnswer
  };
};
