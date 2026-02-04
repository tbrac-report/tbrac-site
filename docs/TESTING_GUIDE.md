# TBRAC Assessment API - Testing Guide

## Overview

The assessment flow now uses the backend API instead of localStorage. All assessment data is persisted to the database in real-time.

## Prerequisites

### 1. Backend API Running

Make sure your backend API is running on `http://localhost:8000`:

```bash
cd /path/to/backend
python main.py
# or
uvicorn main:app --reload
```

Verify it's running by visiting: http://localhost:8000/docs

### 2. Supabase User Account

You need a Supabase user account to test the assessment. The user's ID is used as the customer_id.

#### Create a Supabase User:

**Option A: Via Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add User"
4. Create a user with email/password (e.g., test@example.com / testpassword123)

**Option B: Via Sign Up Flow (if you add a signup page)**
1. Create a signup page using Supabase Auth
2. Sign up through the UI

### 3. Frontend Running

```bash
cd /Users/ashwindhanasamy/Documents/cave/projects/tbrac/tbrac-site
pnpm dev
```

Visit: http://localhost:3000

## Testing the Assessment Flow

### Step 1: Sign In

1. Go to http://localhost:3000/evaluator-login
2. Sign in with your Supabase user credentials
3. You should be redirected to the evaluator dashboard

### Step 2: Start Assessment

1. Go to http://localhost:3000/assessment/start
2. Fill in the company information form:
   - Company Name (e.g., "ByteDance")
   - Country of Origin (e.g., "China")
   - Industry (select from dropdown)
   - Company Size (select from dropdown)
   - Contact Name (e.g., "John Doe")
   - Contact Email (e.g., "john@bytedance.com")
3. Click "Begin Assessment"
4. **What happens**: The app creates an assessment record in the backend using your Supabase user ID

### Step 3: Answer Questions

1. You'll be on the first category page: "Regulatory Scrutiny"
2. Answer the questions in the form
3. Click "Next Category"
4. **What happens**: Your answers are saved to the backend API immediately
5. **Progress tracking**: Your progress percentage is updated in the database

### Step 4: Test Resume Functionality

1. While on any category page, **refresh the browser** (F5 or Cmd+R)
2. **What happens**: The page reloads and your previous answers are still there!
3. The app loads the assessment from the backend using the assessment ID stored in sessionStorage

### Step 5: Complete Assessment

1. Continue through all 10 categories
2. Answer questions in each category
3. On the last category, click "View Results"
4. You'll see your assessment results with scores and risk levels

### Step 6: Verify in Database

Check your backend database to see the assessment record:

```sql
SELECT * FROM assessments ORDER BY created_at DESC LIMIT 1;
```

You should see:
- Your assessment ID
- Customer ID (your Supabase user ID)
- Company info (JSON)
- All your responses (JSON)
- Progress percentage (should be 100% if completed)
- Status ('in_progress' or 'submitted')

## API Endpoints Being Used

### During Assessment Flow:

1. **POST /api/v1/assessments** - Creates assessment (on start page)
2. **PUT /api/v1/assessments/{id}/answers** - Saves answers (on each category)
3. **GET /api/v1/assessments/{id}** - Loads assessment (when resuming)
4. **POST /api/v1/assessments/{id}/submit** - Submits assessment (on results page, coming soon)

## Common Issues & Solutions

### Issue: "Not authenticated" error

**Solution**: Make sure you're signed in at `/evaluator-login` before starting an assessment.

### Issue: "Customer not found" error

**Solution**: The backend requires a customer record. You have two options:

1. **Option A**: Create a customer record with the same ID as your Supabase user:
   ```bash
   # Use the backend API to create a customer
   # POST /api/v1/customers with id = your_user_id
   ```

2. **Option B**: Modify backend to auto-create customer on first assessment (recommended for testing)

### Issue: Assessment doesn't load on refresh

**Solution**: Check browser console for errors. The assessment ID should be in sessionStorage:
```javascript
console.log(sessionStorage.getItem('tbrac_assessment_id'))
```

### Issue: Backend connection refused

**Solution**: Make sure:
1. Backend is running on port 8000
2. CORS is configured correctly in backend
3. `NEXT_PUBLIC_API_BASE_URL` is set correctly in `.env.local`

## Testing Checklist

- [ ] User can sign in via Supabase
- [ ] User can start an assessment
- [ ] Assessment creates record in database
- [ ] User can answer questions in category 1
- [ ] Answers save to backend
- [ ] User can refresh page and answers persist
- [ ] User can navigate to next category
- [ ] Progress percentage updates
- [ ] User can complete all 10 categories
- [ ] Results page shows calculated scores
- [ ] Database shows assessment with status 'in_progress'

## What's Different from Before

| Feature | Before (localStorage) | Now (API) |
|---------|----------------------|-----------|
| Data storage | Browser localStorage | Backend database |
| Persistence | Lost on browser clear | Permanent |
| Resume capability | Same browser only | Any device, any browser |
| Multi-user | Not supported | Fully supported |
| Progress tracking | Client-side only | Server-side |
| Data security | Client-side (insecure) | Server-side (secure) |

## Next Steps

After confirming the assessment flow works:

1. **Add submission endpoint** - Update results page to call submit API
2. **Link to customer records** - Create proper customer records for users
3. **Add assessment list** - Show user's previous assessments
4. **Add resume button** - Let users resume in-progress assessments
5. **Add company login** - Separate login for companies vs evaluators

## Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs for API errors
3. Verify Supabase user exists and is authenticated
4. Check network tab in DevTools to see API requests
