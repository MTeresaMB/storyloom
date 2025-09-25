import type { ProjectAnalytics } from '../../types/analytics'

export interface ProgressData {
  percentage: number
  remaining: number
  isComplete: boolean
  hasTarget: boolean
  currentWords: number
  targetWords: number
}

export const calculateProgressData = (analytics: ProjectAnalytics): ProgressData => {
  if (!analytics || !analytics.progress) {
    return {
      percentage: 0,
      remaining: 0,
      isComplete: false,
      hasTarget: false,
      currentWords: 0,
      targetWords: 0
    }
  }

  const { progress } = analytics
  const currentWords = progress.currentWords || 0
  const targetWords = progress.targetWords || 0

  if (targetWords === 0) {
    return {
      percentage: 0,
      remaining: 0,
      isComplete: false,
      hasTarget: false,
      currentWords,
      targetWords
    }
  }

  const percentage = Math.min(Math.round((currentWords / targetWords) * 100), 100)
  const remaining = Math.max(targetWords - currentWords, 0)
  const isComplete = currentWords >= targetWords

  return {
    percentage,
    remaining,
    isComplete,
    hasTarget: true,
    currentWords,
    targetWords
  }
}

export const validateAnalytics = (analytics: ProjectAnalytics): boolean => {
  return !!(
    analytics &&
    analytics.progress &&
    typeof analytics.progress.currentWords === 'number' &&
    typeof analytics.progress.targetWords === 'number' &&
    analytics.progress.currentWords >= 0 &&
    analytics.progress.targetWords >= 0
  )
}

export const getProgressMessage = (progressData: ProgressData): string => {
  if (!progressData.hasTarget) {
    return 'No target words set for this project'
  }

  if (progressData.isComplete) {
    return 'Congratulations! You have completed your goal of words'
  }

  return `You need ${progressData.remaining.toLocaleString()} words to complete your goal`
}
