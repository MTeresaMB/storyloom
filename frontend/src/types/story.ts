export interface Story {
  id: string
  user_id: string
  title: string
  description?: string
  synopsis?: string
  genre?: string
  target_words?: number
  status?: string
  created_at: string
  updated_at: string
}