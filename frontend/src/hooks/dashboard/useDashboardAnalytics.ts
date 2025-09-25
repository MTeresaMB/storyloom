import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { DashboardProject } from '../../types/dashboard'
import { calculateProjectStats } from '../../utils/common/analyticsConsolidated'

export function useDashboardAnalytics(userId?: string) {
  const [projects, setProjects] = useState<DashboardProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = useCallback(async () => {
    if (!userId) {
      setProjects([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data: userProjects, error: projectsError } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (projectsError) {
        console.error('Error fetching projects:', projectsError)
        throw projectsError
      }

      if (!userProjects || userProjects.length === 0) {
        setProjects([])
        setLoading(false)
        return
      }

      const projectsWithStats = await Promise.all(
        userProjects.map(calculateProjectStats)
      )

      setProjects(projectsWithStats)
    } catch (err: any) {
      console.error('Error in fetchDashboardData:', err)
      setError(err?.message || 'Error loading dashboard data')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return {
    projects,
    loading,
    error,
    refetch: fetchDashboardData
  }
}
