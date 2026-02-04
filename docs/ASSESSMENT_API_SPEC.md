# Assessment API Implementation Specification

## Overview

This document provides the complete specification for implementing assessment answer storage in the TBRAC backend. The goal is to replace localStorage-based answer storage with persistent database storage.

---

## Database Schema

### 1. Create Assessments Table

```sql
-- Create assessments table
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
  progress_percentage INTEGER DEFAULT 0,
  company_info JSONB NOT NULL,
  responses JSONB DEFAULT '{}',
  last_category_viewed VARCHAR(100),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_assessments_customer_id ON assessments(customer_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_created_at ON assessments(created_at DESC);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assessments_updated_at 
    BEFORE UPDATE ON assessments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `customer_id` | UUID | Foreign key to customers table |
| `status` | VARCHAR(20) | One of: `in_progress`, `completed`, `submitted` |
| `progress_percentage` | INTEGER | 0-100, tracks completion |
| `company_info` | JSONB | Company details from start page (see structure below) |
| `responses` | JSONB | Key-value pairs of questionId -> answer |
| `last_category_viewed` | VARCHAR(100) | Last category user was working on |
| `submitted_at` | TIMESTAMPTZ | When assessment was submitted (null if not submitted) |
| `created_at` | TIMESTAMPTZ | When assessment was created |
| `updated_at` | TIMESTAMPTZ | When assessment was last updated |

### Example Data

**company_info structure:**
```json
{
  "company_name": "ByteDance",
  "country": "China",
  "industry": "Technology",
  "company_size": "10000+",
  "contact_name": "John Doe",
  "contact_email": "john@bytedance.com"
}
```

**responses structure:**
```json
{
  "regulatory-scrutiny-cfius-sector": true,
  "regulatory-scrutiny-cfius-sensitivity": 7,
  "regulatory-scrutiny-cfius-disclosure": "We operate in telecommunications infrastructure",
  "data-security-privacy-storage": "us-only",
  "data-security-privacy-compliance": 8,
  "political-geopolitical-trade-tension": 6
}
```

---

## API Endpoints

### 1. Create Assessment

**Endpoint:** `POST /api/v1/assessments`

**Purpose:** Create a new assessment session when customer starts the assessment

**Authentication:** Required (Bearer token)

**Request Body:**
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

**Response (201 Created):**
```json
{
  "id": "assessment-uuid",
  "customer_id": "customer-uuid",
  "status": "in_progress",
  "progress_percentage": 0,
  "company_info": {
    "company_name": "ByteDance",
    "country": "China",
    "industry": "Technology",
    "company_size": "10000+",
    "contact_name": "John Doe",
    "contact_email": "john@bytedance.com"
  },
  "responses": {},
  "last_category_viewed": null,
  "submitted_at": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid request body or missing required fields
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Customer ID does not exist
- `422 Unprocessable Entity` - Validation errors (e.g., invalid email format)

**Implementation Notes:**
- Validate that `customer_id` exists in customers table
- Initialize `responses` as empty object `{}`
- Set `status` to `'in_progress'`
- Set `progress_percentage` to `0`

---

### 2. Save/Update Assessment Answers

**Endpoint:** `PUT /api/v1/assessments/{assessment_id}/answers`

**Purpose:** Save or update answers as the customer progresses through the assessment. This endpoint can be called multiple times (e.g., after completing each category).

**Authentication:** Required (Bearer token)

**Path Parameters:**
- `assessment_id` (UUID) - The assessment session ID

**Request Body:**
```json
{
  "responses": {
    "regulatory-scrutiny-cfius-sector": true,
    "regulatory-scrutiny-cfius-sensitivity": 7,
    "regulatory-scrutiny-cfius-disclosure": "We operate in telecommunications",
    "regulatory-scrutiny-export-controls": 5
  },
  "category": "regulatory-scrutiny",
  "progress_percentage": 15
}
```

**Request Body Fields:**
- `responses` (object, required) - Key-value pairs where:
  - Key: question ID (string)
  - Value: answer (can be number, boolean, string, or array of strings)
- `category` (string, optional) - Current category being worked on
- `progress_percentage` (integer, optional) - Overall completion percentage (0-100)

**Response (200 OK):**
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
    "regulatory-scrutiny-cfius-disclosure": "We operate in telecommunications",
    "regulatory-scrutiny-export-controls": 5
  },
  "last_category_viewed": "regulatory-scrutiny",
  "submitted_at": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T11:45:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid request body
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Assessment not found
- `422 Unprocessable Entity` - Validation errors

