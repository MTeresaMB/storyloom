import { apiGet, apiPost, apiPut, apiDelete } from '../../api/client'
import { getAuthHeader } from '../../api/token'
import type { Chapter } from '../../types/chapter'

export const fetchChapters = async (storyId?: string): Promise<Chapter[]> => {
  try {
    const headers = await getAuthHeader()
    const url = storyId ? `/api/chapters?story_id=${storyId}` : '/api/chapters'
    return await apiGet<Chapter[]>(url, { headers })
  } catch (error) {
    console.error('Error fetching chapters:', error)
    throw error
  }
}

export const createChapter = async (title: string, storyId?: string): Promise<Chapter> => {
  try {
    const headers = await getAuthHeader()
    const body = storyId ? { title, story_id: storyId } : { title }
    return await apiPost<Chapter>('/api/chapters', body, { headers })
  } catch (error) {
    console.error('Error creating chapter:', error)
    throw error
  }
}

export const updateChapter = async (
  id: string,
  patch: Partial<Pick<Chapter, 'title' | 'content'>>
): Promise<Chapter> => {
  try {
    const headers = await getAuthHeader()
    return await apiPut<Chapter>(`/api/chapters/${id}`, patch, { headers })
  } catch (error) {
    console.error('Error updating chapter:', error)
    throw error
  }
}

export const deleteChapter = async (id: string): Promise<void> => {
  try {
    const headers = await getAuthHeader()
    await apiDelete<{ success: true; id: string }>(`/api/chapters/${id}`, { headers })
  } catch (error) {
    console.error('Error deleting chapter:', error)
    throw error
  }
}

export const validateChapterParams = (params: any): boolean => {
  if (params.title && typeof params.title !== 'string') return false
  if (params.content && typeof params.content !== 'string') return false
  if (params.story_id && typeof params.story_id !== 'string') return false
  return true
}
