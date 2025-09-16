import { useCallback, useEffect, useRef, useState } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '../../api/client'
import { Chapter } from '../../types/chapter'

// Temporal: sustituye por el id real del usuario cuando integremos Auth
const USER_ID = 'dac6f4fa-6baf-4966-8d3c-597c1f3afa5e'

export function useChapters() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const didFetch = useRef(false)
  const inFlight = useRef<AbortController | null>(null)

  const headers = { 'x-user-id': USER_ID }

  const fetchChapters = useCallback(async () => {
    if (inFlight.current) inFlight.current.abort()
    const controller = new AbortController()
    inFlight.current = controller
    try {
      setError(null)
      const data = await apiGet<Chapter[]>('/api/chapters', { headers, signal: controller.signal })
      setChapters(data)
    } catch (e: any) {
      if (e?.name !== 'AbortError') setError(e?.message ?? 'Error')
    } finally {
      setLoading(false)
      inFlight.current = null
    }
  }, [])

  useEffect(() => {
    if (didFetch.current) return
    didFetch.current = true
    fetchChapters()
    return () => inFlight.current?.abort()
  }, [fetchChapters])

  const createChapter = useCallback(async (title: string) => {
    const created = await apiPost<Chapter>('/api/chapters', { title }, { headers })
    setChapters(prev => [created, ...prev])
    return created
  }, [])

  const updateChapter = useCallback(async (id: string, patch: Partial<Pick<Chapter, 'title' | 'content'>>) => {
    const updated = await apiPut<Chapter>(`/api/chapters/${id}`, patch, { headers })
    setChapters(prev => prev.map(c => (c.id === id ? updated : c)))
    return updated
  }, [])

  const removeChapter = useCallback(async (id: string) => {
    await apiDelete<{ success: true; id: string }>(`/api/chapters/${id}`, { headers })
    setChapters(prev => prev.filter(c => c.id !== id))
  }, [])

  return { chapters, loading, error, fetchChapters, createChapter, updateChapter, removeChapter }
}



