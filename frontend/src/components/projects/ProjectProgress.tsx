import { ProjectProgressProps } from '../../types/projects'
import Button from '../ui/Button'
export default function ProjectProgress({
  totalWords,
  targetWords,
  progressPercentage,
  onDelete
}: ProjectProgressProps) {
  const safeTotalWords = Math.max(0, totalWords || 0)
  const safeTargetWords = Math.max(0, targetWords || 0)
  const safeProgressPercentage = Math.max(0, Math.min(100, progressPercentage || 0))

  const remainingWords = safeTargetWords > 0 ? safeTargetWords - safeTotalWords : 0

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Progress</span>
        <span>{safeProgressPercentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${safeProgressPercentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{safeTotalWords.toLocaleString()} / {safeTargetWords.toLocaleString()}</span>
        <div className="flex items-center gap-2">
          <span>
            {safeTargetWords > 0
              ? remainingWords > 0
                ? `${remainingWords.toLocaleString()} left`
                : 'Complete!'
              : 'No target'
            }
          </span>
          {onDelete && (
            <Button variant="danger" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}