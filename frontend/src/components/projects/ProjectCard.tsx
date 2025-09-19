import { Edit3, Eye, Trash2, Check, X } from 'lucide-react'
import Button from '../ui/Button'
import type { Story } from '../../types/story'
import { getProgressPercent, getStatusBadgeClasses, getTargetWords } from '../../utils/projects/index'
import { useEffect, useRef } from 'react'

type Props = {
  project: Story
  isEditing: boolean
  tempTitle: string
  onStartEdit: (id: string, title: string) => void
  onChangeTitle: (value: string) => void
  onCommitEdit: (id: string) => void
  onCancelEdit: () => void
  onOpen: () => void
}

export default function ProjectCard({
  project,
  isEditing,
  tempTitle,
  onStartEdit,
  onChangeTitle,
  onCommitEdit,
  onCancelEdit,
  onOpen
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const progress = getProgressPercent(project)
  const target = getTargetWords(project)

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          {isEditing ? (
            <input
              ref={inputRef}
              value={tempTitle}
              onChange={(e) => onChangeTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onCommitEdit(project.id)
                if (e.key === 'Escape') onCancelEdit()
              }}
              className="text-lg font-semibold text-gray-900 truncate bg-white border border-gray-300 rounded px-2 py-1 w-full"
            />
          ) : (
            <h3 className="text-lg font-semibold text-gray-900 truncate">{project.title}</h3>
          )}
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadgeClasses(project.status)}`}>
            {project.status || 'draft'}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Target: {target.toLocaleString()} words</span>
            <span className="capitalize">{project.status || 'draft'}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button variant="primary" onClick={onOpen} iconLeft={<Eye className="h-4 w-4" />}>Open</Button>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm" iconLeft={<Check className="h-4 w-4" />} onClick={() => onCommitEdit(project.id)} />
              <Button variant="secondary" size="sm" iconLeft={<X className="h-4 w-4" />} onClick={onCancelEdit} />
            </div>
          ) : (
            <Button variant="secondary" iconLeft={<Edit3 className="h-4 w-4" />} onClick={() => onStartEdit(project.id, project.title)} />
          )}
          <Button variant="danger" iconLeft={<Trash2 className="h-4 w-4" />} />
        </div>
      </div>
    </article>
  )
}


