import { Check, Clock, AlertCircle, Save } from 'lucide-react'
import type { SaveStatus } from '../../hooks/editor/useEditor'

interface SaveStatusProps {
  status: SaveStatus
  className?: string
}

export default function SaveStatus({ status, className = '' }: SaveStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'saved':
        return {
          icon: <Check className="h-3 w-3" />,
          text: 'Guardado',
          className: 'text-green-500'
        }
      case 'saving':
        return {
          icon: <Clock className="h-3 w-3 animate-spin" />,
          text: 'Guardando...',
          className: 'text-blue-500'
        }
      case 'error':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: 'Error al guardar',
          className: 'text-red-500'
        }
      case 'unsaved':
        return {
          icon: <Save className="h-3 w-3" />,
          text: 'Sin guardar',
          className: 'text-yellow-500'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`flex items-center gap-1 text-xs ${config.className} ${className}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  )
}
