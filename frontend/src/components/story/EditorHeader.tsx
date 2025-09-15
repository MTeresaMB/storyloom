import { Edit3, Save, Target, Clock, MoreHorizontal } from 'lucide-react'

type Props = {
  title: string
  wordCount: number
  lastModified: string
  isEditing: boolean
  onStartEdit: () => void
  onSave: () => void
  onToggleRight: () => void
}

export default function EditorHeader({
  title, wordCount, lastModified, isEditing, onStartEdit, onSave, onToggleRight
}: Props) {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">{title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1"><Target className="h-3 w-3" />{wordCount} words</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{lastModified}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <button onClick={onSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center gap-1">
              <Save className="h-4 w-4" /> Save
            </button>
          ) : (
            <button onClick={onStartEdit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-1">
              <Edit3 className="h-4 w-4" /> Edit
            </button>
          )}
          <button onClick={onToggleRight} className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700 transition-colors" aria-label="Toggle right panel">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}