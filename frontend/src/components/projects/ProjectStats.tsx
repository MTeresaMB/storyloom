interface ProjectStatsProps {
  totalWords: number
  chaptersCount: number
}

export default function ProjectStats({ totalWords, chaptersCount }: ProjectStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="text-center">
        <div className="text-xl font-bold text-blue-600">{totalWords.toLocaleString()}</div>
        <div className="text-xs text-gray-500">Words</div>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold text-green-600">{chaptersCount}</div>
        <div className="text-xs text-gray-500">Chapters</div>
      </div>
    </div>
  )
}