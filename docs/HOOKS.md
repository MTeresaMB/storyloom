# Hooks Documentation

## Overview

StoryLoom utiliza hooks personalizados para encapsular lógica de negocio, gestión de estado y efectos secundarios. Los hooks están organizados por dominio y funcionalidad.

## Hook Architecture

### Custom Hooks Structure

```text
hooks/
├── editor/           # Editor-specific hooks
├── dashboard/         # Dashboard hooks
├── chapters/          # Chapter management hooks
├── analytics/         # Analytics hooks
└── story/            # Story editing hooks
```text

## Editor Hooks

### useEditor
```typescript
interface UseEditorOptions {
  initialContent?: string
  onSave?: (content: string) => Promise<void>
  onAutoSave?: (content: string) => Promise<void>
  debounceMs?: number
}

interface UseEditorReturn {
  content: string
  setContent: (content: string) => void
  wordCount: number
  saveStatus: 'saved' | 'saving' | 'error'
  lastSaved: Date | null
  save: () => Promise<void>
  isDirty: boolean
}
```text

**Features:**
- Auto-save functionality with debouncing
- Word count calculation
- Save status tracking
- Dirty state detection
- Manual save capability

**Usage:**
```tsx
const {
  content,
  setContent,
  wordCount,
  saveStatus,
  save,
  isDirty
} = useEditor({
  initialContent: chapter.content,
  onSave: handleSave,
  onAutoSave: handleAutoSave,
  debounceMs: 2000
})
```text

### useKeyboardShortcuts
```typescript
interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: () => void
  description: string
}

interface UseKeyboardShortcutsReturn {
  shortcuts: KeyboardShortcut[]
  addShortcut: (shortcut: KeyboardShortcut) => void
  removeShortcut: (key: string) => void
}
```text

**Features:**
- Keyboard shortcut management
- Global and local shortcuts
- Shortcut descriptions
- Event handling

**Usage:**
```tsx
const { shortcuts, addShortcut } = useKeyboardShortcuts()

useEffect(() => {
  addShortcut({
    key: 's',
    ctrlKey: true,
    action: handleSave,
    description: 'Save document'
  })
}, [handleSave])
```text

## Dashboard Hooks

### useDashboardAnalytics
```typescript
interface DashboardAnalytics {
  projects: ProjectAnalytics[]
  totalProjects: number
  totalWords: number
  averageProgress: number
}

interface UseDashboardAnalyticsReturn {
  analytics: DashboardAnalytics | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}
```text

**Features:**
- Real-time project analytics
- Loading and error states
- Data refetching
- Cached calculations

**Usage:**
```tsx
const { analytics, loading, error, refetch } = useDashboardAnalytics(userId)

if (loading) return <LoadingSpinner />
if (error) return <ErrorAlert message={error} />

return (
  <DashboardStats analytics={analytics} />
)
```text

## Chapter Hooks

### useChapters
```typescript
interface UseChaptersOptions {
  projectId: string
  onChapterSelect?: (chapter: Chapter) => void
}

interface UseChaptersReturn {
  chapters: Chapter[]
  selectedChapter: Chapter | null
  loading: boolean
  error: string | null
  createChapter: (title: string) => Promise<Chapter>
  updateChapter: (id: string, updates: Partial<Chapter>) => Promise<void>
  deleteChapter: (id: string) => Promise<void>
  selectChapter: (id: string) => void
  refetch: () => Promise<void>
}
```text

**Features:**
- Chapter CRUD operations
- Chapter selection
- Loading and error states
- Real-time updates

**Usage:**
```tsx
const {
  chapters,
  selectedChapter,
  createChapter,
  updateChapter,
  deleteChapter,
  selectChapter
} = useChapters({ projectId })

const handleCreateChapter = async () => {
  const title = prompt('Chapter title:')
  if (title) {
    await createChapter(title)
  }
}
```text

## Analytics Hooks

### useAnalytics
```typescript
interface AnalyticsData {
  totalWords: number
  chaptersCount: number
  progressPercentage: number
  lastActivity: string | null
  writingStats: WritingStats
}

interface UseAnalyticsReturn {
  data: AnalyticsData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  calculateProgress: (words: number, target: number) => number
}
```text

**Features:**
- Project analytics calculation
- Progress tracking
- Writing statistics
- Data transformation

**Usage:**
```tsx
const { data, loading, error } = useAnalytics(projectId)

if (loading) return <LoadingSpinner />
if (error) return <ErrorAlert message={error} />

return (
  <div>
    <h3>Progress: {data?.progressPercentage}%</h3>
    <p>Words: {data?.totalWords}</p>
  </div>
)
```text

## Story Hooks

### useStoryEditor
```typescript
interface UseStoryEditorOptions {
  projectId: string
  chapterId?: string
}

interface UseStoryEditorReturn {
  project: Story | null
  chapter: Chapter | null
  content: string
  setContent: (content: string) => void
  wordCount: number
  saveStatus: 'saved' | 'saving' | 'error'
  save: () => Promise<void>
  isDirty: boolean
  loading: boolean
  error: string | null
}
```text

**Features:**
- Story and chapter management
- Content editing
- Auto-save functionality
- State synchronization

**Usage:**
```tsx
const {
  project,
  chapter,
  content,
  setContent,
  wordCount,
  saveStatus,
  save
} = useStoryEditor({ projectId, chapterId })
```text

## Hook Patterns

### 1. Data Fetching Pattern
```tsx
// Standard data fetching hook
const useData = (id: string) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await api.getData(id)
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  return { data, loading, error }
}
```text

