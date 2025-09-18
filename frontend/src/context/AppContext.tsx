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
  createProject: (title: string) => Promise<Story>
}

export const AppContext = createContext<AppContextValue | undefined>(undefined)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider')
  return ctx
}