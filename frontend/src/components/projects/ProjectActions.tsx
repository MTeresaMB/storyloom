import { Eye, Edit3, Trash2 } from 'lucide-react'
import Button from '../ui/Button'
import { ProjectActionsProps } from '../../types/projects'


export default function ProjectActions({
  onStartEdit,
  onOpen,
  onDelete
}: ProjectActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="primary"
        size="sm"
        iconLeft={<Eye className="h-4 w-4" />}
        onClick={onOpen}
        className="flex-1"
      >
        Open
      </Button>

      <Button
        variant="outline"
        size="sm"
        iconLeft={<Edit3 className="h-4 w-4" />}
        onClick={onStartEdit}
        className="px-3"
      />
      <Button
        variant="outline"
        size="sm"
        iconLeft={<Trash2 className="h-4 w-4" />}
        className="px-3 text-red-600 hover:bg-red-50"
        onClick={onDelete}
      />
    </div>
  )
}