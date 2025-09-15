import { StickyNote, List, Lightbulb } from 'lucide-react'

export default function RightPanel() {
  return (
    <aside className="w-80 bg-gray-800 border-l border-gray-700 p-4">
      <div className="space-y-6">
        <section>
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <StickyNote className="h-4 w-4" /> Notes
          </h3>
          <textarea className="w-full h-32 bg-gray-700 text-gray-100 p-3 rounded border-gray-600 resize-none text-sm" placeholder="Chapter notes..." />
        </section>
        <section>
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <List className="h-4 w-4" /> Outline
          </h3>
          <textarea className="w-full h-32 bg-gray-700 text-gray-100 p-3 rounded border-gray-600 resize-none text-sm" placeholder="Chapter outline..." />
        </section>
        <section>
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" /> Ideas
          </h3>
          <textarea className="w-full h-32 bg-gray-700 text-gray-100 p-3 rounded border-gray-600 resize-none text-sm" placeholder="Story ideas..." />
        </section>
      </div>
    </aside>
  )
}