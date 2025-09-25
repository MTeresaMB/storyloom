import { BarChart3, Calendar, FileText, Flame, Target, TrendingUp } from 'lucide-react'
import type { WritingStats } from '../../types/analytics'

export interface StatCardConfig {
  title: string
  value: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

export const createWritingStatsCards = (stats: WritingStats): StatCardConfig[] => {
  if (!stats) {
    return []
  }

  return [
    {
      title: 'Words Today',
      value: stats.wordsToday.toLocaleString(),
      icon: <Calendar className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'This Week',
      value: stats.wordsThisWeek.toLocaleString(),
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'This Month',
      value: stats.wordsThisMonth.toLocaleString(),
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Streak',
      value: `${stats.writingStreak} días`,
      icon: <Flame className="h-5 w-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Average Words Per Day',
      value: `${stats.averageWordsPerDay} palabras`,
      icon: <Target className="h-5 w-5" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Total Words',
      value: stats.totalWords.toLocaleString(),
      icon: <FileText className="h-5 w-5" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ]
}

export const validateWritingStats = (stats: WritingStats): boolean => {
  return !!(
    stats &&
    typeof stats.totalWords === 'number' &&
    typeof stats.wordsToday === 'number' &&
    typeof stats.wordsThisWeek === 'number' &&
    typeof stats.wordsThisMonth === 'number' &&
    typeof stats.averageWordsPerDay === 'number' &&
    typeof stats.writingStreak === 'number' &&
    stats.totalWords >= 0 &&
    stats.wordsToday >= 0 &&
    stats.wordsThisWeek >= 0 &&
    stats.wordsThisMonth >= 0 &&
    stats.averageWordsPerDay >= 0 &&
    stats.writingStreak >= 0
  )
}
