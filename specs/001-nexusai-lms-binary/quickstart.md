# Quick Start Guide: Nexus AI LMS Platform with Binary MLM System

**Date**: 2025-10-17  
**Feature**: [001-nexusai-lms-binary](plan.md)  
**Updated for**: Next.js 15 + Supabase + WowDash

## Prerequisites

### System Requirements
- Node.js 18+ (LTS recommended)
- Git
- Supabase account (https://supabase.com)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Development Tools
- VS Code or preferred IDE
- Git CLI
- Supabase CLI (optional but recommended)
- Postman or similar API testing tool

## Quick Start (5 Minutes)

### 1. Clone Repository
```bash
git clone <repository-url>
cd "nexusai/front end/wowdash"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# Get these from https://app.supabase.com/project/_/settings/api
```

**Required Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3003
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Access Application
- **Frontend**: http://localhost:3003
- **Landing Page**: http://localhost:3003/
- **Login**: http://localhost:3003/auth/login
- **Dashboard**: http://localhost:3003/dashboard

✅ **Authentication is already configured and working!**

---

## Supabase Setup

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Create new organization (if needed)
4. Create new project:
   - Name: `nexus-ai`
   - Database Password: (save this!)
   - Region: Choose closest to you
5. Wait for project to initialize (~2 minutes)

### 2. Get API Credentials

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Paste in your `.env.local`

### 3. Run Database Migrations

**Option A: Supabase Dashboard (Recommended for first time)**

1. Go to **SQL Editor** in Supabase Dashboard
2. Open the file `specs/001-nexusai-lms-binary/SUPABASE_MIGRATIONS_GUIDE.md`
3. Copy each migration SQL in order:
   - `001_user_profiles.sql`
   - `002_ranks.sql`
   - `003_binary_positions.sql`
   - ... (continue with all migrations)
4. Paste and execute each one in SQL Editor

**Option B: Supabase CLI (For production)**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

### 4. Enable Row Level Security

Run the RLS policies from `013_rls_policies.sql` in SQL Editor.

### 5. Generate TypeScript Types

```bash
# Generate types from Supabase schema
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/types/database.ts
```

---

## Development Workflow

### 1. Making Changes

```bash
# Create new page
mkdir -p "app/(dashboard)/binary-tree"
touch "app/(dashboard)/binary-tree/page.tsx"

# Create component
mkdir -p components/binary
touch components/binary/tree-visualization.tsx

# Create server action
touch app/actions/binary.ts
```

### 2. Database Changes

```bash
# Create new migration in Supabase
# Go to SQL Editor → New Query
# Write your migration SQL
# Execute and save

# Or use Supabase CLI
supabase migration new create_new_table
# Edit the generated file in supabase/migrations/
supabase db push
```

### 3. Testing

```bash
# Run Next.js in development mode
npm run dev

# Build for production (test)
npm run build

# Run unit tests (when implemented)
npm test
```

---

## Key Development Commands

### Next.js
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npx prettier --write .
```

### Supabase CLI
```bash
# Start local Supabase (optional)
supabase start

# Stop local Supabase
supabase stop

# Check migration status
supabase migration list

# Generate types
supabase gen types typescript --local > lib/types/database.ts
```

---

## Project Structure Overview

```
nexusai/front end/wowdash/
├── app/
│   ├── (dashboard)/          # Protected routes
│   │   ├── (homes)/
│   │   │   └── dashboard/    # ✅ Main dashboard
│   │   ├── binary-tree/      # 🔴 TO CREATE
│   │   ├── wallet/           # 🔴 TO CREATE
│   │   └── ... (other routes)
│   ├── auth/                 # ✅ Authentication (DO NOT TOUCH)
│   ├── actions/              # Server Actions
│   └── api/                  # API Routes
├── components/
│   ├── auth/                 # ✅ Auth components
│   ├── binary/               # 🔴 TO CREATE
│   ├── academy/              # 🔴 TO CREATE
│   └── sidebar-data.ts       # ✅ UPDATED
├── utils/
│   └── supabase/             # ✅ Supabase clients
├── lib/
│   └── types/                # TypeScript types
└── middleware.ts             # ✅ Auth middleware
```

---

## Common Development Tasks

### Adding New Dashboard Page

```typescript
// 1. Create page file
// app/(dashboard)/binary-tree/page.tsx

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function BinaryTreePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  return (
    <div>
      <h1>Binary Tree</h1>
      {/* Your content */}
    </div>
  )
}
```

### Creating Server Action

```typescript
// app/actions/binary.ts
'use server'

import { createClient } from '@/utils/supabase/server'