**Implementation Notes:**
- **Merge responses** - Don't replace the entire `responses` object, merge new answers with existing ones
- Example merge logic:
  ```python
  # Existing responses in DB
  existing = {"question1": "answer1", "question2": "answer2"}
  
  # New responses from request
  new = {"question2": "updated_answer2", "question3": "answer3"}
  
  # Merged result
  merged = {"question1": "answer1", "question2": "updated_answer2", "question3": "answer3"}
  ```
- Update `last_category_viewed` if `category` is provided
- Update `progress_percentage` if provided
- Update `updated_at` timestamp automatically via trigger

---

### 3. Get Assessment

**Endpoint:** `GET /api/v1/assessments/{assessment_id}`

**Purpose:** Retrieve an assessment session (to resume in-progress assessment or view submitted assessment)

**Authentication:** Required (Bearer token)

**Path Parameters:**
- `assessment_id` (UUID) - The assessment session ID

**Response (200 OK):**
```json
{
  "id": "assessment-uuid",
  "customer_id": "customer-uuid",
  "status": "in_progress",
  "progress_percentage": 45,
  "company_info": {
    "company_name": "ByteDance",
    "country": "China",
    "industry": "Technology",
    "company_size": "10000+",
    "contact_name": "John Doe",
    "contact_email": "john@bytedance.com"
  },
  "responses": {
    "regulatory-scrutiny-cfius-sector": true,
    "regulatory-scrutiny-cfius-sensitivity": 7,
    "data-security-privacy-storage": "us-only",
    "political-geopolitical-trade-tension": 6
  },
  "last_category_viewed": "data-security",
  "submitted_at": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T11:45:00Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Assessment not found

**Implementation Notes:**
- Return the complete assessment object with all fields
- No filtering or transformation needed - return as-is from database

---

### 4. Submit Assessment

**Endpoint:** `POST /api/v1/assessments/{assessment_id}/submit`

**Purpose:** Mark assessment as submitted (final submission)

**Authentication:** Required (Bearer token)

**Path Parameters:**
- `assessment_id` (UUID) - The assessment session ID

**Request Body:** None (empty body)

**Response (200 OK):**
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

**Error Responses:**
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Assessment not found
- `409 Conflict` - Assessment already submitted

**Implementation Notes:**
- Set `status` to `'submitted'`
- Set `submitted_at` to current timestamp
- Optionally validate that assessment is complete (has answers for required questions)
- Return 409 error if `status` is already `'submitted'`

---

### 5. List Customer Assessments

**Endpoint:** `GET /api/v1/customers/{customer_id}/assessments`

**Purpose:** List all assessments for a specific customer

**Authentication:** Required (Bearer token)

**Path Parameters:**
- `customer_id` (UUID) - The customer ID

**Query Parameters:**
- `page` (integer, optional, default: 1) - Page number
- `page_size` (integer, optional, default: 20) - Items per page
- `status` (string, optional) - Filter by status: `in_progress`, `completed`, `submitted`

**Response (200 OK):**
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
  "pages": 1
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Customer not found

**Implementation Notes:**
- Return lightweight list items (don't include full `responses` object)
- Extract `company_name` from `company_info` JSONB field
- Sort by `created_at` DESC (newest first)
- Apply pagination and status filtering

---

## Python Models (Pydantic)

Add these to your backend's models file:

```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any, Literal
from datetime import datetime
from uuid import UUID

