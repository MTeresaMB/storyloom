import { useCallback, useEffect, useRef, useState } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '../../api/client'
import { Chapter } from '../../types/chapter'
import { getAuthHeader } from '../../api/token'


export function useChapters(storyId?: string) {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const didFetch = useRef(false)

  const fetchChapters = useCallback(async () => {
    try {
      setError(null)
      const headers = await getAuthHeader();
      const url = storyId ? `/api/chapters?story_id=${storyId}` : '/api/chapters';
      const data = await apiGet<Chapter[]>(url, { headers });
      setChapters(data);
    } catch (e: any) {
      setError(e?.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  }, [storyId])

  useEffect(() => {
    if (didFetch.current) return
    didFetch.current = true
    fetchChapters()
  }, [fetchChapters])

  const createChapter = useCallback(async (title: string) => {
    const headers = await getAuthHeader();
    const body = storyId ? { title, story_id: storyId } : { title };
    const created = await apiPost<Chapter>(`/api/chapters`, body, { headers })
    setChapters(prev => [created, ...prev])
    return created
  }, [storyId])

  const updateChapter = useCallback(async (id: string, patch: Partial<Pick<Chapter, 'title' | 'content'>>) => {
    const headers = await getAuthHeader();
    const updated = await apiPut<Chapter>(`/api/chapters/${id}`, patch, { headers })
    setChapters(prev => prev.map(c => (c.id === id ? updated : c)))
    return updated
  }, [])

  const removeChapter = useCallback(async (id: string) => {
    const headers = await getAuthHeader();
    await apiDelete<{ success: true; id: string }>(`/api/chapters/${id}`, { headers })
    setChapters(prev => prev.filter(c => c.id !== id))
  }, [])

  return { chapters, loading, error, fetchChapters, createChapter, updateChapter, removeChapter }
}



