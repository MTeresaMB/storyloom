import { Edit3, Save, Target, Clock, MoreHorizontal, BookOpen } from 'lucide-react'
import { formatDateTime } from '../../utils/common/dates'
import SaveStatus from '../editor/SaveStatus'
import type { SaveStatus as SaveStatusType } from '../../hooks/editor/useEditor'
import type { Story } from '../../types/story'

type Props = {
  title: string
  wordCount: number
  lastModified: string
  isEditing: boolean
  saveStatus?: SaveStatusType
  project?: Story
  onStartEdit: () => void
  onSave: () => void
  onToggleRight: () => void
}

export default function EditorHeader({
  title, wordCount, lastModified, isEditing, saveStatus, project, onStartEdit, onSave, onToggleRight
}: Props) {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          {/* Título del proyecto */}
          {project && (
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">{project.title}</span>
            </div>
          )}

          {/* Título del capítulo */}
          <h1 className="text-xl font-semibold text-white mb-1">{title}</h1>

          {/* Estadísticas del capítulo */}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {wordCount} words
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDateTime(lastModified)}
            </span>
            {isEditing && saveStatus && <SaveStatus status={saveStatus} />}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <button onClick={onSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center gap-1">
              <Save className="h-4 w-4" /> Save
            </button>
          ) : (
            <button onClick={onStartEdit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-1">
              <Edit3 className="h-4 w-4" /> Edit (Ctrl+E)
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