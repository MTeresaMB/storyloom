import { useCallback, useEffect, useMemo, useState } from "react"
import { AppContext, AppContextValue, AppUser } from "../context/AppContext"
import { supabase } from "../lib/supabaseClient"
import { Story } from "../types/story"

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null)
  const [projects, setProjects] = useState<Story[]>([])
  const [currentProject, setCurrentProject] = useState<Story | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const loadSessionAndProjects = useCallback(async () => {
    const { data: sess } = await supabase.auth.getSession()
    const sbUser = sess.session?.user
    const nextUser: AppUser | null = sbUser ? { id: sbUser.id, email: sbUser.email ?? '' } : null
    setUser(nextUser)
    if (!nextUser) {
      setProjects([])
      setCurrentProject(null)
      return
    }
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('user_id', nextUser.id)
      .order('created_at', { ascending: false })
    if (!error && data) {
      setProjects(data)
      if (!currentProject && data.length > 0) setCurrentProject(data[0])
    }
  }, [currentProject])

  useEffect(() => {
    loadSessionAndProjects()
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadSessionAndProjects()
    })
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [loadSessionAndProjects])

  const refreshProjects = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (!error && data) {
      setProjects(data)
      if (!currentProject && data.length > 0) setCurrentProject(data[0])
    }
  }, [user, currentProject])

  const createProject = useCallback(async (title: string) => {
    if (!user) throw new Error('No autenticado')
    const { data, error } = await supabase
      .from('stories')
      .insert([{ title, status: 'draft', target_words: 0, user_id: user.id }])
      .select('*')
      .single()
    if (error || !data) throw error ?? new Error('No se pudo crear el proyecto')
    setProjects(prev => [data, ...prev])
    if (!currentProject) setCurrentProject(data)
    return data
  }, [user, currentProject])

  const value = useMemo<AppContextValue>(() => ({
    user,
    setUser,
    projects,
    setProjects,
    currentProject,
    setCurrentProject,
    sidebarCollapsed,
    setSidebarCollapsed,
    refreshProjects,
    createProject
  }), [
    user,
    projects,
    currentProject,
    sidebarCollapsed,
    refreshProjects,
    createProject
  ])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
