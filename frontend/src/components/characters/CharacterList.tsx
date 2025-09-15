import { Pencil, Trash2 } from 'lucide-react'
import type { Character } from '../../types/character'

type Props = {
  characters: Character[]
  onEdit?: (ch: Character) => void
  onDelete?: (id: string) => void
}

export default function CharacterList({ characters, onEdit, onDelete }: Props) {
  if (!characters?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-500">
        No hay personajes creados
      </div>
    )
  }

  return (
    <ul className="bg-white border border-gray-200 rounded-lg divide-y">
      {characters.map((ch) => (
        <li key={ch.id} className="p-4 flex items-start justify-between gap-4">
          <div>
            <div className="font-semibold text-gray-900">{ch.name}</div>
            <div className="text-sm text-gray-500">
              {ch.age ? `${ch.age} años` : 'Edad no especificada'}
            </div>
            {ch.description && (
              <p className="mt-1 text-gray-700 line-clamp-2">{ch.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(ch)}
                className="p-2 rounded border border-gray-300 hover:bg-gray-50"
                aria-label="Editar personaje"
                title="Editar"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(ch.id)}
                className="p-2 rounded border border-gray-300 text-red-600 hover:bg-red-50"
                aria-label="Eliminar personaje"
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