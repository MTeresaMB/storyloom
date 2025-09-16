import { useCallback, useEffect, useRef, useState } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '../../api/client'
import type { Character } from '../../types/character'

const USER_ID = 'dac6f4fa-6baf-4966-8d3c-597c1f3afa5e' // Temporal

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const didFetch = useRef(false)
  const inFlight = useRef<AbortController | null>(null)

  const fetchCharacters = useCallback(async () => {
    if (inFlight.current) inFlight.current.abort()
    const ctrl = new AbortController()
    inFlight.current = ctrl
    try {
      setError(null)
      const data = await apiGet<Character[]>('/api/characters', {
        headers: { 'x-user-id': USER_ID },
        signal: ctrl.signal
      })
      setCharacters(data)
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
    fetchCharacters()
    return () => inFlight.current?.abort()
  }, [fetchCharacters])

  const createCharacter = useCallback(async (characterData: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const newCharacter = await apiPost<Character>('/api/characters', characterData, {
        headers: { 'x-user-id': USER_ID }
      })
      setCharacters(prev => [newCharacter, ...prev])
      return newCharacter
    } catch (e: any) {
      setError(e?.message ?? 'Error creating character')
      throw e
    }
  }, [])

  const updateCharacter = useCallback(async (id: string, characterData: Partial<Character>) => {
    try {
      setError(null)
      const updatedCharacter = await apiPut<Character>(`/api/characters/${id}`, characterData, {
        headers: { 'x-user-id': USER_ID }
      })
      setCharacters(prev => prev.map(c => c.id === id ? updatedCharacter : c))
      return updatedCharacter
    } catch (e: any) {
      setError(e?.message ?? 'Error updating character')
      throw e
    }
  }, [])

  const deleteCharacter = useCallback(async (id: string) => {
    try {
      setError(null)
      await apiDelete(`/api/characters/${id}`, {
        headers: { 'x-user-id': USER_ID }
      })
      setCharacters(prev => prev.filter(c => c.id !== id))
    } catch (e: any) {
      setError(e?.message ?? 'Error deleting character')
      throw e
    }
  }, [])

  return {
    characters,
    loading,
    error,
    fetchCharacters,
    createCharacter,
    updateCharacter,
    deleteCharacter
  }
}