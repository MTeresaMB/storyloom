import { useCallback, useEffect, useRef, useState } from 'react'
import { apiGet } from '../api/client'
import type { Character } from '../types/character'

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

  const addCharacter = (c: Character) => setCharacters(prev => [c, ...prev])

  return { characters, loading, error, fetchCharacters, addCharacter }
}