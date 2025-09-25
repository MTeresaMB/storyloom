import type { ChapterStats, WritingStats } from '../../types/analytics'

export const getDateRanges = () => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  return { today, weekAgo, monthAgo }
}

export const calculateWordsInPeriod = (
  chapters: ChapterStats[],
  startDate: Date
): number => {
  return chapters
    .filter(chapter => new Date(chapter.lastModified) >= startDate)
    .reduce((sum, chapter) => sum + chapter.wordsAdded, 0)
}

export const calculateWritingStreak = (chapters: ChapterStats[]): number => {
  const { today } = getDateRanges()

  const sortedDates = chapters
    .map(chapter => new Date(chapter.lastModified))
    .sort((a, b) => b.getTime() - a.getTime())

  let streak = 0
  let currentDate = new Date(today)

  for (const date of sortedDates) {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    if (dateOnly.getTime() === currentDate.getTime()) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (dateOnly.getTime() < currentDate.getTime()) {
      break
    }
  }

  return streak
}

export const calculateWritingStats = (chapters: ChapterStats[]): WritingStats => {
  const { today, weekAgo, monthAgo } = getDateRanges()

  const totalWords = chapters.reduce((sum, chapter) => sum + chapter.wordCount, 0)
  const wordsToday = calculateWordsInPeriod(chapters, today)
  const wordsThisWeek = calculateWordsInPeriod(chapters, weekAgo)
  const wordsThisMonth = calculateWordsInPeriod(chapters, monthAgo)

  const averageWordsPerDay = wordsThisMonth / 30
  const writingStreak = calculateWritingStreak(chapters)

  const sortedDates = chapters
    .map(chapter => new Date(chapter.lastModified))
    .sort((a, b) => b.getTime() - a.getTime())

  return {
    totalWords,
    wordsToday,
    wordsThisWeek,
    wordsThisMonth,
    averageWordsPerDay: Math.round(averageWordsPerDay),
    writingStreak,
    lastWritingDate: sortedDates[0]?.toISOString() || null
  }
}

export const calculateProgress = (
  currentWords: number,
  targetWords: number
): { percentage: number; targetWords: number; currentWords: number } => {
  const percentage = targetWords > 0 ? Math.round((currentWords / targetWords) * 100) : 0

  return {
    percentage,
    targetWords,
    currentWords
  }
}
