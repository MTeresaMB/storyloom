import type { Story } from '../../types/story'
import { getProgressPercent, getTargetWords } from '../../utils/projects/index'

type Props = {
  project: Story
}

export default function CurrentProjectCard({ project }: Props) {
  const progress = getProgressPercent(project)
  const target = getTargetWords(project)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Current Project</h2>
          <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
          <p className="text-gray-600 mt-2">{project.description}</p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          {project.status || 'draft'}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-6 mt-6">
        <Metric label="Words Written" value={(0).toLocaleString()} className="text-blue-600" />
        <Metric label="Progress" value={`${progress}%`} className="text-green-600" />
        <Metric label="Target Words" value={target.toLocaleString()} className="text-purple-600" />
        <Metric label="Status" value={project.status || 'draft'} className="text-orange-600" />
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value, className }: { label: string; value: string | number; className?: string }) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${className || ''}`}>{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}


