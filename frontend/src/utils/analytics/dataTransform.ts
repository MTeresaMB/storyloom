import type { ChapterStats } from '../../types/analytics'

export const transformChaptersToStats = (chapters: any[]): ChapterStats[] => {
  return chapters.map(chapter => ({
    id: chapter.id,
    title: chapter.title,
    wordCount: chapter.word_count || 0,
    lastModified: chapter.updated_at,
    wordsAdded: chapter.word_count || 0
  }))
}

export const validateProjectData = (project: any): boolean => {
  return !!(
    project &&
    project.id &&
    project.title &&
    typeof project.target_words === 'number'
  )
}

export const extractProjectData = (project: any) => {
  return {
    id: project.id,
    title: project.title,
    target_words: project.target_words || 0,
    created_at: project.created_at,
    updated_at: project.updated_at
  }
}
