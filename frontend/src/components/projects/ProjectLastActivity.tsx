import { Calendar } from 'lucide-react'

interface ProjectLastActivityProps {
  lastActivity?: string | null
  fallbackDate: string
  className?: string
}

export default function ProjectLastActivity({ 
  lastActivity, 
  fallbackDate, 
  className = '' 
}: ProjectLastActivityProps) {
  return (
    <div className={`flex items-center gap-2 text-xs text-gray-500 mb-4 ${className}`}>
      <Calendar className="h-3 w-3" />
      <span>Last: {new Date(lastActivity || fallbackDate).toLocaleDateString()}</span>
    </div>
  )
}