import { useMemo } from 'react'
import type { ProjectAnalytics } from '../../types/analytics'
import { calculateProgressData, validateAnalytics, getProgressMessage } from '../../utils/analytics/progressUtils'

interface ProgressChartProps {
  analytics: ProjectAnalytics
  className?: string
}

const EMPTY_PROGRESS = {
  percentage: 0,
  remaining: 0,
  isComplete: false,
  hasTarget: false,
  currentWords: 0,
  targetWords: 0
}

export default function ProgressChart({ analytics, className = '' }: ProgressChartProps) {
  const progressData = useMemo(() => {
    if (!validateAnalytics(analytics)) {
      return EMPTY_PROGRESS
    }
    return calculateProgressData(analytics)
  }, [analytics])

  const progressMessage = getProgressMessage(progressData)

  if (!progressData.hasTarget && progressData.currentWords === 0 && progressData.targetWords === 0) {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-sm border ${className}`}>
        <div className="text-center text-gray-500 py-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Progress</h3>
          <p>No analytics data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Project Progress</h3>
        <span className={`text-2xl font-bold ${progressData.isComplete ? 'text-green-600' : 'text-blue-600'}`}>
          {progressData.percentage}%
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{progressData.currentWords.toLocaleString()} words</span>
          <span>{progressData.targetWords.toLocaleString()} target words</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${progressData.isComplete ? 'bg-green-500' : 'bg-blue-500'
              }`}
            style={{ width: `${progressData.percentage}%` }}
          />
        </div>
      </div>

      <p className={`text-sm ${progressData.isComplete ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
        {progressMessage}
      </p>
    </div>
  )
}