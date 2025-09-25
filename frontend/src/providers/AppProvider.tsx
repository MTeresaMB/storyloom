import { useCallback, useEffect, useMemo, useState } from "react"
import { AppContext, AppContextValue, AppUser } from "../context/AppContext"
import { supabase } from "../lib/supabaseClient"
import { Story } from "../types/story"

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null)
  const [projects, setProjects] = useState<Story[]>([])
  const [currentProject, setCurrentProject] = useState<Story | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const fetchUserProjects = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  }, [])

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
    try {
      const data = await fetchUserProjects(nextUser.id)
      setProjects(data)
      if (!currentProject && data.length > 0) setCurrentProject(data[0])
    } catch {
      console.error('Error loading projects')
    }
  }, [fetchUserProjects, currentProject])

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
    try {
      const data = await fetchUserProjects(user.id)
      setProjects(data)
      if (!currentProject && data.length > 0) setCurrentProject(data[0])
    } catch {
      console.error('Error refreshing projects')
    }
  }, [user, fetchUserProjects, currentProject])

  const createProject = useCallback(async (input: string | {
    title: string
    synopsis?: string
    description?: string
    genre?: string
    target_words?: number
  }) => {
    if (!user) throw new Error('Not authenticated')
    const payload = typeof input === 'string' ? { title: input } : input
    const { data, error } = await supabase
      .from('stories')
      .insert([{
        user_id: user.id,
        title: payload.title,
        description: payload.description ?? null,
        synopsis: payload.synopsis ?? null,
        genre: payload.genre ?? null,
        target_words: typeof payload.target_words === 'number' ? payload.target_words : 0,
        status: 'draft',
      }])
      .select('*')
      .single()
    if (error || !data) throw error ?? new Error('Could not create the project')
    setProjects(prev => [data, ...prev])
    if (!currentProject) setCurrentProject(data)
    return data
  }, [user, currentProject])

  const updateProjectTitle = useCallback(async (id: string, title: string) => {
    if (!user) throw new Error('Not authenticated')
    const { data, error } = await supabase
      .from('stories')
      .update({ title })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single()
    if (error || !data) throw error ?? new Error('Could not update the title')
    setProjects(prev => prev.map(p => p.id === id ? data : p))
    if (currentProject?.id === id) setCurrentProject(data)
    return data
  }, [user, currentProject])

  const deleteProject = useCallback(async (id: string) => {
    if (!user) throw new Error('Not authenticated')
    const { error } = await supabase.from('stories').delete().eq('id', id).eq('user_id', user.id)
    if (error) throw error
    setProjects(prev => prev.filter(p => p.id !== id))
    if (currentProject?.id === id) setCurrentProject(null)
  }, [user, currentProject])

  const updateProjectTarget = useCallback(async (id: string, target: number) => {
    if (!user) throw new Error('Not authenticated')
    const { data, error } = await supabase
      .from('stories')
      .update({ target_words: target })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single()
    if (error || !data) throw error ?? new Error('Could not update the project')
    setProjects(prev => prev.map(p => p.id === id ? data : p))
    if (currentProject?.id === id) setCurrentProject(data)
    return data
  }, [user, currentProject])

  const updateProjectDetails = useCallback(async (
    id: string,
    input: {
      title?: string
      target_words?: number
      description?: string | null
      synopsis?: string | null
      genre?: string | null
    }
  ) => {
    if (!user) throw new Error('Not authenticated')
    const updatePayload: Record<string, any> = {}
    if (typeof input.title === 'string') updatePayload.title = input.title
    if (typeof input.target_words === 'number') updatePayload.target_words = input.target_words
    if (typeof input.description !== 'undefined') updatePayload.description = input.description ?? null
    if (typeof input.synopsis !== 'undefined') updatePayload.synopsis = input.synopsis ?? null
    if (typeof input.genre !== 'undefined') updatePayload.genre = input.genre ?? null
    if (Object.keys(updatePayload).length === 0) {
      const current = projects.find(p => p.id === id)
      if (!current) throw new Error('Project not found')
      return current
    }
    const { data, error } = await supabase
      .from('stories')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single()
    if (error || !data) throw error ?? new Error('Could not update the project')
    setProjects(prev => prev.map(p => p.id === id ? data : p))
    if (currentProject?.id === id) setCurrentProject(data)
    return data
  }, [user, projects, currentProject])

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
    createProject,
    updateProjectTitle,
    deleteProject,
    updateProjectTarget,
    updateProjectDetails
  }), [
    user,
    projects,
    currentProject,
    sidebarCollapsed,
    refreshProjects,
    createProject,
    updateProjectTitle,
    deleteProject,
    updateProjectTarget,
    updateProjectDetails
  ])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
