
import { toast } from '@/hooks/use-toast';

export interface QuestionImportData {
  question: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  correctAnswer: string;
  points: string;
  timeLimit?: string;
}

export const parseQuestionsCSV = (csvContent: string): QuestionImportData[] => {
  try {
    const lines = csvContent.split('\n');
    
    // Check if CSV file is empty
    if (lines.length <= 1) {
      throw new Error('CSV file is empty or contains only headers');
    }
    
    // Get headers (first line)
    const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
    
    // Validate headers
    const requiredHeaders = ['question', 'answer1', 'answer2', 'answer3', 'answer4', 'correctanswer', 'points'];
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }
    
    // Parse content
    const questions: QuestionImportData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines
      
      // Handle quoted values with commas inside
      const values: string[] = [];
      let currentValue = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      values.push(currentValue.trim()); // Add the last value
      
      // Create question object
      const question: QuestionImportData = {
        question: values[headers.indexOf('question')],
        answer1: values[headers.indexOf('answer1')],
        answer2: values[headers.indexOf('answer2')],
        answer3: values[headers.indexOf('answer3')],
        answer4: values[headers.indexOf('answer4')],
        correctAnswer: values[headers.indexOf('correctanswer')],
        points: values[headers.indexOf('points')],
      };
      
      // Add time limit if available
      if (headers.includes('timelimit')) {
        question.timeLimit = values[headers.indexOf('timelimit')];
      }
      
      questions.push(question);
    }
    
    return questions;
  } catch (error: any) {
    console.error('Error parsing CSV:', error);
    toast({
      variant: 'destructive',
      title: 'CSV Parsing Error',
      description: error.message || 'Failed to parse CSV file'
    });
    return [];
  }
};
