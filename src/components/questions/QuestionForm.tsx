
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, X, Clock, Star } from 'lucide-react';
import { AnswerOption } from '@/hooks/useQuestionsData';

interface QuestionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  questionId?: string;
  packageId: string;
}

// Update the answer interface to make id optional
interface AnswerFormOption {
  id?: string;
  content: string;
  isCorrect: boolean;
}

const QuestionForm = ({ isOpen, onClose, onSave, questionId, packageId }: QuestionFormProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [timeLimit, setTimeLimit] = useState('30');
  const [points, setPoints] = useState('10');
  const [answers, setAnswers] = useState<AnswerFormOption[]>([
    { content: '', isCorrect: false },
    { content: '', isCorrect: false },
    { content: '', isCorrect: false },
    { content: '', isCorrect: false }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditMode = !!questionId;
  
  useEffect(() => {
    const loadQuestionData = async () => {
      if (!questionId) return;
      
      try {
        setIsLoading(true);
        // Fetch question data
        const { data: questionData, error: questionError } = await supabase
          .from('questions')
          .select('*')
          .eq('id', questionId)
          .single();
          
        if (questionError) throw questionError;
        
        if (questionData) {
          setContent(questionData.content);
          setTimeLimit(questionData.time_limit.toString());
          setPoints(questionData.points.toString());
          
          // Fetch answer options
          const { data: answerOptions, error: answersError } = await supabase
            .from('answer_options')
            .select('*')
            .eq('question_id', questionId)
            .order('id');
            
          if (answersError) throw answersError;
          
          if (answerOptions && answerOptions.length > 0) {
            const formattedAnswers = answerOptions.map(option => ({
              id: option.id,
              content: option.content,
              isCorrect: option.is_correct
            }));
            
            // If less than 4 answers, fill the rest with empty answers
            while (formattedAnswers.length < 4) {
              formattedAnswers.push({ content: '', isCorrect: false });
            }
            
            setAnswers(formattedAnswers);
          }
        }
      } catch (error: any) {
        console.error('Error fetching question:', error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load question information"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen && isEditMode) {
      loadQuestionData();
    } else {
      // Reset form when opening in add mode
      setContent('');
      setTimeLimit('30');
      setPoints('10');
      setAnswers([
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false }
      ]);
    }
  }, [isOpen, questionId, isEditMode]);
  
  const handleAnswerChange = (index: number, field: 'content' | 'isCorrect', value: string | boolean) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = {
      ...updatedAnswers[index],
      [field]: value
    };
    setAnswers(updatedAnswers);
  };
  
  const validateForm = () => {
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide the question content."
      });
      return false;
    }
    
    // Check if at least one answer is marked as correct
    if (!answers.some(answer => answer.isCorrect)) {
      toast({
        variant: "destructive",
        title: "Invalid Answers",
        description: "Please mark at least one answer as correct."
      });
      return false;
    }
    
    // Check if all answers have content
    const filledAnswers = answers.filter(answer => answer.content.trim() !== '');
    if (filledAnswers.length < 2) {
      toast({
        variant: "destructive",
        title: "Invalid Answers",
        description: "Please provide at least two answer options."
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to save questions."
      });
      return;
    }
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Filter out empty answers
      const filledAnswers = answers.filter(answer => answer.content.trim() !== '');
      
      if (isEditMode) {
        // Update the question
        const { data: updatedQuestion, error: questionError } = await supabase
          .from('questions')
          .update({
            content,
            time_limit: parseInt(timeLimit),
            points: parseInt(points),
            updated_at: new Date().toISOString()
          })
          .eq('id', questionId)
          .select()
          .single();
          
        if (questionError) throw questionError;
        
        // Handle answer options - first delete existing ones
        const { error: deleteError } = await supabase
          .from('answer_options')
          .delete()
          .eq('question_id', questionId);
          
        if (deleteError) throw deleteError;
        
        // Then insert new ones
        const { error: answersError } = await supabase
          .from('answer_options')
          .insert(filledAnswers.map(answer => ({
            question_id: questionId,
            content: answer.content,
            is_correct: answer.isCorrect
          })));
          
        if (answersError) throw answersError;
        
        toast({
          title: "Success",
          description: "Question updated successfully"
        });
      } else {
        // Create new question
        const { data: newQuestion, error: questionError } = await supabase
          .from('questions')
          .insert({
            package_id: packageId,
            content,
            time_limit: parseInt(timeLimit),
            points: parseInt(points)
          })
          .select()
          .single();
          
        if (questionError) throw questionError;
        
        // Create answer options
        const { error: answersError } = await supabase
          .from('answer_options')
          .insert(filledAnswers.map(answer => ({
            question_id: newQuestion.id,
            content: answer.content,
            is_correct: answer.isCorrect
          })));
          
        if (answersError) throw answersError;
        
        toast({
          title: "Success",
          description: "Question created successfully"
        });
      }
      
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving question:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save question information."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Question' : 'Create Question'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="content">Question</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your question"
              disabled={isLoading}
              required
              className="min-h-20"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeLimit" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Time Limit (seconds)</span>
              </Label>
              <Input
                id="timeLimit"
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                min="5"
                max="300"
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="points" className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>Points</span>
              </Label>
              <Input
                id="points"
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                min="1"
                max="100"
                disabled={isLoading}
                required
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Answer Options</Label>
            
            {answers.map((answer, index) => (
              <div key={index} className="flex items-start gap-2">
                <Checkbox
                  id={`correct-${index}`}
                  checked={answer.isCorrect}
                  onCheckedChange={(checked) => 
                    handleAnswerChange(index, 'isCorrect', checked === true)
                  }
                  disabled={isLoading}
                />
                <div className="flex-1">
                  <Input
                    id={`answer-${index}`}
                    value={answer.content}
                    onChange={(e) => handleAnswerChange(index, 'content', e.target.value)}
                    placeholder={`Answer option ${index + 1}`}
                    disabled={isLoading}
                    className={answer.isCorrect ? "border-green-500" : ""}
                  />
                </div>
              </div>
            ))}
            
            <p className="text-xs text-muted-foreground">
              Check the box next to each correct answer. At least one answer must be marked as correct.
            </p>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionForm;
