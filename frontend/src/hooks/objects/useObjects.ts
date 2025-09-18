import { useCallback, useEffect, useRef, useState } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '../../api/client'
import type { Object, ObjectFormData } from '../../types/object'
import { getAuthHeader } from '../../api/token'

export function useObjects() {
  const [objects, setObjects] = useState<Object[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const didFetch = useRef(false)

  const fetchObjects = useCallback(async () => {
    try {
      setError(null)
      const headers = await getAuthHeader()
      const data = await apiGet<Object[]>('/api/objects', { headers })
      setObjects(data)
    } catch (e: any) {
      setError(e?.message ?? 'Error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (didFetch.current) return
    didFetch.current = true
    fetchObjects()
  }, [fetchObjects])

  const createObject = useCallback(async (objectData: ObjectFormData) => {
    try {
      setError(null)
      const headers = await getAuthHeader()
      const newObject = await apiPost<Object>('/api/objects', objectData, { headers })
      setObjects(prev => [newObject, ...prev])
      return newObject
    } catch (e: any) {
      setError(e?.message ?? 'Error creating object')
      throw e
    }
  }, [])

  const updateObject = useCallback(async (id: string, objectData: Partial<ObjectFormData>) => {
    try {
      setError(null)
      const headers = await getAuthHeader()
      const updatedObject = await apiPut<Object>(`/api/objects/${id}`, objectData, { headers })
      setObjects(prev => prev.map(o => o.id === id ? updatedObject : o))
      return updatedObject
    } catch (e: any) {
      setError(e?.message ?? 'Error updating object')
      throw e
    }
  }, [])

  const deleteObject = useCallback(async (id: string) => {
    try {
      setError(null)
      const headers = await getAuthHeader()
      await apiDelete(`/api/objects/${id}`, { headers })
      setObjects(prev => prev.filter(o => o.id !== id))
    } catch (e: any) {
      setError(e?.message ?? 'Error deleting object')
      throw e
    }
  }, [])

  return {
    objects,
    loading,
    error,
    fetchObjects,
    createObject,
    updateObject,
    deleteObject
  }
}