### 2. State Management Pattern
```tsx
// Complex state management hook
const useProjectState = (projectId: string) => {
  const [project, setProject] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [tempTitle, setTempTitle] = useState('')

  const startEdit = useCallback(() => {
    setIsEditing(true)
    setTempTitle(project.title)
  }, [project])

  const cancelEdit = useCallback(() => {
    setIsEditing(false)
    setTempTitle('')
  }, [])

  const saveEdit = useCallback(async () => {
    try {
      await updateProject(projectId, { title: tempTitle })
      setProject(prev => ({ ...prev, title: tempTitle }))
      setIsEditing(false)
    } catch (error) {
      // Handle error
    }
  }, [projectId, tempTitle])

  return {
    project,
    isEditing,
    tempTitle,
    setTempTitle,
    startEdit,
    cancelEdit,
    saveEdit
  }
}
```text

### 3. Effect Management Pattern
```tsx
// Effect management with cleanup
const useAutoSave = (content: string, onSave: () => Promise<void>) => {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    if (!content) return

    const timeoutId = setTimeout(async () => {
      try {
        setSaveStatus('saving')
        await onSave()
        setSaveStatus('saved')
        setLastSaved(new Date())
      } catch (error) {
        setSaveStatus('error')
      }
    }, 2000)

    return () => clearTimeout(timeoutId)
  }, [content, onSave])

  return { saveStatus, lastSaved }
}
```text

### 4. Event Handling Pattern
```tsx
// Event handling with cleanup
const useKeyboardShortcuts = () => {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(s =>
        s.key === event.key &&
        s.ctrlKey === event.ctrlKey &&
        s.shiftKey === event.shiftKey &&
        s.altKey === event.altKey
      )

      if (shortcut) {
        event.preventDefault()
        shortcut.action()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])

  const addShortcut = useCallback((shortcut: KeyboardShortcut) => {
    setShortcuts(prev => [...prev, shortcut])
  }, [])

  const removeShortcut = useCallback((key: string) => {
    setShortcuts(prev => prev.filter(s => s.key !== key))
  }, [])

  return { shortcuts, addShortcut, removeShortcut }
}
```text

## Performance Optimization

### Memoization
```tsx
// Memoize expensive calculations
const useProjectStats = (projects: Project[]) => {
  const stats = useMemo(() => {
    return projects.reduce((acc, project) => {
      acc.totalWords += project.totalWords
      acc.totalProjects += 1
      acc.averageProgress += project.progressPercentage
      return acc
    }, { totalWords: 0, totalProjects: 0, averageProgress: 0 })
  }, [projects])

  return stats
}
```text

### Debouncing
```tsx
// Debounce expensive operations
const useDebouncedValue = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```text

### Lazy Loading
```tsx
// Lazy load data
const useLazyData = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await api.getData()
      setData(result)
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, loadData }
}
```text

## Error Handling

### Error Boundaries
```tsx
// Error boundary hook
const useErrorBoundary = () => {
  const [error, setError] = useState<Error | null>(null)

  const resetError = useCallback(() => {
    setError(null)
  }, [])

  const captureError = useCallback((error: Error) => {
    setError(error)
  }, [])

  return { error, resetError, captureError }
}
```text

### Retry Logic
```tsx
// Retry mechanism
const useRetry = (fn: () => Promise<any>, maxRetries: number = 3) => {
  const [retryCount, setRetryCount] = useState(0)
  const [error, setError] = useState(null)

  const execute = useCallback(async () => {
    try {
      setError(null)
      const result = await fn()
      setRetryCount(0)
      return result
    } catch (err) {
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1)
        setTimeout(() => execute(), 1000 * retryCount)
      } else {
        setError(err)
      }
    }
  }, [fn, maxRetries, retryCount])

  return { execute, retryCount, error }
}
```text

## Testing Hooks

### Testing Custom Hooks
```tsx
// Test hook with renderHook
import { renderHook, act } from '@testing-library/react-hooks'
import { useEditor } from './useEditor'

test('useEditor should handle content changes', () => {
  const { result } = renderHook(() => useEditor({
    initialContent: 'Hello world'
  }))

  expect(result.current.content).toBe('Hello world')

  act(() => {
    result.current.setContent('Updated content')
  })

  expect(result.current.content).toBe('Updated content')
})
```text

### Mocking Dependencies
```tsx
// Mock API calls
jest.mock('../api/projects', () => ({
  getProjects: jest.fn(),
  createProject: jest.fn(),
  updateProject: jest.fn(),
  deleteProject: jest.fn()
}))

test('useProjects should fetch projects', async () => {
  const mockProjects = [{ id: '1', title: 'Test Project' }]
  api.getProjects.mockResolvedValue(mockProjects)

  const { result } = renderHook(() => useProjects())

  await waitFor(() => {
    expect(result.current.projects).toEqual(mockProjects)
  })
})
```text

## Best Practices

### 1. Single Responsibility
- Each hook should have one clear purpose
- Keep hooks focused and small
- Extract complex logic into separate hooks

### 2. Dependency Management
- Use useCallback for stable function references
- Use useMemo for expensive calculations
- Minimize dependencies in useEffect

### 3. Error Handling
- Always handle errors gracefully
- Provide fallback values
- Log errors for debugging

### 4. Performance
- Memoize expensive operations
- Debounce user input
- Clean up subscriptions and timers

### 5. Testing
- Test hook behavior in isolation
- Mock external dependencies
- Test error scenarios

### 6. Documentation
- Document hook parameters and return values
- Provide usage examples
- Include performance considerations
