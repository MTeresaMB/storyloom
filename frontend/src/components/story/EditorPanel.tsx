type Props = {
  isEditing: boolean
  content: string
  editContent: string
  onChange: (v: string) => void
}

export default function EditorPanel({ isEditing, content, editContent, onChange }: Props) {
  return (
    <div className="flex-1 bg-gray-900">
      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-transparent text-gray-100 p-8 resize-none border-none outline-none font-mono text-base leading-7"
          placeholder="Start writing your story..."
          style={{ fontFamily: 'Georgia, serif' }}
        />
      ) : (
        <div className="p-8 text-gray-100 font-mono text-base leading-7 max-w-4xl mx-auto">
          <div className="prose prose-invert max-w-none" style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8' }}>
            {content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="mb-6 text-gray-200">{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}