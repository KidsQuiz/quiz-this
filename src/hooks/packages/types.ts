
export interface Package {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  question_count?: number;
  presentation_order?: 'sequential' | 'shuffle';
}
