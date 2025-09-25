import { useCallback, useEffect, useRef, useState } from 'react'
import { Chapter } from '../../types/chapter'
import {
  fetchChapters,
  createChapter,
  updateChapter,
  deleteChapter,
  validateChapterParams
} from '../../utils/chapters/apiHelpers'

export function useChapters(storyId?: string) {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const didFetch = useRef(false)

  const fetchChaptersData = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const data = await fetchChapters(storyId)
      setChapters(data)
    } catch (err: any) {
      console.error('Error in fetchChaptersData:', err)
      setError(err?.message ?? 'Error fetching chapters')
      setChapters([])
    } finally {
      setLoading(false)
    }
  }, [storyId])

  useEffect(() => {
    if (didFetch.current) return
    didFetch.current = true
    fetchChaptersData()
  }, [fetchChaptersData])

  const createChapterHandler = useCallback(async (title: string) => {
    try {
      if (!validateChapterParams({ title, story_id: storyId })) {
        throw new Error('Invalid chapter parameters')
      }

      const created = await createChapter(title, storyId)
      setChapters(prev => [created, ...prev])
      return created
    } catch (err: any) {
      console.error('Error creating chapter:', err)
      setError(err?.message ?? 'Error creating chapter')
      throw err
    }
  }, [storyId])

  const updateChapterHandler = useCallback(async (
    id: string,
    patch: Partial<Pick<Chapter, 'title' | 'content'>>
  ) => {
    try {
      if (!validateChapterParams(patch)) {
        throw new Error('Invalid update parameters')
      }

      const updated = await updateChapter(id, patch)
      setChapters(prev => prev.map(c => (c.id === id ? updated : c)))
      return updated
    } catch (err: any) {
      console.error('Error updating chapter:', err)
      setError(err?.message ?? 'Error updating chapter')
      throw err
    }
  }, [])

  const removeChapterHandler = useCallback(async (id: string) => {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid chapter ID')
      }

      await deleteChapter(id)
      setChapters(prev => prev.filter(c => c.id !== id))
    } catch (err: any) {
      console.error('Error removing chapter:', err)
      setError(err?.message ?? 'Error removing chapter')
      throw err
    }
  }, [])

  return {
    chapters,
    loading,
    error,
    fetchChapters: fetchChaptersData,
    createChapter: createChapterHandler,
    updateChapter: updateChapterHandler,
    removeChapter: removeChapterHandler
  }
}



