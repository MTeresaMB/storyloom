export interface WritingStats {
  totalWords: number
  wordsToday: number
  wordsThisWeek: number
  wordsThisMonth: number
  averageWordsPerDay: number
  writingStreak: number
  lastWritingDate: string | null
}

export interface ChapterStats {
  id: string
  title: string
  wordCount: number
  lastModified: string
  wordsAdded: number
}

export interface ProjectAnalytics {
  projectId: string
  projectTitle: string
  totalWords: number
  chapters: ChapterStats[]
  writingStats: WritingStats
  progress: {
    percentage: number
    targetWords: number
    currentWords: number
  }
}
