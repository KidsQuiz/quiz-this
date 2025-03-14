
import { WrongAnswer } from '../types';

// Process data for the most frequent wrong answers chart
export const getMostFrequentWrongAnswers = (wrongAnswers: WrongAnswer[]) => {
  if (!wrongAnswers || wrongAnswers.length === 0) {
    console.log("No wrong answers data available for stats");
    return [];
  }
  
  console.log(`Processing ${wrongAnswers.length} wrong answers for stats`);
  
  const questionCounts = wrongAnswers.reduce((acc, answer) => {
    // Use question_content as the key
    const key = answer.question_content;
    if (!acc[key]) {
      acc[key] = { 
        question: key, 
        count: 0,
        correctAnswer: answer.correct_answer_content,
        // Create a shortened version of the question for the pie chart
        shortQuestion: key.length > 20 ? key.substring(0, 20) + '...' : key
      };
    }
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, { question: string; shortQuestion: string; count: number; correctAnswer: string }>);

  return Object.values(questionCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6); // Top 6 wrong answers
};

// Process data for the monthly wrong answers chart
export const getWrongAnswersByMonth = (wrongAnswers: WrongAnswer[]) => {
  if (!wrongAnswers || wrongAnswers.length === 0) {
    return [];
  }
  
  const monthCounts = wrongAnswers.reduce((acc, answer) => {
    // Check if created_at is valid before processing
    if (!answer.created_at) {
      console.warn('Missing created_at in wrong answer:', answer);
      return acc;
    }
    
    try {
      const date = new Date(answer.created_at);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date in wrong answer:', answer.created_at);
        return acc;
      }
      
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = { month: monthYear, count: 0 };
      }
      acc[monthYear].count += 1;
    } catch (error) {
      console.error('Error processing date:', error);
    }
    
    return acc;
  }, {} as Record<string, { month: string; count: number }>);

  // Convert to array and sort chronologically
  return Object.values(monthCounts)
    .sort((a, b) => {
      const [aMonth, aYear] = a.month.split(' ');
      const [bMonth, bYear] = b.month.split(' ');
      const aDate = new Date(`${aMonth} 1, ${aYear}`);
      const bDate = new Date(`${bMonth} 1, ${bYear}`);
      return aDate.getTime() - bDate.getTime();
    })
    .slice(-6); // Last 6 months
};

// Custom render function for pie chart labels
export const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text 
      x={x} 
      y={y} 
      fill="#fff" 
      textAnchor="middle" 
      dominantBaseline="central"
      fontSize={12}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Constants
export const CHART_COLORS = ['#f43f5e', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#6366f1'];
