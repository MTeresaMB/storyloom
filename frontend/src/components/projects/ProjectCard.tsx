import ProjectHeader from './ProjectHeader'
import ProjectLastActivity from './ProjectLastActivity'
import ProjectActions from './ProjectActions'
import ProjectProgress from './ProjectProgress'
import ProjectStats from './ProjectStats'
import { ProjectCardProps } from '../../types/projects'
import { computeProjectStatus } from '../../utils/projects/index'

export default function ProjectCard({
  project,
  metrics,
  isCurrent,
  onStartEdit,
  onOpen,
  onSelected,
  onDelete,
}: ProjectCardProps) {
  const totalWords = metrics?.totalWords ?? 0
  const chaptersCount = metrics?.chaptersCount ?? 0
  const progressPercentage = metrics?.progressPercentage ?? 0
  const lastActivity = metrics?.lastActivity
  const targetWords = project.target_words || 0
  const computedStatus = computeProjectStatus(totalWords, targetWords)

  const handleStartEdit = () => {
    onStartEdit?.(project.id, project.title)
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm transition-shadow cursor-pointer border ${isCurrent ? 'border-blue-500 shadow-md ring-2 ring-blue-100' : 'border-gray-200 hover:shadow-md'
      }`} onClick={() => onSelected?.(project)}>
      <div className="p-6">
        <ProjectHeader
          project={{ ...project, status: computedStatus }}
        />

        <ProjectStats
          totalWords={totalWords}
          chaptersCount={chaptersCount}
        />

        <ProjectProgress
          totalWords={totalWords}
          targetWords={targetWords}
          progressPercentage={progressPercentage}
        />

        <ProjectLastActivity
          lastActivity={lastActivity}
          fallbackDate={project.updated_at}
        />

        <ProjectActions
          onStartEdit={handleStartEdit}
          onOpen={onOpen}
          onDelete={onDelete}
        />
      </div>
    </div>
  )
}