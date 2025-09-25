import { ProjectHeaderProps } from '../../types/projects'
import { getStatusBadgeClasses } from '../../utils/projects'

export default function ProjectHeader({
  project,
}: ProjectHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{project.title}</h3>
      </div>

      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadgeClasses(project.status || 'draft')}`}>
        {project.status || 'draft'}
      </span>
    </div>
  )
}