# Request Models

class CompanyInfo(BaseModel):
    company_name: str = Field(..., min_length=1, max_length=255)
    country: str = Field(..., min_length=1, max_length=100)
    industry: str = Field(..., min_length=1, max_length=100)
    company_size: str = Field(..., min_length=1, max_length=50)
    contact_name: str = Field(..., min_length=1, max_length=255)
    contact_email: EmailStr

class AssessmentCreate(BaseModel):
    customer_id: UUID
    company_info: CompanyInfo

class SaveAnswersRequest(BaseModel):
    responses: Dict[str, Any]  # questionId -> answer (can be number, bool, string, list)
    category: Optional[str] = None
    progress_percentage: Optional[int] = Field(None, ge=0, le=100)

# Response Models

AssessmentStatus = Literal["in_progress", "completed", "submitted"]

class AssessmentResponse(BaseModel):
    id: UUID
    customer_id: UUID
    status: AssessmentStatus
    progress_percentage: int
    company_info: CompanyInfo
    responses: Dict[str, Any]
    last_category_viewed: Optional[str]
    submitted_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # For SQLAlchemy ORM compatibility

class AssessmentListItem(BaseModel):
    id: UUID
    customer_id: UUID
    status: AssessmentStatus
    progress_percentage: int
    company_name: str  # Extracted from company_info
    submitted_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PaginatedAssessments(BaseModel):
    items: list[AssessmentListItem]
    total: int
    page: int
    page_size: int
    pages: int
```

---

## SQLAlchemy Model (if using SQLAlchemy)

```python
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
import uuid

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(20), nullable=False, default="in_progress")
    progress_percentage = Column(Integer, default=0)
    company_info = Column(JSONB, nullable=False)
    responses = Column(JSONB, default=dict)
    last_category_viewed = Column(String(100), nullable=True)
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Indexes
    __table_args__ = (
        Index('idx_assessments_customer_id', 'customer_id'),
        Index('idx_assessments_status', 'status'),
        Index('idx_assessments_created_at', 'created_at'),
    )
```

---

## FastAPI Route Implementation Example

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID
from datetime import datetime

router = APIRouter(prefix="/api/v1/assessments", tags=["assessments"])

# 1. Create Assessment
@router.post("", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
async def create_assessment(
    data: AssessmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify customer exists
    customer = db.query(Customer).filter(Customer.id == data.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Create assessment
    assessment = Assessment(
        customer_id=data.customer_id,
        company_info=data.company_info.dict(),
        status="in_progress",
        progress_percentage=0,
        responses={}
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    
    return assessment

# 2. Save/Update Answers
@router.put("/{assessment_id}/answers", response_model=AssessmentResponse)
async def save_answers(
    assessment_id: UUID,
    data: SaveAnswersRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get assessment
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Merge responses (don't replace, merge)
    current_responses = assessment.responses or {}
    current_responses.update(data.responses)
    assessment.responses = current_responses
    
    # Update optional fields
    if data.category:
        assessment.last_category_viewed = data.category
    if data.progress_percentage is not None:
        assessment.progress_percentage = data.progress_percentage
    
    db.commit()
    db.refresh(assessment)
    
    return assessment

# 3. Get Assessment
@router.get("/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(
    assessment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    return assessment

# 4. Submit Assessment
@router.post("/{assessment_id}/submit", response_model=AssessmentResponse)
async def submit_assessment(
    assessment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    if assessment.status == "submitted":
        raise HTTPException(status_code=409, detail="Assessment already submitted")
    
    assessment.status = "submitted"
    assessment.submitted_at = datetime.utcnow()
    
    db.commit()
    db.refresh(assessment)
    
    return assessment

# 5. List Customer Assessments
@router.get("", response_model=PaginatedAssessments)
async def list_assessments(
    customer_id: UUID,
    page: int = 1,
    page_size: int = 20,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify customer exists
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Build query
    query = db.query(Assessment).filter(Assessment.customer_id == customer_id)
    
    if status:
        query = query.filter(Assessment.status == status)
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    items = query.order_by(Assessment.created_at.desc()) \
                 .offset((page - 1) * page_size) \
                 .limit(page_size) \
                 .all()
    
    # Convert to list items (extract company_name from JSONB)
    list_items = []
    for item in items:
        list_items.append(AssessmentListItem(
            id=item.id,
            customer_id=item.customer_id,
            status=item.status,
            progress_percentage=item.progress_percentage,
            company_name=item.company_info.get("company_name", ""),
            submitted_at=item.submitted_at,
            created_at=item.created_at,
            updated_at=item.updated_at
        ))
    
    return PaginatedAssessments(
        items=list_items,
        total=total,
        page=page,
        page_size=page_size,
        pages=(total + page_size - 1) // page_size
    )
```

