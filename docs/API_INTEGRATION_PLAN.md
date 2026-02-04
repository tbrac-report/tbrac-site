# TBRAC Frontend API Integration Plan

## Executive Summary

This document outlines the changes needed to integrate the TBRAC backend API into the existing Next.js frontend. The current application uses localStorage for all data persistence; we will replace this with proper API calls to the backend while maintaining the existing UI/UX.

---

## Current State Analysis

### What Exists
- Complete assessment flow with 10 categories and ~60 questions
- Robust type system with Zod validation
- Scoring engine and result calculation
- Report generation (HTML/PDF)
- Evaluator workflow UI
- Multilingual support (EN/ZH)
- localStorage-based state management
- Demo authentication (localStorage-based)

### What's Missing
- No backend API integration
- No Supabase authentication
- No persistent data storage
- No environment variables configured
- No API error handling

---

## Implementation Tasks

### Phase 1: Foundation Setup

#### 1.1 Install Dependencies
**File: `package.json`**

Add to dependencies:
```json
{
  "@supabase/supabase-js": "^2.x"
}
```

Command:
```bash
pnpm add @supabase/supabase-js
```

#### 1.2 Create Environment Variables
**File: `.env.local` (new)**

```env
# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**File: `.env.example` (new)**

```env
# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

### Phase 2: Core API Infrastructure

#### 2.1 Create Supabase Client
**File: `lib/supabase.ts` (new)**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### 2.2 Create API Types
**File: `lib/api-types.ts` (new)**

This file contains all TypeScript types for the API. See the full implementation in the integration guide:

- `IndustrySector` enum
- `OwnershipType` enum
- `DocumentType` enum
- `ProcessingStatus` enum
- `CustomerBase`, `CustomerCreate`, `CustomerUpdate`, `Customer`, `CustomerListItem` interfaces
- `Document`, `DocumentListItem`, `DocumentUploadResponse`, `DocumentDownloadResponse` interfaces
- `PaginatedResponse<T>` interface

#### 2.3 Create API Client
**File: `lib/api-client.ts` (new)**

This file contains:

- `APIError` class for structured error handling
- `getAuthHeaders()` function to get Supabase JWT
- `apiRequest<T>()` for unauthenticated requests
- `authenticatedRequest<T>()` for authenticated requests
- `api` object with all endpoint methods:
  - `api.health()`
  - `api.healthReady()`
  - `api.customers.list()`, `.get()`, `.create()`, `.update()`, `.delete()`, `.documents()`
  - `api.documents.get()`, `.upload()`, `.getDownloadUrl()`, `.updateClassification()`, `.delete()`

---

### Phase 3: Authentication System

#### 3.1 Create Auth Context
**File: `lib/auth-context.tsx` (new)**

Replace the demo evaluator authentication with real Supabase auth:

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Implementation from integration guide
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

#### 3.2 Update Root Layout
**File: `app/layout.tsx`**

Wrap the app with `AuthProvider`:

```typescript
import { AuthProvider } from '@/lib/auth-context'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <LanguageProvider>
            {/* existing content */}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
```

#### 3.3 Update Evaluator Login Page
**File: `app/evaluator-login/page.tsx`**

Replace localStorage-based demo auth with Supabase:

Current (to remove):
```typescript
// Demo authentication
localStorage.setItem("evaluator_session", JSON.stringify({
  email,
  name: "Demo Evaluator",
  loginTime: new Date().toISOString()
}))
```

Replace with:
```typescript
import { useAuth } from '@/lib/auth-context'

// Use real Supabase auth
const { signIn, loading } = useAuth()
await signIn(email, password)
```

#### 3.4 Create Protected Route Component
**File: `components/protected-route.tsx` (new)**

```typescript
'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/evaluator-login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
```

#### 3.5 Update Evaluator Pages
**Files to update:**
- `app/evaluator/dashboard/page.tsx`
- `app/evaluator/review/[id]/page.tsx`

Wrap with `ProtectedRoute` and remove localStorage session checks:

```typescript
import { ProtectedRoute } from '@/components/protected-route'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      {/* existing dashboard content */}
    </ProtectedRoute>
  )
}
```

---

### Phase 4: Customer Management Integration

