import { useMemo, useState } from 'react'
import ChapterList from '../components/story/ChapterList'
import EditorHeader from '../components/story/EditorHeader'
import EditorPane from '../components/story/EditorPane'
import RightPanel from '../components/story/RightPanel'
import { useApp } from '../context/AppContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorAlert from '../components/ui/ErrorAlert'
import { useChapters } from '../hooks/chapters/useChapters'

export default function StoryView() {
  const { currentProject } = useApp()
  const { chapters, loading, error, createChapter, updateChapter, removeChapter } = useChapters()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [rightOpen, setRightOpen] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')

  const selected = useMemo(() => {
    if (!chapters.length) return null
    const id = selectedId ?? chapters[0]?.id
    return chapters.find(c => c.id === id) ?? null
  }, [chapters, selectedId])

  const totalWords = useMemo(() => chapters.reduce((a, c) => a + (c.wordCount || 0), 0), [chapters])

  const onAddChapter = async () => {
    const ch = await createChapter(`Chapter ${chapters.length + 1}`)
    setSelectedId(ch.id)
    setIsEditing(true)
    setEditContent('')
  }

  const startEditing = () => {
    if (!selected) return
    setIsEditing(true)
    setEditContent(selected.content)
  }

  const saveChapter = async () => {
    if (!selected) return
    await updateChapter(selected.id, { content: editContent })
    setIsEditing(false)
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">Select a Project to start writing.</div>
      </div>
    )
  }

  if (loading) return <LoadingSpinner />
  return (
    <div className="min-h-screen bg-gray-900 flex">
      <ChapterList
        chapters={chapters}
        selectedId={selected?.id ?? ''}
        onSelect={(id) => setSelectedId(id)}
        onAdd={onAddChapter}
      />
      <main className="flex-1 flex flex-col">
        {selected ? (
          <>
            <EditorHeader
              title={selected.title}
              wordCount={selected.wordCount}
              lastModified={selected.lastModified}
              isEditing={isEditing}
              onStartEdit={startEditing}
              onSave={saveChapter}
              onToggleRight={() => setRightOpen(v => !v)}
            />
            <div className="flex-1 flex">
              <EditorPane
                isEditing={isEditing}
                content={selected.content}
                editContent={editContent}
                onChange={setEditContent}
              />
              {rightOpen && <RightPanel />}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-300">No chapters yet</div>
        )}
        <ErrorAlert message={error ?? ''} />
      </main>
    </div>
  )
}