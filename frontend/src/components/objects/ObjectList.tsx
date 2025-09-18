import { Pencil, Trash2 } from 'lucide-react'
import type { Object } from '../../types/object'

type Props = {
  objects: Object[]
  onEdit?: (object: Object) => void
  onDelete?: (id: string) => void
}

export default function ObjectList({ objects, onEdit, onDelete }: Props) {
  if (!objects?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-500">
        No hay objetos creados
      </div>
    )
  }

  return (
    <ul className="bg-white border border-gray-200 rounded-lg divide-y">
      {objects.map((object) => (
        <li key={object.id} className="p-4 flex items-start justify-between gap-4">
          <div>
            <div className="font-semibold text-gray-900">{object.name}</div>
            <div className="text-sm text-gray-500">
              {object.type ? object.type : 'Tipo no especificado'}
              {object.importance && ` • ${object.importance}`}
            </div>
            {object.locations && (
              <div className="text-sm text-blue-600">
                📍 {object.locations.name}
              </div>
            )}
            {object.description && (
              <p className="mt-1 text-gray-700 line-clamp-2">{object.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(object)}
                className="p-2 rounded border border-gray-300 hover:bg-gray-50"
                aria-label="Editar objeto"
                title="Editar"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(object.id)}
                className="p-2 rounded border border-gray-300 text-red-600 hover:bg-red-50"
                aria-label="Eliminar objeto"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