#### 4.1 Create Customer Hooks
**File: `hooks/use-customers.ts` (new)**

```typescript
import { useState, useEffect, useCallback } from 'react'
import { api, APIError } from '@/lib/api-client'
import { Customer, CustomerListItem, CustomerCreate, PaginatedResponse } from '@/lib/api-types'

export function useCustomers(params?: {
  page?: number
  pageSize?: number
  search?: string
}) {
  const [data, setData] = useState<PaginatedResponse<CustomerListItem> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.customers.list({
        page: params?.page,
        page_size: params?.pageSize,
        search: params?.search,
      })
      setData(result)
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }, [params?.page, params?.pageSize, params?.search])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, refetch: load }
}

export function useCustomer(id: string) {
  // Similar implementation for single customer
}

export function useCreateCustomer() {
  // Implementation for creating customers
}
```

#### 4.2 Create Customer Pages (New Section)
**Files to create:**
- `app/customers/page.tsx` - Customer list
- `app/customers/new/page.tsx` - Create customer form
- `app/customers/[id]/page.tsx` - Customer detail view
- `app/customers/[id]/documents/page.tsx` - Customer documents

These are new pages for managing customers and documents via the backend API.

---

### Phase 5: Document Management Integration

#### 5.1 Create Document Hooks
**File: `hooks/use-documents.ts` (new)**

```typescript
import { useState } from 'react'
import { api, APIError } from '@/lib/api-client'
import { Document, DocumentUploadResponse } from '@/lib/api-types'

export function useDocumentUpload(customerId: string) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const upload = async (files: File[]): Promise<DocumentUploadResponse[]> => {
    setUploading(true)
    setError(null)
    try {
      const results = await api.documents.upload(customerId, files)
      return results
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Upload failed')
      throw err
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading, progress, error }
}

export function useDocumentDownload() {
  // Implementation for downloading documents
}
```

#### 5.2 Create Document Upload Component
**File: `components/document-upload.tsx` (new)**

A reusable component for uploading documents to a customer:
- Drag-and-drop support
- File type validation (PDF, JPEG, PNG, DOCX)
- File size validation (max 50MB)
- Upload progress indicator
- Error handling

---

### Phase 6: API Error Handling

#### 6.1 Create Error Boundary
**File: `components/api-error-boundary.tsx` (new)**

```typescript
'use client'

import { Component, ReactNode } from 'react'
import { APIError } from '@/lib/api-client'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: APIError
}

export class APIErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    if (error instanceof APIError) {
      return { hasError: true, error }
    }
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
        </div>
      )
    }
    return this.props.children
  }
}
```

#### 6.2 Create Toast Notifications for API Errors
**File: `hooks/use-api-toast.ts` (new)**

Extend existing toast system to handle API errors:

```typescript
import { useToast } from './use-toast'
import { APIError } from '@/lib/api-client'

export function useApiToast() {
  const { toast } = useToast()

  const handleError = (error: unknown) => {
    if (error instanceof APIError) {
      switch (error.status) {
        case 401:
          toast({ title: 'Session expired', description: 'Please log in again', variant: 'destructive' })
          break
        case 403:
          toast({ title: 'Access denied', description: 'You do not have permission', variant: 'destructive' })
          break
        case 404:
          toast({ title: 'Not found', description: error.message, variant: 'destructive' })
          break
        default:
          toast({ title: 'Error', description: error.message, variant: 'destructive' })
      }
    } else {
      toast({ title: 'Network error', description: 'Please check your connection', variant: 'destructive' })
    }
  }

  return { handleError }
}
```

---

### Phase 7: Migration Strategy for Existing Features

#### 7.1 Assessment Submission Flow

The current assessment flow stores data in localStorage. We need to decide:

**Option A: Keep localStorage for assessment, submit to API at end**
- Assessment progress remains in localStorage during completion
- On final submission, create customer + upload assessment as document
- Pros: Minimal changes to existing flow
- Cons: Data not persisted until submission

**Option B: Create assessment sessions via API**
- New API endpoint for assessment sessions
- Save progress to backend as user completes
- Pros: Data persisted immediately
- Cons: Requires backend changes, more API calls

