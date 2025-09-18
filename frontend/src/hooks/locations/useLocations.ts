import { useCallback, useEffect, useRef, useState } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '../../api/client'
import type { Location, LocationFormData } from '../../types/location'
import { getAuthHeader } from '../../api/token'

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const didFetch = useRef(false)

  const fetchLocations = useCallback(async () => {
    try {
      setError(null)
      const headers = await getAuthHeader()
      const data = await apiGet<Location[]>('/api/locations', { headers })
      setLocations(data)
    } catch (e: any) {
      setError(e?.message ?? 'Error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (didFetch.current) return
    didFetch.current = true
    fetchLocations()
  }, [fetchLocations])

  const createLocation = useCallback(async (locationData: LocationFormData) => {
    try {
      setError(null)
      const headers = await getAuthHeader()
      const newLocation = await apiPost<Location>('/api/locations', locationData, { headers })
      setLocations(prev => [newLocation, ...prev])
      return newLocation
    } catch (e: any) {
      setError(e?.message ?? 'Error creating location')
      throw e
    }
  }, [])

  const updateLocation = useCallback(async (id: string, locationData: Partial<LocationFormData>) => {
    try {
      setError(null)
      const headers = await getAuthHeader()
      const updatedLocation = await apiPut<Location>(`/api/locations/${id}`, locationData, { headers })
      setLocations(prev => prev.map(l => l.id === id ? updatedLocation : l))
      return updatedLocation
    } catch (e: any) {
      setError(e?.message ?? 'Error updating location')
      throw e
    }
  }, [])

  const deleteLocation = useCallback(async (id: string) => {
    try {
      setError(null)
      const headers = await getAuthHeader()
      await apiDelete(`/api/locations/${id}`, { headers })
      setLocations(prev => prev.filter(l => l.id !== id))
    } catch (e: any) {
      setError(e?.message ?? 'Error deleting location')
      throw e
    }
  }, [])

  return {
    locations,
    loading,
    error,
    fetchLocations,
    createLocation,
    updateLocation,
    deleteLocation
  }
}
