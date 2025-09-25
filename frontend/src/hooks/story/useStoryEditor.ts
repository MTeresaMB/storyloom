import { useCallback, useState } from 'react'
import type { Chapter } from '../../types/chapter'
import type { SaveStatus } from '../editor/useEditor'

interface UseStoryEditorProps {
  chapters: Chapter[]
  createChapter: (title: string) => Promise<Chapter>
  updateChapter: (id: string, patch: Partial<Pick<Chapter, 'title' | 'content'>>) => Promise<Chapter>
}

export function useStoryEditor({ chapters, createChapter, updateChapter }: UseStoryEditorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [rightOpen, setRightOpen] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [currentWordCount, setCurrentWordCount] = useState(0)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')

  const selected = chapters.length > 0
    ? chapters.find(c => c.id === (selectedId ?? chapters[0]?.id)) ?? null
    : null

  const onAddChapter = useCallback(async () => {
    try {
      const newChapter = await createChapter(`Chapter ${chapters.length + 1}`)
      setSelectedId(newChapter.id)
      setIsEditing(true)
      setEditContent('')
    } catch (error) {
      console.error('Error creating chapter:', error)
    }
  }, [chapters.length, createChapter])

  const startEditing = useCallback(() => {
    if (!selected) return
    setIsEditing(true)
    setEditContent(selected.content)
  }, [selected])

  const saveChapter = useCallback(async () => {
    if (!selected) return
    try {
      await updateChapter(selected.id, { content: editContent })
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving chapter:', error)
    }
  }, [selected, editContent, updateChapter])

  const handleSaveContent = useCallback(async (content: string) => {
    if (!selected) return
    try {
      await updateChapter(selected.id, { content })
    } catch (error) {
      console.error('Error saving content:', error)
    }
  }, [selected, updateChapter])

  const toggleEdit = useCallback(() => {
    if (isEditing) {
      setIsEditing(false)
    } else {
      startEditing()
    }
  }, [isEditing, startEditing])

  const toggleRightPanel = useCallback(() => {
    setRightOpen(prev => !prev)
  }, [])

  return {
    selectedId,
    setSelectedId,
    selected,
    rightOpen,
    isEditing,
    editContent,
    setEditContent,
    currentWordCount,
    setCurrentWordCount,
    saveStatus,
    setSaveStatus,

    onAddChapter,
    startEditing,
    saveChapter,
    handleSaveContent,
    toggleEdit,
    toggleRightPanel
  }
}
