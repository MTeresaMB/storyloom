// Component Props Types
export interface ProjectStatsProps {
  totalWords: number
  chaptersCount: number
}

export interface ProjectLastActivityProps {
  lastActivity?: string
  fallbackDate?: string
}

export interface WritingStatsProps {
  stats: import('./analytics').WritingStats
  className?: string
}

export interface ProgressChartProps {
  analytics: import('./analytics').ProjectAnalytics
  className?: string
}

export interface ObjectFormProps {
  object?: import('./object').Object
  onSubmit: (data: import('./forms').ObjectFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export interface LocationFormProps {
  location?: import('./location').Location
  onSubmit: (data: import('./forms').LocationFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export interface CharacterFormProps {
  character?: import('./character').Character
  onSubmit: (data: import('./forms').CharacterFormData) => void
  onCancel: () => void
  isLoading?: boolean
}
