import { Calendar } from 'lucide-react'
import { computeProjectStatus, getStatusBadgeClasses, getTargetWords } from '../../utils/projects/index'
import { CurrentProjectCardProps } from '../../types/projects'


export default function CurrentProjectCard({ project, metrics }: CurrentProjectCardProps) {
  const totalWords = metrics?.totalWords ?? 0
  const chaptersCount = metrics?.chaptersCount ?? 0
  const progressPercentage = Math.min(metrics?.progressPercentage ?? 0, 100)
  const lastActivity = metrics?.lastActivity

  const targetWords = getTargetWords(project);
  const computedStatus = computeProjectStatus(totalWords, targetWords)
  const remainingWords = targetWords > 0 ? Math.max(targetWords - totalWords, 0) : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
          {project.description && (
            <p className="text-gray-600 mt-2">{project.description}</p>
          )}
          {project.synopsis && (
            <p className="text-gray-600 mt-2">{project.synopsis}</p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClasses(computedStatus)}`}>
          {computedStatus}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalWords.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Words Written</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{progressPercentage}%</div>
          <div className="text-sm text-gray-500">Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{targetWords.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Target Words</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{chaptersCount}</div>
          <div className="text-sm text-gray-500">Chapters</div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{totalWords.toLocaleString()} / {targetWords.toLocaleString()}</span>
          <span>{remainingWords > 0 ? `${remainingWords.toLocaleString()} remaining` : 'Goal achieved!'}</span>
        </div>
      </div>

      {lastActivity && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
          <Calendar className="h-4 w-4" />
          <span>Last activity: {new Date(lastActivity).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  )
}


