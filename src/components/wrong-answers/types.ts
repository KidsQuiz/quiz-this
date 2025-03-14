
export interface WrongAnswer {
  id: string;
  kid_id: string;
  question_id: string;
  answer_id: string;
  question_content: string;
  answer_content: string;
  correct_answer_content: string;
  created_at: string;
}

export interface GroupedWrongAnswer {
  id: string;
  question_id: string;
  question_content: string;
  answer_content: string;
  correct_answer_content: string;
  created_at: string;
  count: number;
  latest_date: string;
}

export interface WrongAnswersDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  kidId: string;
  kidName: string;
}
