
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Question, AnswerOption } from '@/hooks/questionsTypes';
import { Clock, Star, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface QuestionSessionProps {
  isOpen: boolean;
  onClose: () => void;
  kidId: string;
  kidName: string;
}

const QuestionSession = ({ isOpen, onClose, kidId, kidName }: QuestionSessionProps) => {
  const { toast } = useToast();
  const [timeBetweenQuestions, setTimeBetweenQuestions] = useState(5);
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
  const [questionPackages, setQuestionPackages] = useState<{ id: string, name: string }[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
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

  // Load assigned packages
  useEffect(() => {
    const loadAssignedPackages = async () => {
      if (!isOpen || !kidId) return;
      
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
        if (packagesData && packagesData.length > 0) {
          setSelectedPackageId(packagesData[0].id);
        }
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
    
    if (isOpen) {
      loadAssignedPackages();
    }
  }, [isOpen, kidId, kidName, onClose, toast]);

  // Load questions when package is selected
  const loadQuestions = useCallback(async () => {
    if (!selectedPackageId) return;
    
    try {
      setIsLoading(true);
      
      // Get questions for the selected package
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('package_id', selectedPackageId)
        .order('created_at');
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast({
          title: "No questions found",
          description: "This package doesn't have any questions yet.",
          variant: "destructive"
        });
        return;
      }
      
      // Randomize the order of questions
      const shuffledQuestions = [...data].sort(() => Math.random() - 0.5);
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
  }, [selectedPackageId, toast]);

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

  // Start session
  const handleStartSession = async () => {
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
    }
    
    // Wait for the time between questions before moving to next
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev + 1);
    }, timeBetweenQuestions * 1000);
  };

  // Render the configuration screen
  const renderConfigScreen = () => (
    <>
      <DialogHeader>
        <DialogTitle>Start Question Session for {kidName}</DialogTitle>
        <DialogDescription>
          Choose a question package and set the time between questions.
        </DialogDescription>
      </DialogHeader>
      
      <div className="py-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="package">Question Package</Label>
          <select
            id="package"
            className="w-full p-2 border rounded-md"
            value={selectedPackageId}
            onChange={(e) => setSelectedPackageId(e.target.value)}
            disabled={isLoading}
          >
            {questionPackages.map(pkg => (
              <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timeBetween">Time Between Questions: {timeBetweenQuestions} seconds</Label>
          <Slider
            id="timeBetween"
            min={1}
            max={10}
            step={1}
            value={[timeBetweenQuestions]}
            onValueChange={(value) => setTimeBetweenQuestions(value[0])}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleStartSession} disabled={isLoading || !selectedPackageId}>
          Start Session
        </Button>
      </DialogFooter>
    </>
  );

  // Render a question
  const renderQuestion = () => {
    if (!currentQuestion) return null;
    
    return (
      <>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">Question {currentQuestionIndex + 1}/{questions.length}</DialogTitle>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{timeRemaining}s</span>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <Progress value={(timeRemaining / currentQuestion.time_limit) * 100} />
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <p className="text-lg font-medium">{currentQuestion.content}</p>
            <div className="flex items-center gap-2 mt-2">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{currentQuestion.points} points</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {answerOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(option.id)}
                disabled={answerSubmitted}
                className={`w-full p-3 text-left rounded-lg border transition-all ${
                  answerSubmitted && option.is_correct 
                    ? 'bg-green-100 border-green-500' 
                    : answerSubmitted && selectedAnswerId === option.id && !option.is_correct
                      ? 'bg-red-100 border-red-500'
                      : selectedAnswerId === option.id
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-accent border-input'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option.content}</span>
                  {answerSubmitted && option.is_correct && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {answerSubmitted && selectedAnswerId === option.id && !option.is_correct && (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
          
          {answerSubmitted && (
            <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <p className="font-medium">
                {isCorrect 
                  ? 'Correct! +' + currentQuestion.points + ' points'
                  : 'Incorrect. The correct answer is highlighted.'}
              </p>
              <p className="text-sm mt-1">
                Next question in {timeBetweenQuestions} seconds...
              </p>
            </div>
          )}
        </div>
      </>
    );
  };

  // Render the completion screen
  const renderCompletionScreen = () => (
    <>
      <DialogHeader>
        <DialogTitle>Session Complete!</DialogTitle>
        <DialogDescription>
          Great job, {kidName}!
        </DialogDescription>
      </DialogHeader>
      
      <div className="py-6 space-y-4 text-center">
        <div className="text-5xl font-bold text-primary">{totalPoints}</div>
        <p className="text-lg">Total Points Earned</p>
        
        <div className="bg-primary/10 p-4 rounded-lg">
          <p>You answered {correctAnswers} out of {questions.length} questions correctly.</p>
        </div>
      </div>
      
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className={`sm:max-w-[${isConfiguring ? '500px' : '650px'}]`}>
        {isConfiguring && renderConfigScreen()}
        {!isConfiguring && !sessionComplete && renderQuestion()}
        {!isConfiguring && sessionComplete && renderCompletionScreen()}
      </DialogContent>
    </Dialog>
  );
};

export default QuestionSession;
