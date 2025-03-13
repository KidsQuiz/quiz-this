
export interface Package {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  question_count?: number;
  presentation_order?: 'sequential' | 'shuffle';
}

export interface Milestone {
  id: string;
  name: string;
  image_url: string | null;
  points_required: number;
  kid_id: string;
  created_at: string;
  updated_at: string;
}
