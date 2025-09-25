import { Story } from "../../types/story"

export type ProjectStatus = 'draft' | 'in_progress' | 'completed'

export function computeProjectStatus(totalWords: number, targetWords?: number | null): ProjectStatus {
  const target = typeof targetWords === 'number' ? targetWords : 0
  if (totalWords <= 0) return 'draft'
  if (target > 0 && totalWords >= target) return 'completed'
  return 'in_progress'
}

export function getStatusBadgeClasses(status?: string): string {
  const s = (status || 'draft').toLowerCase()
  if (s === 'in_progress') return 'bg-green-100 text-green-800'
  if (s === 'draft') return 'bg-gray-100 text-gray-800'
  if (s === 'completed') return 'bg-blue-100 text-blue-800'
  return 'bg-gray-100 text-gray-800'
}

export function getTargetWords(project: Story): number {
  return project.target_words ?? 0
}