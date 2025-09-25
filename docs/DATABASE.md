# Database Documentation

## Overview

StoryLoom utiliza PostgreSQL como base de datos principal, hospedada en Supabase. La base de datos está diseñada para soportar múltiples usuarios con aislamiento de datos mediante Row Level Security (RLS).

## Schema Design

### Core Tables

#### 1. Projects Table

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  synopsis TEXT,
  genre VARCHAR(100),
  target_words INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```text

**Fields:**

- `id`: Primary key (UUID)
- `title`: Project title (required, max 255 chars)
- `description`: Project description (optional)
- `synopsis`: Project synopsis (optional)
- `genre`: Project genre (optional, max 100 chars)
- `target_words`: Target word count (default 0)
- `status`: Project status (draft, in_progress, completed)
- `user_id`: Foreign key to auth.users
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

#### 2. Chapters Table

```sql
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  word_count INTEGER DEFAULT 0,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```text

**Fields:**

- `id`: Primary key (UUID)
- `title`: Chapter title (required, max 255 chars)
- `content`: Chapter content (optional)
- `word_count`: Word count (calculated, default 0)
- `project_id`: Foreign key to projects
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp
- `last_modified`: Last modification timestamp

#### 3. Characters Table

```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  age INTEGER,
  role VARCHAR(100),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```text

#### 4. Locations Table

```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(100),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```text

#### 5. Objects Table

```sql
CREATE TABLE objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(100),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```text

## Relationships

### Entity Relationship Diagram

```text
auth.users (1) ──── (N) projects
                    │
                    ├── (1) ──── (N) chapters
                    ├── (1) ──── (N) characters
                    ├── (1) ──── (N) locations
                    └── (1) ──── (N) objects
```text

### Foreign Key Constraints

- `projects.user_id` → `auth.users.id` (CASCADE DELETE)
- `chapters.project_id` → `projects.id` (CASCADE DELETE)
- `characters.project_id` → `projects.id` (CASCADE DELETE)
- `locations.project_id` → `projects.id` (CASCADE DELETE)
- `objects.project_id` → `projects.id` (CASCADE DELETE)

## Row Level Security (RLS)

### Security Policies

#### Projects RLS

```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can view their own projects
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own projects
CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);
```text

#### Chapters RLS

```sql
-- Enable RLS
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

-- Users can view chapters of their projects
CREATE POLICY "Users can view project chapters" ON chapters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = chapters.project_id
      AND user_id = auth.uid()
    )
  );

-- Users can insert chapters to their projects
CREATE POLICY "Users can insert project chapters" ON chapters
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = chapters.project_id
      AND user_id = auth.uid()
    )
  );

-- Users can update chapters of their projects
CREATE POLICY "Users can update project chapters" ON chapters
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = chapters.project_id
      AND user_id = auth.uid()
    )
  );

-- Users can delete chapters of their projects
CREATE POLICY "Users can delete project chapters" ON chapters
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = chapters.project_id
      AND user_id = auth.uid()
    )
  );
```text

#### Characters, Locations, Objects RLS

```sql
-- Similar RLS policies for characters, locations, and objects
-- All reference projects and inherit project ownership
```text

## Indexes

### Performance Indexes

```sql
-- Projects indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);

-- Chapters indexes
CREATE INDEX idx_chapters_project_id ON chapters(project_id);
CREATE INDEX idx_chapters_created_at ON chapters(created_at);
CREATE INDEX idx_chapters_last_modified ON chapters(last_modified);

-- Characters indexes
CREATE INDEX idx_characters_project_id ON characters(project_id);

-- Locations indexes
CREATE INDEX idx_locations_project_id ON locations(project_id);

-- Objects indexes
CREATE INDEX idx_objects_project_id ON objects(project_id);
```text

## Functions and Triggers

### Update Timestamps

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for all tables
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```text

### Word Count Calculation

```sql
-- Function to calculate word count
CREATE OR REPLACE FUNCTION calculate_word_count(content TEXT)
RETURNS INTEGER AS $$
BEGIN
  IF content IS NULL OR content = '' THEN
    RETURN 0;
  END IF;

  RETURN array_length(string_to_array(trim(content), ' '), 1);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update word count
CREATE OR REPLACE FUNCTION update_chapter_word_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.word_count = calculate_word_count(NEW.content);
  NEW.last_modified = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chapter_word_count_trigger
  BEFORE INSERT OR UPDATE ON chapters
  FOR EACH ROW EXECUTE FUNCTION update_chapter_word_count();
```text

## Analytics Views

### Project Statistics View

```sql
CREATE VIEW project_stats AS
SELECT
  p.id,
  p.title,
  p.user_id,
  p.target_words,
  p.status,
  COALESCE(SUM(c.word_count), 0) as total_words,
  COUNT(c.id) as chapters_count,
  CASE
    WHEN p.target_words > 0 THEN
      ROUND((COALESCE(SUM(c.word_count), 0)::DECIMAL / p.target_words) * 100, 2)
    ELSE 0
  END as progress_percentage,
  MAX(c.last_modified) as last_activity
FROM projects p
LEFT JOIN chapters c ON p.id = c.project_id
GROUP BY p.id, p.title, p.user_id, p.target_words, p.status;
```text

### User Dashboard View

```sql
CREATE VIEW user_dashboard_stats AS
SELECT
  user_id,
  COUNT(*) as total_projects,
  SUM(total_words) as total_words_all_projects,
  AVG(progress_percentage) as average_progress,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects
FROM project_stats
GROUP BY user_id;
```text

## Data Types

### Custom Types

```sql
-- Project status enum
CREATE TYPE project_status AS ENUM ('draft', 'in_progress', 'completed');

-- Character role enum
CREATE TYPE character_role AS ENUM ('protagonist', 'antagonist', 'supporting', 'minor');

-- Location type enum
CREATE TYPE location_type AS ENUM ('indoor', 'outdoor', 'fictional', 'real');

-- Object type enum
CREATE TYPE object_type AS ENUM ('weapon', 'tool', 'artifact', 'document', 'other');
```text

## Migration Strategy

### Version Control

- All schema changes are versioned
- Migrations are stored in `database/migrations/`
- Each migration has a unique timestamp
- Rollback scripts are provided

### Migration Files

```text
database/migrations/
├── 0001_initial_schema.sql
├── 0002_add_analytics.sql
├── 0003_rls_policies.sql
└── 0004_analytics_defaults.sql
```text

### Migration Commands

```bash
# Apply migrations
supabase db push

# Reset database
supabase db reset

# Generate new migration
supabase db diff --schema public > migrations/0005_new_feature.sql
```text

## Backup and Recovery

### Backup Strategy

- Daily automated backups via Supabase
- Point-in-time recovery available
- Cross-region replication

### Recovery Procedures

1. Identify the target recovery time
2. Create new database instance
3. Restore from backup
4. Update connection strings
5. Verify data integrity

## Performance Monitoring

### Key Metrics

- Query execution time
- Connection pool usage
- Index usage statistics
- Lock contention

### Monitoring Queries

```sql
-- Slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```text

## Security Considerations

### Data Encryption

- Data encrypted at rest
- TLS encryption in transit
- JWT token encryption

### Access Control

- RLS policies enforce data isolation
- API authentication required
- Admin access restricted

### Audit Logging

- All data changes logged
- User actions tracked
- Compliance reporting available
