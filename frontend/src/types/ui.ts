// UI Component Props
export interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color: string
  bgColor: string
  borderColor?: string
  isLongText?: boolean
}

export interface SaveStatusProps {
  status: 'saved' | 'saving' | 'error' | 'unsaved'
  lastSaved?: Date
  error?: string
}

// Dialog Props
export interface NewProjectValues {
  title: string
  synopsis?: string
  genre?: string
  description?: string
  target_words?: number
}

export interface EditProjectValues {
  title: string
  target_words: number
  description?: string
  synopsis?: string
  genre?: string
}

// Toast Types
export interface Toast {
  id: string
  title?: string
  message: string
  variant?: 'default' | 'success' | 'error'
}

// Keyboard Shortcuts
export interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: () => void
  description: string
  preventDefault?: boolean
}

// Editor Types
export type SaveStatus = 'saved' | 'saving' | 'error' | 'unsaved'

export interface UseEditorOptions {
  autoSaveDelay?: number
  onSave?: (content: string) => Promise<void>
  onError?: (error: Error) => void
}

export interface UseStoryEditorProps {
  chapterId?: string
  initialContent?: string
  onSave?: (content: string) => Promise<void>
}
