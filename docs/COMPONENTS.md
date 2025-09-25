# Components Documentation

## Overview

StoryLoom utiliza una arquitectura de componentes modular con separación clara de responsabilidades. Los componentes están organizados por dominio y funcionalidad.

## Component Architecture

### Base UI Components (`components/ui/`)

#### Button

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children: React.ReactNode
}
```text

**Usage:**
```tsx
<Button variant="primary" iconLeft={<Plus />} onClick={handleClick}>
  Create Project
</Button>
```text

#### StatCard
```typescript
interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}
```text

**Usage:**
```tsx
<StatCard
  title="Total Words"
  value={15000}
  subtitle="This month"
  icon={<BookOpen />}
  trend="up"
/>
```text

#### ConfirmDialog
```typescript
interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}
```text

**Usage:**
```tsx
<ConfirmDialog
  open={confirmOpen}
  title="Delete Project"
  description="Are you sure you want to delete this project?"
  destructive
  onConfirm={handleDelete}
  onCancel={() => setConfirmOpen(false)}
/>
```text

#### ToastProvider
```typescript
interface ToastProviderProps {
  children: React.ReactNode
}

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  description?: string
  duration?: number
}
```text

**Usage:**
```tsx
const { success, error } = useToast()

// Show success toast
success('Project created successfully')

// Show error toast
error('Failed to create project')
```text

### Project Components (`components/projects/`)

#### ProjectCard
```typescript
interface ProjectCardProps {
  project: Story
  metrics: ProjectMetrics
  isCurrent?: boolean
  onStartEdit: (id: string, title: string) => void
  onSelected: (project: Story) => void
  onOpen: (project: Story) => void
  onDelete: (project: Story) => void
}
```text

**Features:**
- Displays project information
- Shows progress metrics
- Handles project selection
- Provides edit and delete actions

#### CurrentProjectCard
```typescript
interface CurrentProjectCardProps {
  project: Story
  metrics: ProjectMetrics
}
```text

**Features:**
- Highlights current project
- Shows detailed project information
- Displays progress and statistics

#### ProjectHeader
```typescript
interface ProjectHeaderProps {
  project: Story
}
```text

**Features:**
- Project title with icon
- Status badge with color coding
- Project metadata

#### ProjectStats
```typescript
interface ProjectStatsProps {
  totalWords: number
  chaptersCount: number
}
```text

**Features:**
- Word count display
- Chapter count
- Formatted numbers

#### ProjectProgress
```typescript
interface ProjectProgressProps {
  totalWords: number
  targetWords: number
  progressPercentage: number
  onDelete?: () => void
}
```text

**Features:**
- Progress bar visualization
- Percentage display
- Remaining words calculation
- Delete button (optional)

#### ProjectActions
```typescript
interface ProjectActionsProps {
  onStartEdit: () => void
  onOpen: () => void
  onDelete?: () => void
}
```text

**Features:**
- Edit button with keyboard shortcut
- Open button
- Delete button (optional)

#### ProjectLastActivity
```typescript
interface ProjectLastActivityProps {
  lastActivity?: string
  fallbackDate?: string
}
```text

**Features:**
- Last activity timestamp
- Fallback to creation date
- Relative time display

### Story Components (`components/story/`)

#### EditorHeader
```typescript
interface EditorHeaderProps {
  project?: Story
  currentChapter?: Chapter
  onSave: () => void
  onAutoSave: () => void
}
```text

**Features:**
- Project title display
- Chapter information
- Save status indicator
- Auto-save feedback

#### EditorPanel
```typescript
interface EditorPanelProps {
  chapter: Chapter
  onContentChange: (content: string) => void
  onTitleChange: (title: string) => void
  onSave: () => void
  onAutoSave: () => void
}
```text

**Features:**
- Rich text editor
- Auto-save functionality
- Word count display
- Keyboard shortcuts

#### ChapterList
```typescript
interface ChapterListProps {
  chapters: Chapter[]
  selectedId: string
  onSelect: (id: string) => void
  onAdd?: () => void
}
```text

**Features:**
- Chapter navigation
- Active chapter highlighting
- Add chapter button
- Chapter statistics

#### SaveStatus
```typescript
interface SaveStatusProps {
  status: 'saved' | 'saving' | 'error'
  lastSaved?: Date
}
```text

**Features:**
- Visual save status
- Last saved timestamp
- Error indication

### Analytics Components (`components/analytics/`)

#### ProgressChart
```typescript
interface ProgressChartProps {
  data: ProgressData[]
  height?: number
  showLegend?: boolean
}
```text

**Features:**
- Progress visualization
- Interactive charts
- Legend display
- Responsive design

#### WritingStats
```typescript
interface WritingStatsProps {
  stats: WritingStatsData
  period: 'daily' | 'weekly' | 'monthly'
}
```text

**Features:**
- Writing statistics
- Period selection
- Trend analysis
- Goal tracking

## Component Patterns

### 1. Composition Pattern
```tsx
// Parent component composes child components
<ProjectCard>
  <ProjectHeader project={project} />
  <ProjectStats metrics={metrics} />
  <ProjectProgress metrics={metrics} />
  <ProjectActions onEdit={handleEdit} />
