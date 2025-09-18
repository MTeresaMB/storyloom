import { useCallback, useEffect, useRef, useState } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '../../api/client'
import type { Character, CharacterFormData } from '../../types/character'
import { getAuthHeader } from '../../api/token'


export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const didFetch = useRef(false)

  const fetchCharacters = useCallback(async () => {
    try {
      setError(null)
      const headers = await getAuthHeader()
      const data = await apiGet<Character[]>('/api/characters', { headers })
      setCharacters(data)
    } catch (e: any) {
      setError(e?.message ?? 'Error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (didFetch.current) return
    didFetch.current = true
    fetchCharacters()
  }, [fetchCharacters])

  const createCharacter = useCallback(async (characterData: CharacterFormData) => {
    try {
      setError(null)
      const headers = await getAuthHeader()
      const newCharacter = await apiPost<Character>('/api/characters', characterData, { headers })
      setCharacters(prev => [newCharacter, ...prev])
      return newCharacter
    } catch (e: any) {
      setError(e?.message ?? 'Error creating character')
      throw e
    }
  }, [])

  const updateCharacter = useCallback(async (id: string, characterData: Partial<CharacterFormData>) => {
    try {
      setError(null)
      const headers = await getAuthHeader()
      const updatedCharacter = await apiPut<Character>(`/api/characters/${id}`, characterData, { headers })
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
      const headers = await getAuthHeader()
      await apiDelete(`/api/characters/${id}`, { headers })
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