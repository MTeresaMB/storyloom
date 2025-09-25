import { Story } from "./story"

export interface DashboardProject extends Story {
  totalWords: number
  progressPercentage: number
  chaptersCount: number
  lastActivity: string | null
}

export interface DashboardStats {
  totalProjects: number
  totalWords: number
  totalChapters: number
  activeProjects: number
  averageWordsPerProject: number
  mostActiveProject: DashboardProject | null
}