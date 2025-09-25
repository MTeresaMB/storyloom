import { Story } from "./story"

export type ProjectCardProps = {
  project: Story
  metrics: ProjectMetrics
  isCurrent?: boolean
  onStartEdit?: (id: string, currentTitle: string) => void
  onOpen?: () => void
  onSelected?: (project: Story) => void
  onDelete?: () => void
}

export type CurrentProjectCardProps = {
  project: Story,
  metrics: ProjectMetrics
}

export type ProjectMetrics = {
  totalWords: number
  chaptersCount: number
  progressPercentage: number
  lastActivity?: string
}


export type ProjectProgressProps = {
  totalWords: number
  targetWords: number
  progressPercentage: number
  onDelete?: () => void
}

export type ProjectHeaderProps = {
  project: Story
}

export type ProjectActionsProps = {
  onStartEdit?: () => void
  onOpen?: () => void
  onDelete?: () => void
}
