import { supabase } from "../../lib/supabaseClient"
import { Story } from "../../types/story"
import { DashboardProject, DashboardStats } from "../../types/dashboard"

export const calculateProjectStats = async (project: Story): Promise<DashboardProject> => {
  try {
    const { data: chapters, error } = await supabase
      .from('chapters')
      .select('word_count, updated_at')
      .eq('story_id', project.id)

    if (error) {
      console.error('Error fetching chapters:', error)
      throw error
    }

    const chaptersData = chapters || []

    const totalWords = chaptersData.reduce((sum, ch) => {
      const wordCount = ch.word_count || 0
      return sum + wordCount
    }, 0)

    const targetWords = project.target_words || 0
    const progressPercentage = targetWords > 0
      ? Math.round((totalWords / targetWords) * 100)
      : 0

    let lastActivity = project.updated_at
    if (chaptersData.length > 0) {
      const sortedChapters = chaptersData.sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      lastActivity = sortedChapters[0].updated_at
    }

    return {
      ...project,
      totalWords,
      progressPercentage,
      chaptersCount: chaptersData.length,
      lastActivity
    }
  } catch (error) {
    console.error('Error calculating project stats:', error)
    return {
      ...project,
      totalWords: 0,
      progressPercentage: 0,
      chaptersCount: 0,
      lastActivity: project.updated_at
    }
  }
}

export const calculateDashboardStats = (projects: DashboardProject[]): DashboardStats => {
  if (!projects || projects.length === 0) {
    return {
      totalProjects: 0,
      totalWords: 0,
      totalChapters: 0,
      activeProjects: 0,
      averageWordsPerProject: 0,
      mostActiveProject: null
    }
  }

  const totalWords = projects.reduce((sum, project) => {
    return sum + (project.totalWords || 0)
  }, 0)

  const totalChapters = projects.reduce((sum, project) => {
    return sum + (project.chaptersCount || 0)
  }, 0)

  const activeProjects = projects.filter(project => {
    return (project.totalWords || 0) > 0
  }).length

  const averageWordsPerProject = Math.round(totalWords / projects.length)

  let mostActiveProject = null
  if (projects.length > 0) {
    mostActiveProject = projects.reduce((most, current) => {
      const currentWords = current.totalWords || 0
      const mostWords = most.totalWords || 0
      return currentWords > mostWords ? current : most
    })
  }

  return {
    totalProjects: projects.length,
    totalWords,
    totalChapters,
    activeProjects,
    averageWordsPerProject,
    mostActiveProject
  }
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