**Recommendation: Option A** - Keep localStorage for in-progress assessments, integrate with API on submission.

#### 7.2 Evaluator Dashboard Migration

Current: Loads mock/demo submissions from localStorage
Target: Load real submissions from API

**Changes needed:**
1. Replace localStorage reads with `api.customers.list()` calls
2. Each customer represents a "submission" in the evaluator view
3. Customer documents contain the assessment data
4. Evaluator notes stored as document metadata or separate API

---

## File Change Summary

### New Files to Create

| File | Purpose |
|------|---------|
| `lib/supabase.ts` | Supabase client initialization |
| `lib/api-types.ts` | TypeScript types for API |
| `lib/api-client.ts` | API client with all endpoints |
| `lib/auth-context.tsx` | Authentication context provider |
| `components/protected-route.tsx` | Route protection wrapper |
| `components/document-upload.tsx` | Document upload component |
| `components/api-error-boundary.tsx` | Error boundary for API errors |
| `hooks/use-customers.ts` | Customer data hooks |
| `hooks/use-documents.ts` | Document management hooks |
| `hooks/use-api-toast.ts` | API error toast handling |
| `app/customers/page.tsx` | Customer list page |
| `app/customers/new/page.tsx` | Create customer page |
| `app/customers/[id]/page.tsx` | Customer detail page |
| `app/customers/[id]/documents/page.tsx` | Customer documents page |
| `.env.local` | Environment variables |
| `.env.example` | Environment variable template |

### Files to Modify

| File | Changes |
|------|---------|
| `package.json` | Add `@supabase/supabase-js` dependency |
| `app/layout.tsx` | Wrap with `AuthProvider` |
| `app/evaluator-login/page.tsx` | Use Supabase auth instead of localStorage |
| `app/evaluator/dashboard/page.tsx` | Use `ProtectedRoute`, load from API |
| `app/evaluator/review/[id]/page.tsx` | Use `ProtectedRoute`, load from API |

---

## Implementation Order

1. **Phase 1: Foundation** (~30 min)
   - Install dependencies
   - Create environment files
   - Create Supabase client

2. **Phase 2: API Client** (~1 hour)
   - Create API types
   - Create API client with all endpoints

3. **Phase 3: Authentication** (~1 hour)
   - Create auth context
   - Update layout with provider
   - Update login page
   - Create protected route component

4. **Phase 4: Customer Management** (~2 hours)
   - Create customer hooks
   - Create customer pages (list, detail, create)

5. **Phase 5: Document Management** (~1 hour)
   - Create document hooks
   - Create upload component
   - Integrate with customer pages

6. **Phase 6: Error Handling** (~30 min)
   - Create error boundary
   - Create API error toast handler

7. **Phase 7: Evaluator Migration** (~1 hour)
   - Update dashboard to use API
   - Update review page to use API

---

## Testing Checklist

- [ ] Health check endpoint works without auth
- [ ] User can sign up via Supabase
- [ ] User can sign in via Supabase
- [ ] User can sign out
- [ ] Unauthenticated users are redirected from protected routes
- [ ] Customers can be listed
- [ ] Customers can be created
- [ ] Customers can be viewed
- [ ] Customers can be updated
- [ ] Customers can be deleted
- [ ] Documents can be uploaded
- [ ] Documents can be downloaded
- [ ] Documents can be deleted
- [ ] API errors show appropriate toast notifications
- [ ] Network errors are handled gracefully

---

## Notes for Implementation

1. **CORS**: Backend is configured for `localhost:3000` and `localhost:5173`. If using a different port, update backend `CORS_ORIGINS`.

2. **File Uploads**: Max 50MB per file. Allowed types: PDF, JPEG, PNG, DOCX.

3. **Authentication**: Supabase tokens expire after 1 hour by default. The auth context handles token refresh automatically.

4. **Existing localStorage Keys**: 
   - `tbrac_company_info` - Can remain for in-progress assessments
   - `tbrac_responses` - Can remain for in-progress assessments
   - `tbrac_submission` - Replace with API submission
   - `evaluator_session` - Remove entirely (use Supabase)

5. **Type Mapping**: The backend uses snake_case, TypeScript uses camelCase. The API client handles this transformation.
