
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { parseQuestionsCSV, QuestionImportData } from '@/utils/csvUtils';

export const useQuestionImport = (packageId: string, onSuccess: () => void) => {
  const [isImporting, setIsImporting] = useState(false);
  
  const processCSVFile = async (file: File, userId?: string) => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to import questions."
      });
      return;
    }
    
    if (!file) {
      toast({
        variant: "destructive",
        title: "File Error",
        description: "Please select a CSV file to import."
      });
      return;
    }
    
    setIsImporting(true);
    
    try {
      // Read the file content
      const fileContent = await file.text();
      
      // Parse CSV content
      const questions = parseQuestionsCSV(fileContent);
      
      if (questions.length === 0) {
        throw new Error("No valid questions found in the CSV file");
      }
      
      // Start a transaction to import questions
      const importedQuestions = [];
      
      for (const questionData of questions) {
        // Insert the question
        const { data: question, error: questionError } = await supabase
          .from('questions')
          .insert({
            package_id: packageId,
            content: questionData.question,
            time_limit: questionData.timeLimit ? parseInt(questionData.timeLimit) : 30,
            points: parseInt(questionData.points) || 10
          })
          .select()
          .single();
          
        if (questionError) throw questionError;
        importedQuestions.push(question);
        
        // Prepare answer options
        const answerOptions = [
          {
            question_id: question.id,
            content: questionData.answer1,
            is_correct: questionData.correctAnswer === '1'
          },
          {
            question_id: question.id,
            content: questionData.answer2,
            is_correct: questionData.correctAnswer === '2'
          },
          {
            question_id: question.id,
            content: questionData.answer3,
            is_correct: questionData.correctAnswer === '3'
          },
          {
            question_id: question.id,
            content: questionData.answer4,
            is_correct: questionData.correctAnswer === '4'
          }
        ];
        
        // Insert answer options
        const { error: answersError } = await supabase
          .from('answer_options')
          .insert(answerOptions);
          
        if (answersError) throw answersError;
      }
      
      toast({
        title: "Import Successful",
        description: `Imported ${importedQuestions.length} questions successfully.`
      });
      
      onSuccess(); // Refresh the questions list
    } catch (error: any) {
      console.error('Error importing questions:', error);
      toast({
        variant: "destructive",
        title: "Import Error",
        description: error.message || "Failed to import questions from CSV file."
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  return {
    isImporting,
    processCSVFile
  };
};
