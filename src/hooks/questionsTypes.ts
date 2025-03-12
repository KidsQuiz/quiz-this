
export interface Question {
  id: string;
  content: string;
  time_limit: number;
  points: number;
  package_id: string;
  created_at: string;
  updated_at: string;
}

export interface AnswerOption {
  id: string;
  question_id: string;
  content: string;
  is_correct: boolean;
}
