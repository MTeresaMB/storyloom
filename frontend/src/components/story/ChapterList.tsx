import { Plus } from 'lucide-react'
import { Chapter } from '../../types/chapter'
import { formatDateTime } from '../../utils/common/dates'

type Props = {
  chapters: Chapter[]
  selectedId: string
  onSelect: (id: string) => void
  onAdd?: () => void
}

export default function ChapterList({ chapters, selectedId, onSelect, onAdd }: Props) {
  return (
    <aside className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-white font-semibold">Chapters</h2>
          <button onClick={onAdd} className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="text-xs text-gray-400">
          {chapters.length} chapters • {chapters.reduce((a, c) => a + c.wordCount, 0).toLocaleString()} words
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {chapters.map(ch => {
          const active = selectedId === ch.id
          return (
            <button
              key={ch.id}
              onClick={() => onSelect(ch.id)}
              className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
            >
              <div className="font-medium text-sm mb-1">{ch.title}</div>
              <div className="text-xs opacity-75 flex justify-between">
                <span>{ch.wordCount} words</span>
                <span>{formatDateTime(ch.lastModified)}</span>
              </div>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}