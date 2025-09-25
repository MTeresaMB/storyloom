# API Documentation

## Base URL

```text
http://localhost:3001/api
```text

## Authentication

All endpoints require authentication via Supabase JWT token in the Authorization header:

```text
Authorization: Bearer <jwt_token>
```text

## Endpoints

### Projects

#### GET /projects

Get all projects for the authenticated user.

**Response:**

```json
[
  {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "synopsis": "string",
    "genre": "string",
    "target_words": 50000,
    "status": "draft|in_progress|completed",
    "user_id": "uuid",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]
```text

#### POST /projects

Create a new project.

**Request Body:**

```json
{
  "title": "string",
  "description": "string",
  "synopsis": "string",
  "genre": "string",
  "target_words": 50000,
  "status": "draft"
}
```text

**Response:**

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "synopsis": "string",
  "genre": "string",
  "target_words": 50000,
  "status": "draft",
  "user_id": "uuid",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```text

#### PUT /projects/:id

Update a project.

**Request Body:**

```json
{
  "title": "string",
  "description": "string",
  "synopsis": "string",
  "genre": "string",
  "target_words": 50000
}
```text

#### DELETE /projects/:id

Delete a project.

**Response:**

```json
{
  "message": "Project deleted successfully"
}
```text

### Chapters

#### GET /projects/:projectId/chapters

Get all chapters for a project.

**Response:**

```json
[
  {
    "id": "uuid",
    "title": "string",
    "content": "string",
    "word_count": 1500,
    "project_id": "uuid",
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "last_modified": "timestamp"
  }
]
```text

#### POST /projects/:projectId/chapters

Create a new chapter.

**Request Body:**

```json
{
  "title": "string",
  "content": "string"
}
```text

#### PUT /chapters/:id

Update a chapter.

**Request Body:**

```json
{
  "title": "string",
  "content": "string"
}
```text

#### DELETE /chapters/:id

Delete a chapter.

### Analytics

#### GET /analytics/projects/:projectId

Get analytics for a specific project.

**Response:**

```json
{
  "totalWords": 15000,
  "chaptersCount": 5,
  "progressPercentage": 30,
  "lastActivity": "2024-01-15T10:30:00Z",
  "writingStats": {
    "dailyAverage": 500,
    "weeklyTotal": 3500,
    "monthlyTotal": 15000
  }
}
```text

#### GET /analytics/dashboard/:userId

Get dashboard analytics for a user.

**Response:**

```json
{
  "totalProjects": 3,
  "totalWords": 45000,
  "averageProgress": 65,
  "projects": [
    {
      "id": "uuid",
      "title": "string",
      "totalWords": 15000,
      "chaptersCount": 5,
      "progressPercentage": 30,
      "lastActivity": "2024-01-15T10:30:00Z"
    }
  ]
}
```text

## Error Responses

### 400 Bad Request

```json
{
  "error": "Validation error",
  "message": "Invalid input data"
}
```text

### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```text

### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```text

### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```text

## Rate Limiting

- 100 requests per minute per user
- 1000 requests per hour per user

## Content Size Limits

- Maximum request body size: 10MB
- Maximum chapter content: 1MB
- Maximum project description: 500 characters