export async function getBinaryTree() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('binary_positions')
    .select('*')
    .eq('user_id', user.id)
  
  if (error) throw error
  return data
}
```

### Querying Supabase

```typescript
// Client component
'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export function BinaryStats() {
  const [stats, setStats] = useState(null)
  const supabase = createClient()
  
  useEffect(() => {
    async function loadStats() {
      const { data } = await supabase
        .from('binary_positions')
        .select('left_volume, right_volume')
        .single()
      
      setStats(data)
    }
    loadStats()
  }, [])
  
  return <div>{/* Display stats */}</div>
}
```

---

## Testing the Application

### 1. User Authentication (✅ Already Works)
- Visit http://localhost:3003/auth/login
- Enter your credentials
- Verify you're redirected to dashboard
- Check session persists on page reload

### 2. Binary Tree (After Implementation)
- Register a new user with sponsor
- Check binary position is created
- Verify tree structure
- Test volume calculations

### 3. Payment Processing (After Implementation)
- Test deposit flow with testnet USDT
- Verify transaction confirmation
- Check balance updates
- Test withdrawal with minimum amount

### 4. Commission Calculation (After Implementation)
- Create test users in binary structure
- Activate memberships
- Trigger commission calculation
- Verify commission distribution

---

## Troubleshooting

### Common Issues

**Authentication not working**
- Check `.env.local` has correct Supabase credentials
- Verify Supabase project is not paused
- Clear browser cookies and try again
- Check Supabase Auth logs in dashboard

**Database connection errors**
- Verify Supabase project URL is correct
- Check anon key is valid
- Ensure RLS policies are configured
- Test connection in Supabase dashboard

**Page not found errors**
- Verify the route exists in `app/(dashboard)/`
- Check Next.js dev server is running
- Clear `.next` cache: `rm -rf .next`
- Restart dev server

**TypeScript errors**
- Regenerate types: `npx supabase gen types typescript`
- Check imports are correct
- Verify tsconfig.json paths are set up
- Run `npm run lint` to check for issues

### Debug Commands
```bash
# Check Next.js logs
npm run dev
# Watch the terminal output

# Check Supabase logs
# Go to Supabase Dashboard → Logs

# Clear Next.js cache
rm -rf .next
npm run dev

# Check environment variables
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

---

## Production Deployment

### 1. Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_SITE_URL

# Deploy to production
vercel --prod
```

### 2. Supabase Production Setup

1. Ensure all migrations are applied
2. Configure RLS policies
3. Set up Edge Functions (if using)
4. Configure Storage buckets (for academy content)
5. Set up Email templates
6. Enable database backups

### 3. Security Checklist

- ☑️ All sensitive data in environment variables
- ☑️ RLS policies enabled on all tables
- ☑️ HTTPS enforced (automatic with Vercel)
- ☑️ Rate limiting configured
- ☑️ CORS properly configured
- ☑️ Database backups enabled
- ☑️ Error logging set up (Sentry recommended)

---

## Next Steps

1. ✅ **DONE**: Authentication is working
2. ✅ **DONE**: Dashboard layout is set up
3. ✅ **DONE**: Menu is configured for MLM + Academy
4. 🔴 **TODO**: Create database tables in Supabase
5. 🔴 **TODO**: Implement binary tree visualization
6. 🔴 **TODO**: Build wallet & payment system
7. 🔴 **TODO**: Create commission calculator
8. 🔴 **TODO**: Develop academy LMS features

### Recommended Implementation Order:

1. **Phase 1: Database Setup** (~1 hour)
   - Run all Supabase migrations
   - Generate TypeScript types
   - Test database queries

2. **Phase 2: Binary Tree** (~1 week)
   - Create binary tree page
   - Build tree visualization component
   - Implement placement algorithm
   - Add volume tracking

3. **Phase 3: Wallet** (~1 week)
   - Build deposit page with QR code
   - Create withdrawal form
   - Integrate payment gateway
   - Add transaction history

4. **Phase 4: Commissions** (~1-2 weeks)
   - Implement calculation logic
   - Create commission dashboard
   - Build reporting system
   - Add automated payouts

5. **Phase 5: Academy** (~2 weeks)
   - Create course listing
   - Build video player
   - Add progress tracking
   - Implement certificates

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [WowDash Template Docs](https://wowdash-docs.vercel.app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## Support

If you encounter issues:

1. Check this guide first
2. Review [NEXUS_AI_IMPLEMENTATION_SUMMARY.md](../../front%20end/wowdash/NEXUS_AI_IMPLEMENTATION_SUMMARY.md)
3. Read [SUPABASE_MIGRATIONS_GUIDE.md](SUPABASE_MIGRATIONS_GUIDE.md)
4. Check Supabase logs in dashboard
5. Review Next.js error messages carefully

---

**Last Updated**: 2025-10-17  
**Version**: 2.0 (Updated for Next.js 15 + Supabase)  
**Status**: ✅ Ready for Development