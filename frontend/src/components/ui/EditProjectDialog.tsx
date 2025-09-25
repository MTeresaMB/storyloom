import { useEffect, useRef, useState } from 'react'
import Button from './Button'
import type { EditProjectValues } from '../../types/ui'

type Props = {
  open: boolean
  initialTitle: string
  initialTarget?: number
  initialDescription?: string
  initialSynopsis?: string
  initialGenre?: string
  titleText?: string
  confirmLabel?: string
  cancelLabel?: string
  onSubmit: (values: EditProjectValues) => void
  onClose: () => void
}

export default function EditProjectDialog({
  open,
  initialTitle,
  initialTarget = 0,
  initialDescription = '',
  initialSynopsis = '',
  initialGenre = '',
  titleText = 'Edit project',
  confirmLabel = 'Save',
  cancelLabel = 'Cancel',
  onSubmit,
  onClose,
}: Props) {
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState('0')
  const [description, setDescription] = useState(initialDescription)
  const [synopsis, setSynopsis] = useState(initialSynopsis)
  const [genre, setGenre] = useState(initialGenre)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTitle(initialTitle)
      setTarget(String(initialTarget || 0))
      setDescription(initialDescription)
      setSynopsis(initialSynopsis)
      setGenre(initialGenre)
      setError(null)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open, initialTitle, initialTarget, initialDescription, initialSynopsis, initialGenre])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextTitle = title.trim()
    if (nextTitle.length < 1 || nextTitle.length > 100) {
      setError('Title must be between 1 and 100 characters')
      return
    }
    const nextTarget = Math.max(0, Number(target || 0))
    if (!Number.isFinite(nextTarget)) {
      setError('Please enter a valid target number')
      return
    }
    const nextDescription = description.trim() || undefined
    const nextSynopsis = synopsis.trim() || undefined
    const nextGenre = genre.trim() || undefined
    onSubmit({ title: nextTitle, target_words: nextTarget, description: nextDescription, synopsis: nextSynopsis, genre: nextGenre })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{titleText}</h2>
        {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Title</label>
            <input
              ref={inputRef}
              className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Target words</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              inputMode="numeric"
              pattern="[0-9]*"
              value={target}
              onChange={(e) => setTarget(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 50000"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              value={description}
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={5000}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Synopsis</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              value={synopsis}
              rows={3}
              onChange={(e) => setSynopsis(e.target.value)}
              maxLength={5000}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Genre</label>
            <input
              ref={inputRef}
              className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={onClose}>{cancelLabel}</Button>
            <Button variant="primary" type="submit">{confirmLabel}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}


