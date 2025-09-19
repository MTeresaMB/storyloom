import type { Story } from "../../types/story"

export function getTargetWords(project: Story): number {
  return project.target_words ?? 0
}

export function getWrittenWords(_project: Story): number {
  // Placeholder hasta que tengamos métrica real de palabras escritas
  return 0
}

export function getProgressPercent(project: Story): number {
  const target = getTargetWords(project)
  const written = getWrittenWords(project)
  if (target <= 0) return 0
  return Math.round((written / target) * 100)
}

export function getStatusBadgeClasses(status?: string): string {
  const s = (status || 'draft').toLowerCase()
  if (s === 'writing') return 'bg-green-100 text-green-800'
  if (s === 'planning') return 'bg-yellow-100 text-yellow-800'
  if (s === 'completed') return 'bg-blue-100 text-blue-800'
  return 'bg-gray-100 text-gray-800'
}

