# Assessment API Integration Guide

## Overview

The backend assessment API is now live at `http://localhost:8000`. This guide provides everything needed to integrate the frontend with the new persistent assessment storage.

## Base Configuration

Update your frontend API base URL:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
```

## API Endpoints

### 1. Create Assessment
**POST** `/api/v1/assessments`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "customer_id": "uuid-here",
  "company_info": {
    "company_name": "ByteDance",
    "country": "China",
    "industry": "Technology",
    "company_size": "10000+",
    "contact_name": "John Doe",
    "contact_email": "john@bytedance.com"
  }
}
```

**Response (201):**
```json
{
  "id": "assessment-uuid",
  "customer_id": "customer-uuid",
  "status": "in_progress",
  "progress_percentage": 0,
  "company_info": { ... },
  "responses": {},
  "last_category_viewed": null,
  "submitted_at": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### 2. Save/Update Answers
**PUT** `/api/v1/assessments/{assessment_id}/answers`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "responses": {
    "regulatory-scrutiny-cfius-sector": true,
    "regulatory-scrutiny-cfius-sensitivity": 7,
    "regulatory-scrutiny-cfius-disclosure": "We operate in telecommunications"
  },
  "category": "regulatory-scrutiny",
  "progress_percentage": 15
}
```

**Important:** The API **merges** responses - it doesn't replace existing answers. Send only the answers you want to update.

**Response (200):**
```json
{
  "id": "assessment-uuid",
  "customer_id": "customer-uuid",
  "status": "in_progress",
  "progress_percentage": 15,
  "company_info": { ... },
  "responses": {
    "regulatory-scrutiny-cfius-sector": true,
    "regulatory-scrutiny-cfius-sensitivity": 7,
    "regulatory-scrutiny-cfius-disclosure": "We operate in telecommunications"
  },
  "last_category_viewed": "regulatory-scrutiny",
  "submitted_at": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T11:45:00Z"
}
```

### 3. Get Assessment
**GET** `/api/v1/assessments/{assessment_id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "assessment-uuid",
  "customer_id": "customer-uuid",
  "status": "in_progress",
  "progress_percentage": 45,
  "company_info": { ... },
  "responses": { ... },
  "last_category_viewed": "data-security",
  "submitted_at": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T11:45:00Z"
}
```

### 4. Submit Assessment
**POST** `/api/v1/assessments/{assessment_id}/submit`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:** Empty body

**Response (200):**
```json
{
  "id": "assessment-uuid",
  "customer_id": "customer-uuid",
  "status": "submitted",
  "progress_percentage": 100,
  "company_info": { ... },
  "responses": { ... },
  "last_category_viewed": "labor-employment",
  "submitted_at": "2024-01-15T12:00:00Z",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T12:00:00Z"
}
```

**Error (409):** Assessment already submitted

### 5. List Customer Assessments
**GET** `/api/v1/customers/{customer_id}/assessments`

**Query Parameters:**
- `page` (default: 1)
- `page_size` (default: 20)
- `status` (optional: `in_progress`, `completed`, `submitted`)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "items": [
    {
      "id": "assessment-uuid-1",
      "customer_id": "customer-uuid",
      "status": "submitted",
      "progress_percentage": 100,
      "company_name": "ByteDance",
      "submitted_at": "2024-01-15T12:00:00Z",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T12:00:00Z"
    },
    {
      "id": "assessment-uuid-2",
      "customer_id": "customer-uuid",
      "status": "in_progress",
      "progress_percentage": 45,
      "company_name": "ByteDance",
      "submitted_at": null,
      "created_at": "2024-01-20T09:00:00Z",
      "updated_at": "2024-01-20T10:30:00Z"
    }
  ],
  "total": 2,
  "page": 1,
  "page_size": 20,
  "total_pages": 1
}
```

## Integration Steps

### Step 1: Remove localStorage Logic

**Before:**
```typescript
// OLD - Remove this
const saveToLocalStorage = (answers: any) => {
  localStorage.setItem('assessment-answers', JSON.stringify(answers))
}

const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('assessment-answers')
  return saved ? JSON.parse(saved) : {}
}
```

**After:**
```typescript
// NEW - Use API calls
const saveAnswers = async (assessmentId: string, answers: any, category: string, progress: number) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/assessments/${assessmentId}/answers`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      responses: answers,
      category,
      progress_percentage: progress
    })
  })
  return response.json()
}
```

### Step 2: Create Assessment on Start

When user starts the assessment (after company info page):

```typescript
const startAssessment = async (customerId: string, companyInfo: CompanyInfo) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/assessments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      customer_id: customerId,
      company_info: companyInfo
    })
  })
  const assessment = await response.json()
  // Store assessment.id in state/context for subsequent calls
  return assessment
}
```

### Step 3: Save Answers After Each Category

When user completes a category or page:

```typescript
const handleCategoryComplete = async (categoryAnswers: any) => {
  await saveAnswers(
    assessmentId,
    categoryAnswers,
    currentCategory,
    calculateProgress()
  )
}
```

### Step 4: Load Existing Assessment

When user returns to resume:

```typescript
const loadAssessment = async (assessmentId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/assessments/${assessmentId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const assessment = await response.json()
  // Populate form with assessment.responses
  // Jump to assessment.last_category_viewed
  return assessment
}
```

### Step 5: Submit Assessment

When user completes all questions:

```typescript
const submitAssessment = async (assessmentId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/assessments/${assessmentId}/submit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.json()
}
```

## TypeScript Types

```typescript
interface CompanyInfo {
  company_name: string
  country: string
  industry: string
  company_size: string
  contact_name: string
  contact_email: string
}

type AssessmentStatus = 'in_progress' | 'completed' | 'submitted'

interface Assessment {
  id: string
  customer_id: string
  status: AssessmentStatus
  progress_percentage: number
  company_info: CompanyInfo
  responses: Record<string, any>
  last_category_viewed: string | null
  submitted_at: string | null
  created_at: string
  updated_at: string
}

interface AssessmentListItem {
  id: string
  customer_id: string
  status: AssessmentStatus
  progress_percentage: number
  company_name: string
  submitted_at: string | null
  created_at: string
  updated_at: string
}

interface PaginatedAssessments {
  items: AssessmentListItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
}
```

## Error Handling

```typescript
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'API request failed')
  }
  return response.json()
}

// Usage
try {
  const assessment = await createAssessment(customerId, companyInfo)
} catch (error) {
  if (error.message.includes('Customer')) {
    // Handle customer not found
  } else if (error.message.includes('already submitted')) {
    // Handle already submitted
  } else {
    // Generic error handling
  }
}
```

## Migration Checklist

- [ ] Remove all localStorage calls for assessment data
- [ ] Add API client/service for assessment endpoints
- [ ] Call create assessment when user starts
- [ ] Save answers after each category completion
- [ ] Add auto-save (optional: debounced save on answer change)
- [ ] Load existing assessment on page load if resuming
- [ ] Submit assessment on final page
- [ ] Show assessment list in customer dashboard
- [ ] Handle errors (network, 404, 409, etc.)
- [ ] Add loading states during API calls
- [ ] Test resume functionality
- [ ] Test submit and re-submit error handling

## Testing

Use the Swagger docs at http://localhost:8000/docs to test endpoints manually before integrating.

## Notes

- The API merges responses on update - you don't need to send all previous answers
- Assessment ID should be stored in your app state/context after creation
- All endpoints require authentication (Bearer token)
- The `last_category_viewed` field helps with resume functionality
- Progress percentage is calculated client-side and sent to API
