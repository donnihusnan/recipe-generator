export type Recipe = {
  id: number;
  title: string;
  description?: string;
  ingredients?: string[];
  instructions?: string;
  created_at?: string;
  updated_at?: string;
};
