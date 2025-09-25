import { createContext, useContext } from 'react'
import type { Story } from '../types/story'

export type AppUser = { id: string; email: string }
export type AppContextValue = {
  user: AppUser | null
  setUser: (u: AppUser | null) => void
  projects: Story[]
  setProjects: (p: Story[]) => void
  currentProject: Story | null
  setCurrentProject: (p: Story | null) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
  refreshProjects: () => Promise<void>
  createProject: (input: string | { title: string; synopsis?: string; description?: string; genre?: string; target_words?: number }) => Promise<Story>
  updateProjectTitle: (id: string, title: string) => Promise<Story>
  deleteProject: (id: string) => Promise<void>
  updateProjectTarget: (id: string, target: number) => Promise<Story>
  updateProjectDetails: (id: string, input: { title?: string; target_words?: number; description?: string | null; synopsis?: string | null; genre?: string | null }) => Promise<Story>
}

export const AppContext = createContext<AppContextValue | undefined>(undefined)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider')
  return ctx
}