import ChapterList from '../components/story/ChapterList'
import EditorHeader from '../components/story/EditorHeader'
import EditorPanel from '../components/story/EditorPanel'
import RightPanel from '../components/story/RightPanel'
import { useApp } from '../context/AppContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorAlert from '../components/ui/ErrorAlert'
import { useChapters } from '../hooks/chapters/useChapters'
import { useEditorShortcuts } from '../hooks/editor/useKeyboardShortcuts'
import { useStoryEditor } from '../hooks/story/useStoryEditor'

export default function StoryView() {
  const { currentProject } = useApp()
  const { chapters, loading, error, createChapter, updateChapter } = useChapters(currentProject?.id)

  const {
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
  } = useStoryEditor({ chapters, createChapter, updateChapter })

  useEditorShortcuts({
    onSave: saveChapter,
    onToggleEdit: toggleEdit
  })

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
        project={currentProject}
        onSelect={(id) => setSelectedId(id)}
        onAdd={onAddChapter}
      />
      <main className="flex-1 flex flex-col">
        {selected ? (
          <>
            <EditorHeader
              title={selected.title}
              wordCount={isEditing ? currentWordCount : selected.wordCount}
              lastModified={selected.lastModified}
              isEditing={isEditing}
              saveStatus={saveStatus}
              project={currentProject}
              onStartEdit={startEditing}
              onSave={saveChapter}
              onToggleRight={toggleRightPanel}
            />
            <div className="flex-1 flex">
              <EditorPanel
                isEditing={isEditing}
                content={selected.content}
                editContent={editContent}
                onChange={setEditContent}
                onSave={handleSaveContent}
                onWordCountChange={setCurrentWordCount}
                onSaveStatusChange={setSaveStatus}
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