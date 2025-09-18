import { Pencil, Trash2 } from 'lucide-react'
import type { Location } from '../../types/location'

type Props = {
  locations: Location[]
  onEdit?: (location: Location) => void
  onDelete?: (id: string) => void
}

export default function LocationList({ locations, onEdit, onDelete }: Props) {
  if (!locations?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-500">
        No hay lugares creados
      </div>
    )
  }

  return (
    <ul className="bg-white border border-gray-200 rounded-lg divide-y">
      {locations.map((location) => (
        <li key={location.id} className="p-4 flex items-start justify-between gap-4">
          <div>
            <div className="font-semibold text-gray-900">{location.name}</div>
            <div className="text-sm text-gray-500">
              {location.type ? location.type : 'Tipo no especificado'}
            </div>
            {location.description && (
              <p className="mt-1 text-gray-700 line-clamp-2">{location.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(location)}
                className="p-2 rounded border border-gray-300 hover:bg-gray-50"
                aria-label="Editar lugar"
                title="Editar"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(location.id)}
                className="p-2 rounded border border-gray-300 text-red-600 hover:bg-red-50"
                aria-label="Eliminar lugar"
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
