import { useEffect } from 'react'
import { useEditor } from '../../hooks/editor/useEditor'
import type { SaveStatus } from '../../hooks/editor/useEditor'

type Props = {
  isEditing: boolean
  content: string
  editContent: string
  onChange: (v: string) => void
  onSave: (content: string) => Promise<void>
  onWordCountChange?: (count: number) => void
  onSaveStatusChange?: (status: SaveStatus) => void
}

export default function EditorPanel({
  isEditing,
  content,
  editContent,
  onChange,
  onSave,
  onWordCountChange,
  onSaveStatusChange
}: Props) {
  const {
    content: editorContent,
    wordCount,
    saveStatus,
    updateContent,
    saveManually,
    initializeContent
  } = useEditor({ onSave })

  useEffect(() => {
    if (isEditing && editContent !== editorContent) {
      initializeContent(editContent)
    }
  }, [isEditing, editContent, editorContent, initializeContent])

  useEffect(() => {
    onWordCountChange?.(wordCount)
  }, [wordCount, onWordCountChange])

  useEffect(() => {
    onSaveStatusChange?.(saveStatus)
  }, [saveStatus, onSaveStatusChange])

  const handleContentChange = (newContent: string) => {
    updateContent(newContent)
    onChange(newContent)
  }

  const handleSave = () => {
    saveManually()
  }

  return (
    <div className="flex-1 bg-gray-900 flex flex-col">
      {isEditing ? (
        <>
          {/* Barra de herramientas del editor */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{wordCount} words</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Save (Ctrl+S)
              </button>
            </div>
          </div>

          {/* Área de edición */}
          <textarea
            value={editorContent}
            onChange={(e) => handleContentChange(e.target.value)}
            className="flex-1 bg-transparent text-gray-100 p-8 resize-none border-none outline-none font-mono text-base leading-7"
            placeholder="Start writing your story..."
            style={{ fontFamily: 'Georgia, serif' }}
            autoFocus
          />
        </>
      ) : (
        <div className="p-8 text-gray-100 font-mono text-base leading-7 max-w-4xl mx-auto">
          <div className="prose prose-invert max-w-none" style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8' }}>
            {content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="mb-6 text-gray-200">{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}