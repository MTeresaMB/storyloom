import { useCallback, useEffect, useState } from 'react'
import { ProjectAnalytics } from '../../types/analytics'
import { fetchProjectAnalytics } from '../../utils/analytics'

export function useAnalytics(projectId?: string) {
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalyticsData = useCallback(async () => {
    if (!projectId) {
      setAnalytics(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const analyticsData = await fetchProjectAnalytics(projectId)
      setAnalytics(analyticsData)
    } catch (err) {
      console.error('Error in useAnalytics:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar analytics')
      setAnalytics(null)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchAnalyticsData()
  }, [fetchAnalyticsData])

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalyticsData
  }
}