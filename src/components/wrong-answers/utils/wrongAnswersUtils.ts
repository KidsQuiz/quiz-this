
import { WrongAnswer, GroupedWrongAnswer } from '../types';

export const groupWrongAnswers = (answers: WrongAnswer[]): GroupedWrongAnswer[] => {
  const grouped = answers.reduce((acc, answer) => {
    // Use question_id as the key for grouping
    const key = answer.question_id;
    
    if (!acc[key]) {
      acc[key] = {
        id: answer.id,
        question_id: answer.question_id,
        question_content: answer.question_content,
        answer_content: answer.answer_content,
        correct_answer_content: answer.correct_answer_content,
        created_at: answer.created_at,
        count: 1,
        latest_date: answer.created_at
      };
    } else {
      // Increment the count for this question
      acc[key].count += 1;
      
      // Update the latest date if this answer is more recent
      const existingDate = new Date(acc[key].latest_date);
      const currentDate = new Date(answer.created_at);
      
      if (currentDate > existingDate) {
        acc[key].latest_date = answer.created_at;
      }
    }
    
    return acc;
  }, {} as Record<string, GroupedWrongAnswer>);
  
  return Object.values(grouped).sort((a, b) => {
    // Sort by count (descending) and then by date (newest first)
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return new Date(b.latest_date).getTime() - new Date(a.latest_date).getTime();
  });
};

export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return new Intl.DateTimeFormat('default', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Error';
  }
};
