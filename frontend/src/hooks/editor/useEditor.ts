import { useCallback, useEffect, useRef, useState } from 'react'

export type SaveStatus = 'saved' | 'saving' | 'error' | 'unsaved'

export interface UseEditorOptions {
  onSave: (content: string) => Promise<void>
  autoSaveInterval?: number 
  debounceMs?: number 
}

export function useEditor({ onSave, autoSaveInterval = 30000, debounceMs = 1000 }: UseEditorOptions) {
  const [content, setContent] = useState('')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const [wordCount, setWordCount] = useState(0)

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()
  const debounceTimeoutRef = useRef<NodeJS.Timeout>()
  const lastSavedContentRef = useRef('')

  const calculateWordCount = useCallback((text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }, [])

  const save = useCallback(async (contentToSave: string) => {
    if (contentToSave === lastSavedContentRef.current) return

    setSaveStatus('saving')
    try {
      await onSave(contentToSave)
      lastSavedContentRef.current = contentToSave
      setSaveStatus('saved')
    } catch (error) {
      console.error('Error saving:', error)
      setSaveStatus('error')
    }
  }, [onSave])

  const debouncedSave = useCallback((contentToSave: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      save(contentToSave)
    }, debounceMs)
  }, [save, debounceMs])

  const updateContent = useCallback((newContent: string) => {
    setContent(newContent)
    setWordCount(calculateWordCount(newContent))

    if (newContent !== lastSavedContentRef.current) {
      setSaveStatus('unsaved')
    }

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      debouncedSave(newContent)
    }, autoSaveInterval)
  }, [calculateWordCount, debouncedSave, autoSaveInterval])

  const saveManually = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    save(content)
  }, [content, save])

  const initializeContent = useCallback((initialContent: string) => {
    setContent(initialContent)
    setWordCount(calculateWordCount(initialContent))
    lastSavedContentRef.current = initialContent
    setSaveStatus('saved')
  }, [calculateWordCount])

  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  return {
    content,
    wordCount,
    saveStatus,
    updateContent,
    saveManually,
    initializeContent
  }
}