---

## Testing the Endpoints

### 1. Create Assessment
```bash
curl -X POST http://localhost:8000/api/v1/assessments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "customer-uuid-here",
    "company_info": {
      "company_name": "ByteDance",
      "country": "China",
      "industry": "Technology",
      "company_size": "10000+",
      "contact_name": "John Doe",
      "contact_email": "john@bytedance.com"
    }
  }'
```

### 2. Save Answers
```bash
curl -X PUT http://localhost:8000/api/v1/assessments/ASSESSMENT_ID/answers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "responses": {
      "regulatory-scrutiny-cfius-sector": true,
      "regulatory-scrutiny-cfius-sensitivity": 7
    },
    "category": "regulatory-scrutiny",
    "progress_percentage": 15
  }'
```

### 3. Get Assessment
```bash
curl -X GET http://localhost:8000/api/v1/assessments/ASSESSMENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Submit Assessment
```bash
curl -X POST http://localhost:8000/api/v1/assessments/ASSESSMENT_ID/submit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. List Assessments
```bash
curl -X GET "http://localhost:8000/api/v1/customers/CUSTOMER_ID/assessments?page=1&page_size=20&status=in_progress" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Migration Script

If you're using Alembic for migrations, create a new migration file:

```bash
alembic revision -m "add_assessments_table"
```

Then add this to the migration file:

```python
def upgrade():
    op.create_table(
        'assessments',
        sa.Column('id', sa.UUID(), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('customer_id', sa.UUID(), nullable=False),
        sa.Column('status', sa.String(20), nullable=False, server_default='in_progress'),
        sa.Column('progress_percentage', sa.Integer(), server_default='0'),
        sa.Column('company_info', postgresql.JSONB(), nullable=False),
        sa.Column('responses', postgresql.JSONB(), server_default='{}'),
        sa.Column('last_category_viewed', sa.String(100)),
        sa.Column('submitted_at', sa.DateTime(timezone=True)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['customer_id'], ['customers.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_index('idx_assessments_customer_id', 'assessments', ['customer_id'])
    op.create_index('idx_assessments_status', 'assessments', ['status'])
    op.create_index('idx_assessments_created_at', 'assessments', ['created_at'])

def downgrade():
    op.drop_index('idx_assessments_created_at')
    op.drop_index('idx_assessments_status')
    op.drop_index('idx_assessments_customer_id')
    op.drop_table('assessments')
```

---

## Summary

This specification provides everything needed to implement assessment answer storage:

1. **Database table** with JSONB for flexible answer storage
2. **5 API endpoints** for complete CRUD operations
3. **Pydantic models** for request/response validation
4. **FastAPI route examples** showing implementation
5. **Test commands** for verification

The key design decisions:
- Use JSONB for `responses` to handle different answer types (numbers, booleans, strings)
- Merge responses on update (don't replace existing answers)
- Track progress and last viewed category for better UX
- Simple status workflow: `in_progress` → `submitted`

This replaces the current localStorage implementation with persistent, secure, server-side storage.