</ProjectCard>
```text

### 2. Render Props Pattern
```tsx
// Component with render prop for flexibility
<DataProvider>
  {({ data, loading, error }) => (
    <ProjectList data={data} loading={loading} error={error} />
  )}
</DataProvider>
```text

### 3. Compound Components
```tsx
// Related components grouped together
<Modal>
  <Modal.Header>
    <Modal.Title>Edit Project</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <ProjectForm />
  </Modal.Body>
  <Modal.Footer>
    <Button>Cancel</Button>
    <Button variant="primary">Save</Button>
  </Modal.Footer>
</Modal>
```text

## Styling Guidelines

### CSS Classes
- Use Tailwind CSS utility classes
- Follow consistent spacing (4, 8, 16, 24px)
- Use semantic color names
- Implement responsive design

### Component Styling
```tsx
// Good: Semantic class names
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">
    Project Title
  </h2>
</div>

// Bad: Inline styles
<div style={{ backgroundColor: 'white', borderRadius: '8px' }}>
  <h2 style={{ fontSize: '18px', fontWeight: '600' }}>
    Project Title
  </h2>
</div>
```text

### Responsive Design
```tsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {projects.map(project => (
    <ProjectCard key={project.id} project={project} />
  ))}
</div>
```text

## State Management

### Local State
```tsx
// Use useState for local component state
const [isOpen, setIsOpen] = useState(false)
const [loading, setLoading] = useState(false)
```text

### Context State
```tsx
// Use Context for shared state
const { projects, currentProject, setCurrentProject } = useApp()
```text

### Derived State
```tsx
// Use useMemo for expensive calculations
const projectStats = useMemo(() => {
  return calculateProjectStats(projects)
}, [projects])
```text

## Event Handling

### Click Events
```tsx
// Handle click events
const handleClick = useCallback(() => {
  // Handle click
}, [dependencies])

<Button onClick={handleClick}>Click me</Button>
```text

### Form Events
```tsx
// Handle form submission
const handleSubmit = useCallback((event: FormEvent) => {
  event.preventDefault()
  // Handle form
}, [dependencies])

<form onSubmit={handleSubmit}>
  {/* Form fields */}
</form>
```text

### Keyboard Events
```tsx
// Handle keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault()
      handleSave()
    }
  }

  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [handleSave])
```text

## Performance Optimization

### Memoization
```tsx
// Memoize expensive components
const ProjectCard = memo(({ project, metrics }) => {
  return (
    <div>
      {/* Component content */}
    </div>
  )
})

// Memoize expensive calculations
const projectStats = useMemo(() => {
  return calculateStats(projects)
}, [projects])
```text

### Lazy Loading
```tsx
// Lazy load heavy components
const AnalyticsView = lazy(() => import('./AnalyticsView'))

// Use Suspense for loading states
<Suspense fallback={<LoadingSpinner />}>
  <AnalyticsView />
</Suspense>
```text

### Virtual Scrolling
```tsx
// For large lists
const VirtualizedList = ({ items }) => {
  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={80}
    >
      {({ index, style }) => (
        <div style={style}>
          <ProjectCard project={items[index]} />
        </div>
      )}
    </FixedSizeList>
  )
}
```text

## Testing

### Component Testing
```tsx
// Test component rendering
import { render, screen } from '@testing-library/react'
import ProjectCard from './ProjectCard'

test('renders project card', () => {
  const project = { id: '1', title: 'Test Project' }
  render(<ProjectCard project={project} />)
  expect(screen.getByText('Test Project')).toBeInTheDocument()
})
```text

### Interaction Testing
```tsx
// Test user interactions
import { fireEvent } from '@testing-library/react'

test('handles edit button click', () => {
  const onEdit = jest.fn()
  render(<ProjectCard project={project} onEdit={onEdit} />)

  fireEvent.click(screen.getByText('Edit'))
  expect(onEdit).toHaveBeenCalled()
})
```text

## Accessibility

### ARIA Labels
```tsx
// Add ARIA labels for screen readers
<button
  aria-label="Delete project"
  onClick={handleDelete}
>
  <TrashIcon />
</button>
```text

### Keyboard Navigation
```tsx
// Ensure keyboard accessibility
<div
  tabIndex={0}
  onKeyDown={handleKeyDown}
  role="button"
  aria-pressed={isSelected}
>
  Project Card
</div>
```text

### Focus Management
```tsx
// Manage focus for modals
useEffect(() => {
  if (isOpen) {
    const firstInput = modalRef.current?.querySelector('input')
    firstInput?.focus()
  }
}, [isOpen])
```text

## Best Practices

### 1. Single Responsibility
- Each component should have one clear purpose
- Keep components small and focused
- Extract complex logic into custom hooks

### 2. Props Interface
- Define clear prop interfaces
- Use TypeScript for type safety
- Provide default values where appropriate

### 3. Error Boundaries
```tsx
// Wrap components in error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <ProjectList />
</ErrorBoundary>
```text

### 4. Documentation
- Document component props
- Provide usage examples
- Include accessibility notes

### 5. Consistency
- Follow naming conventions
- Use consistent prop patterns
- Maintain visual consistency
