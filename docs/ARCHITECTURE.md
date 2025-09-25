# Architecture Documentation

## System Overview

StoryLoom es una aplicación web fullstack para escritores que permite gestionar proyectos de escritura, personajes, lugares, objetos y exportar historias a PDF.

## High-Level Architecture

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Supabase)    │
│                 │    │                 │    │                 │
│ - Dashboard     │    │ - REST API      │    │ - PostgreSQL    │
│ - Editor        │    │ - Auth          │    │ - RLS Policies  │
│ - Analytics     │    │ - File Storage  │    │ - Real-time     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```text

## Frontend Architecture

### Technology Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Project Structure

```text
frontend/src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Modal, etc.)
│   ├── projects/       # Project-related components
│   ├── story/          # Story/editor components
│   └── analytics/      # Analytics components
├── hooks/              # Custom React hooks
│   ├── editor/         # Editor-specific hooks
│   ├── dashboard/      # Dashboard hooks
│   └── chapters/       # Chapter management hooks
├── context/            # React Context providers
├── providers/          # Context providers
├── types/              # TypeScript type definitions
├── utils/               # Utility functions
│   ├── analytics/      # Analytics utilities
│   ├── chapters/       # Chapter utilities
│   └── projects/       # Project utilities
└── views/              # Page components
```text

### Key Patterns

#### Context API Pattern

```typescript
// Global state management
const AppContext = createContext<AppContextValue>()
const AppProvider = ({ children }) => {
  // State and logic
}
```text

#### Custom Hooks Pattern

```typescript
// Business logic encapsulation
const useDashboardAnalytics = (userId: string) => {
  // Analytics logic
}
```text

#### Component Composition

```typescript
// Reusable components
<ProjectCard>
  <ProjectHeader />
  <ProjectStats />
  <ProjectProgress />
  <ProjectActions />
</ProjectCard>
```text

## Backend Architecture

### Technology Stack

- **Node.js** - Runtime
- **Express** - Web Framework
- **Supabase** - Database & Auth
- **JWT** - Authentication

### API Structure

```text
backend/
├── routes/             # API route handlers
│   ├── projects.js     # Project endpoints
│   ├── chapters.js     # Chapter endpoints
│   └── analytics.js    # Analytics endpoints
├── middleware/         # Custom middleware
├── utils/              # Utility functions
└── server.js          # Main server file
```text

### Key Patterns

#### RESTful API Design

```text
GET    /api/projects           # List projects
POST   /api/projects           # Create project
PUT    /api/projects/:id       # Update project
DELETE /api/projects/:id       # Delete project
```text

#### Middleware Pattern

```javascript
// Authentication middleware
const authenticate = (req, res, next) => {
  // JWT validation
}
```text

#### Error Handling

```javascript
// Centralized error handling
app.use((err, req, res, next) => {
  // Error response
})
```text

## Database Architecture

### Technology Stack

- **PostgreSQL** - Primary Database
- **Supabase** - Database Hosting
- **Row Level Security (RLS)** - Security
- **Real-time Subscriptions** - Live Updates

### Schema Design

#### Core Tables

```sql
-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  synopsis TEXT,
  genre VARCHAR(100),
  target_words INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chapters table
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  word_count INTEGER DEFAULT 0,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_modified TIMESTAMP DEFAULT NOW()
);
```text

#### Security (RLS Policies)

```sql
-- Projects RLS
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Chapters RLS
CREATE POLICY "Users can view project chapters" ON chapters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = chapters.project_id
      AND user_id = auth.uid()
    )
  );
```text

## Data Flow

### 1. User Authentication

```text
User Login → Supabase Auth → JWT Token → Frontend Storage → API Requests
```text

### 2. Project Creation

```text
User Input → NewProjectDialog → AppContext → API Call → Database → UI Update
```text

### 3. Real-time Updates

```text
Database Change → Supabase Real-time → Frontend Subscription → UI Update
```text

### 4. Analytics Calculation

```text
User Action → Database Update → Analytics Hook → Calculation → UI Display
```text

## Security Considerations

### 1. Authentication

- JWT tokens for API authentication
- Supabase Auth for user management
- Row Level Security for data isolation

### 2. Data Validation

- Frontend form validation
- Backend input sanitization
- Database constraints

### 3. File Upload Security

- File type validation
- Size limits (10MB max)
- Content scanning

## Performance Optimizations

### 1. Frontend

- React.memo for component optimization
- useMemo for expensive calculations
- Lazy loading for analytics views
- Debounced autosave

### 2. Backend

- Connection pooling
- Query optimization
- Caching strategies
- Rate limiting

### 3. Database

- Indexed columns
- Efficient queries
- Real-time subscriptions
- Connection management

## Scalability Considerations

### 1. Horizontal Scaling

- Stateless backend design
- Database connection pooling
- CDN for static assets

### 2. Data Growth

- Pagination for large datasets
- Archive old projects
- Optimize analytics queries

### 3. User Growth

- Authentication scaling
- Database sharding
- Caching layers

## Development Workflow

### 1. Feature Development

1. Create feature branch
2. Implement changes
3. Write tests
4. Create pull request
5. Code review
6. Merge to main

### 2. Database Changes

1. Create migration file
2. Test migration locally
3. Apply to staging
4. Deploy to production

### 3. Deployment

1. Build frontend
2. Deploy backend
3. Run database migrations
4. Update environment variables
