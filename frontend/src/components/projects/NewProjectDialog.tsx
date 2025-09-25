import { useEffect, useRef, useState } from "react"
import Button from "../ui/Button"
import type { NewProjectValues as NewProjectValuesType } from "../../types/ui"

type NewProjectValues = NewProjectValuesType

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (values: NewProjectValues) => void
}

export default function NewProjectDialog({ open, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('')
  const [synopsis, setSynopsis] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('')
  const [target_words, setTargetWords] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setTitle('')
      setSynopsis('')
      setDescription('')
      setGenre('')
      setTargetWords('')
      setError(null)
      setIsLoading(false)
    }
  }, [open])

  if (!open) return null

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newTitle = title.trim()
    if (newTitle.length < 1 || newTitle.length > 100) {
      setError('Title must be between 1 and 100 characters')
      return
    }
    const newSynopsis = synopsis.trim() || undefined
    const newGenre = genre.trim() || undefined
    const newDescription = description.trim()
    const newTargetWords = Math.max(0, Number(target_words || 0))
    setIsLoading(true)
    setError(null)
    try {
      await onSubmit({ title: newTitle, synopsis: newSynopsis, genre: newGenre, description: newDescription, target_words: newTargetWords })
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">New Project</h2>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Title *</label>
            <input
              ref={inputRef}
              className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Synopsis</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              rows={2}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              maxLength={500}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Genre</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              maxLength={50}
              placeholder="e.g. Fantasy"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Target Words</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              inputMode="numeric"
              pattern="[0-9]*"
              value={target_words}
              onChange={(e) => setTargetWords(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 50000"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}