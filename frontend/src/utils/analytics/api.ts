import { supabase } from '../../lib/supabaseClient'
import type { ChapterStats } from '../../types/analytics'
import { transformChaptersToStats, validateProjectData, extractProjectData } from './dataTransform'
import { calculateWritingStats, calculateProgress } from './calculations'

export const fetchProjectChapters = async (projectId: string) => {
  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('*')
    .eq('story_id', projectId)
    .order('updated_at', { ascending: false })

  if (chaptersError) {
    throw new Error(`Error fetching chapters: ${chaptersError.message}`)
  }

  return chapters || []
}

export const fetchProjectData = async (projectId: string) => {
  const { data: project, error: projectError } = await supabase
    .from('stories')
    .select('id, title, target_words, created_at, updated_at')
    .eq('id', projectId)
    .single()

  if (projectError) {
    throw new Error(`Error fetching project: ${projectError.message}`)
  }

  if (!validateProjectData(project)) {
    throw new Error('Invalid project data received')
  }

  return extractProjectData(project)
}

export const fetchProjectAnalytics = async (projectId: string) => {
  try {
    const [chapters, project] = await Promise.all([
      fetchProjectChapters(projectId),
      fetchProjectData(projectId)
    ])

    const chapterStats: ChapterStats[] = transformChaptersToStats(chapters)
    const writingStats = calculateWritingStats(chapterStats)
    const progress = calculateProgress(writingStats.totalWords, project.target_words)

    return {
      projectId,
      projectTitle: project.title,
      totalWords: writingStats.totalWords,
      chapters: chapterStats,
      writingStats,
      progress
    }
  } catch (error) {
    console.error('Error in fetchProjectAnalytics:', error)
    throw error
  }
}
