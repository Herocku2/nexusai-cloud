# Tasks: Nexus AI LMS Platform with Binary MLM System (Next.js + Supabase)

**Updated**: 2025-10-17  
**Technology Stack**: Next.js 15 + Supabase + WowDash  
**Prerequisites**: Authentication already working, WowDash template integrated

---

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story (US1, US2, US3...)
- **Status**: \u2705 Done | \ud83d\udfe1 In Progress | \ud83d\udd34 To Do

---

## Phase 0: Foundation (\u2705 COMPLETED)

**Purpose**: Base infrastructure already in place

- [\u2705] T000 Next.js 15 project initialized with WowDash template
- [\u2705] T001 Supabase project created and connected
- [\u2705] T002 Authentication system (login/register) working
- [\u2705] T003 Dashboard layout with sidebar configured
- [\u2705] T004 Menu adapted for MLM + Academy business
- [\u2705] T005 Environment variables configured (.env.local)
- [\u2705] T006 TypeScript and Tailwind CSS configured
- [\u2705] T007 Middleware for route protection working

**Checkpoint**: \u2705 Foundation is ready - can begin feature implementation

---

## Phase 1: Database Setup (Priority: CRITICAL) \ud83d\udd25

**Purpose**: Create all database tables, functions, and policies in Supabase

**\u26a0\ufe0f CRITICAL**: This phase MUST be complete before ANY feature development

### Supabase Migrations

- [ ] T100 [P] Create `user_profiles` table in Supabase
  - Location: Supabase Dashboard \u2192 SQL Editor
  - File: `specs/001.../SUPABASE_MIGRATIONS_GUIDE.md` \u2192 001_user_profiles.sql
  - Test: Query the table, verify FK to auth.users

- [ ] T101 [P] Create `ranks` table with seed data
  - File: 002_ranks.sql
  - Test: Verify 13 ranks inserted
  
- [ ] T102 [P] Create `binary_positions` table
  - File: 003_binary_positions.sql
  - Test: Insert test position, verify foreign keys

- [ ] T103 [P] Create `memberships` table
  - File: 004_memberships.sql
  - Test: Insert test membership

- [ ] T104 [P] Create `transactions` table
  - File: 005_transactions.sql
  - Test: Verify generated columns work

- [ ] T105 [P] Create `commissions` table
  - File: 006_commissions.sql
  - Test: Insert test commission

- [ ] T106 [P] Create `academy_content` table
  - File: 007_academy_content.sql
  - Test: Insert test course

- [ ] T107 [P] Create `user_content_progress` table
  - File: 008_user_content_progress.sql
  - Test: Verify unique constraint

- [ ] T108 [P] Create `notifications` table
  - File: 009_notifications.sql
  
- [ ] T109 [P] Create `user_ranks` table
  - File: 010_user_ranks.sql

### PostgreSQL Functions

- [ ] T110 Create `get_binary_downline()` function
  - File: 011_functions.sql
  - Test: Call with test user_id

- [ ] T111 Create `calculate_binary_commission()` function
  - File: 011_functions.sql
  - Test: Verify calculation with test data

- [ ] T112 Create `update_updated_at_column()` trigger function
  - File: 012_triggers.sql

### Row Level Security

- [ ] T113 Enable RLS on all tables
  - File: 013_rls_policies.sql
  - Test: Try accessing data from different users

- [ ] T114 Create RLS policies for user_profiles
- [ ] T115 [P] Create RLS policies for binary_positions
- [ ] T116 [P] Create RLS policies for transactions
- [ ] T117 [P] Create RLS policies for commissions
- [ ] T118 [P] Create RLS policies for memberships

### Type Generation

- [ ] T119 Generate TypeScript types from Supabase schema
  ```bash
  npx supabase gen types typescript --project-id ID > lib/types/database.ts
  ```
  - Test: Import types in a component, verify autocomplete

**Checkpoint**: \u2705 Database is ready - feature development can begin

---

## Phase 2: Binary Tree Visualization (Priority: P1 - MVP) \ud83c\udfaf

**Goal**: Users can view their binary tree, see referrals, and track volumes

**User Story**: US2 - Binary Tree Management

### Setup & Types

- [ ] T200 [P] Create TypeScript types for binary tree
  - File: `lib/types/binary.ts`
  - Include: BinaryNode, TreeStats, VolumeData

- [ ] T201 [P] Create binary calculation utilities
  - File: `utils/binary-calculations.ts`
  - Functions: calculateWeakerLeg, getTotalVolume, getCarryover

### Server Actions

- [ ] T202 Create binary tree server actions
  - File: `app/actions/binary.ts`
  - Actions:
    - `getBinaryTree()` - Get user's tree
    - `getBinaryStats()` - Get volumes and stats
    - `getDownlineList()` - Get list of downline

### UI Components

- [ ] T203 [P] Create BinaryTreeNode component
  - File: `components/binary/tree-node.tsx`
  - Props: node data, level, onNodeClick
  - UI: Card with user info, volume indicators

- [ ] T204 [P] Create BinaryTreeVisualization component
  - File: `components/binary/tree-visualization.tsx`
  - Use: React Flow or D3.js for tree layout
  - Features: Pan, zoom, collapsible nodes

- [ ] T205 [P] Create VolumeStats component
  - File: `components/binary/volume-stats.tsx`
  - Display: Left volume, right volume, weaker leg, carryover

- [ ] T206 [P] Create DownlineTable component
  - File: `components/binary/downline-table.tsx`
  - Columns: Name, position, level, volume, date joined

### Pages

- [ ] T207 Create Binary Tree page
  - File: `app/(dashboard)/binary-tree/page.tsx`
  - Layout: Tree visualization + stats sidebar
  - Features: Search, filter by level

- [ ] T208 Create My Network page
  - File: `app/(dashboard)/my-network/page.tsx`
  - Layout: Summary cards + downline table
  
- [ ] T209 [P] Create Sponsored Users page
  - File: `app/(dashboard)/sponsored/page.tsx`
  - List: Direct referrals only

- [ ] T210 [P] Create Genealogy page
  - File: `app/(dashboard)/genealogy/page.tsx`
  - View: Complete genealogy tree

### Integration

- [ ] T211 Integrate binary position creation on user registration
  - Modify: `app/actions/auth.ts` (carefully!)
  - Action: After successful registration, create binary_position
  - Logic: Auto-placement algorithm (first available left/right)

### Testing

- [ ] T212 Test binary tree with multiple users
- [ ] T213 Test volume calculations
- [ ] T214 Test real-time updates (Supabase Realtime)

**Checkpoint**: \u2705 Binary tree is functional and visualizable

---

## Phase 3: Wallet & Transactions (Priority: P1 - MVP) \ud83d\udcb0

**Goal**: Users can deposit USDT, withdraw funds, and view transactions

**User Story**: US4 - Cryptocurrency Deposits and Withdrawals

### Setup

- [ ] T300 [P] Create crypto utilities
  - File: `utils/crypto-helpers.ts`
  - Functions: generateQRCode, validateAddress, formatUSDT

- [ ] T301 [P] Create transaction types
  - File: `lib/types/transaction.ts`

### Server Actions

- [ ] T302 Create wallet server actions
  - File: `app/actions/wallet.ts`
  - Actions:
    - `getBalance()` - Calculate current balance
    - `getTransactions()` - Get transaction history
    - `createDepositAddress()` - Generate deposit address
    - `createWithdrawal()` - Request withdrawal

### API Routes (Webhooks)

- [ ] T303 Create crypto payment webhook
  - File: `app/api/webhooks/crypto-payment/route.ts`
  - Verify: Signature from payment gateway
  - Update: Transaction status, user balance

### UI Components

- [ ] T304 [P] Create BalanceCard component
  - File: `components/wallet/balance-card.tsx`
  - Display: Available balance, pending, total earned

- [ ] T305 [P] Create DepositQR component
  - File: `components/wallet/deposit-qr.tsx`
  - Features: QR code, address copy, instructions

- [ ] T306 [P] Create WithdrawForm component
  - File: `components/wallet/withdraw-form.tsx`
  - Validation: Minimum 20 USDT, valid address
  - Fee display: 3% fee calculation

- [ ] T307 [P] Create TransactionList component
  - File: `components/wallet/transaction-list.tsx`
  - Filters: Type, status, date range
  - Columns: Date, type, amount, status, fee

### Pages

- [ ] T308 Create Wallet Balance page
  - File: `app/(dashboard)/wallet/balance/page.tsx`
  - Cards: Balance, recent transactions

- [ ] T309 Create Deposit page
  - File: `app/(dashboard)/wallet/deposit/page.tsx`
  - Steps: Select amount \u2192 Generate QR \u2192 Wait for confirmation

- [ ] T310 Create Withdraw page
  - File: `app/(dashboard)/wallet/withdraw/page.tsx`
  - Form: Amount, address, 2FA code
  
- [ ] T311 Create Transactions page
  - File: `app/(dashboard)/wallet/transactions/page.tsx`
  - Table: All transactions with filters

- [ ] T312 [P] Create Membership page
  - File: `app/(dashboard)/wallet/membership/page.tsx`
  - Display: Current membership, expiry, renewal

### Integration

- [ ] T313 Integrate NowPayments API
  - Setup: API keys in environment
  - Test: Create test payment on testnet

- [ ] T314 Setup webhook endpoint with signature verification

### Testing

- [ ] T315 Test deposit flow with testnet USDT
- [ ] T316 Test withdrawal validation
- [ ] T317 Test balance calculations

**Checkpoint**: \u2705 Wallet system is functional

---

## Phase 4: Commissions System (Priority: P1 - MVP) \ud83d\udcb8

**Goal**: Calculate and display user commissions (binary, fast start, matching)

**User Story**: US5 - Commission Tracking and Payouts

### Setup

- [ ] T400 [P] Create commission calculator utility
  - File: `utils/commission-calculator.ts`
  - Functions: 
    - calculateFastStart (L1: $40, L2: $8)
    - calculateBinary (50% weaker leg with capping)
    - calculateMatching (50% of direct's binary)

- [ ] T401 [P] Create commission types
  - File: `lib/types/commission.ts`

### Supabase Edge Functions

- [ ] T402 Create commission calculation Edge Function
  - File: `supabase/functions/calculate-commissions/index.ts`
  - Schedule: Run daily via cron
  - Logic: Calculate all user commissions
  - Test: Call manually first

### Server Actions

- [ ] T403 Create commission server actions
  - File: `app/actions/commissions.ts`
  - Actions:
    - `getCommissionSummary()` - Total by type
    - `getCommissionHistory()` - Paginated list
    - `getCommissionReports()` - Export data

### UI Components

- [ ] T404 [P] Create EarningsCard component
  - File: `components/commissions/earnings-card.tsx`
  - Display: Total earnings, by type, growth chart

- [ ] T405 [P] Create CommissionChart component
  - File: `components/commissions/commission-chart.tsx`
  - Chart: Earnings over time (line/bar chart)

- [ ] T406 [P] Create CommissionList component
  - File: `components/commissions/commission-list.tsx`
  - Table: Date, type, amount, source user

### Pages

- [ ] T407 Create Earnings Summary page
  - File: `app/(dashboard)/commissions/earnings/page.tsx`
  - Cards: Total, by type, charts

- [ ] T408 Create Commission History page
  - File: `app/(dashboard)/commissions/history/page.tsx`
  - Table: All commissions with filters

- [ ] T409 [P] Create Fast Start Bonus page
  - File: `app/(dashboard)/commissions/fast-start/page.tsx`
  - List: Level 1 and Level 2 bonuses

- [ ] T410 [P] Create Binary Commission page
  - File: `app/(dashboard)/commissions/binary/page.tsx`
  - Details: Daily binary commissions with volume data

- [ ] T411 [P] Create Matching Bonus page
  - File: `app/(dashboard)/commissions/matching/page.tsx`
  - List: Matching bonuses from directs

- [ ] T412 Create Reports page
  - File: `app/(dashboard)/commissions/reports/page.tsx`
  - Export: CSV, PDF downloads

### Integration

- [ ] T413 Trigger fast start bonus on new membership
  - When: User activates membership
  - Give: $40 to L1 sponsor, $8 to L2 sponsor

- [ ] T414 Schedule daily binary commission calculation
  - Edge Function cron job

### Testing

- [ ] T415 Test commission calculations with test data
- [ ] T416 Test capping based on ranks
- [ ] T417 Test carry-over accumulation

**Checkpoint**: \u2705 Commission system is calculating and displaying correctly

---

## Phase 5: Academy LMS (Priority: P1 - MVP) \ud83c\udf93

**Goal**: Users can access courses, watch videos, track progress

**User Story**: US3 - Academic Content Access

### Setup

- [ ] T500 [P] Create academy types
  - File: `lib/types/academy.ts`
  - Types: Course, Content, Progress, Certificate

### Server Actions

- [ ] T501 Create academy server actions
  - File: `app/actions/academy.ts`
  - Actions:
    - `getCourses()` - Get available courses
    - `getCourseById()` - Get course details
    - `updateProgress()` - Update watch time
    - `markComplete()` - Mark content as completed

### UI Components

- [ ] T502 [P] Create CourseCard component
  - File: `components/academy/course-card.tsx`
  - Display: Thumbnail, title, progress, duration

- [ ] T503 [P] Create VideoPlayer component
  - File: `components/academy/video-player.tsx`
  - Features: Custom controls, progress tracking
  - Integration: Vimeo or Cloudflare Stream

- [ ] T504 [P] Create ProgressTracker component
  - File: `components/academy/progress-tracker.tsx`
  - Display: Completed, in progress, remaining

- [ ] T505 [P] Create Certificate component
  - File: `components/academy/certificate.tsx`
  - Generate: PDF certificate on completion

### Pages

- [ ] T506 Create Courses List page
  - File: `app/(dashboard)/academy/courses/page.tsx`
  - Grid: Course cards with filters

- [ ] T507 Create Course Detail page
  - File: `app/(dashboard)/academy/course/[id]/page.tsx`
  - Layout: Video player + content list + progress

- [ ] T508 [P] Create Categories page
  - File: `app/(dashboard)/academy/categories/page.tsx`
  - List: Courses grouped by category

- [ ] T509 [P] Create Progress page
  - File: `app/(dashboard)/academy/progress/page.tsx`
  - Dashboard: Overall progress, completed courses

- [ ] T510 [P] Create Certificates page
  - File: `app/(dashboard)/academy/certificates/page.tsx`
  - Gallery: Earned certificates with download

- [ ] T511 Create Live Classes page
  - File: `app/(dashboard)/academy/live-classes/page.tsx`
  - Integration: Zoom SDK for joining meetings

- [ ] T512 [P] Create Resources page
  - File: `app/(dashboard)/academy/resources/page.tsx`
  - Downloads: PDFs, documents, files

### Storage Integration

- [ ] T513 Setup Supabase Storage buckets
  - Buckets: `course-videos`, `course-materials`, `certificates`
  - Policies: Authenticated users can read

- [ ] T514 Upload sample course content

### Integration

- [ ] T515 Restrict content by rank
  - Check user rank before allowing access

- [ ] T516 Real-time progress sync
  - Use Supabase Realtime for progress updates

### Testing

- [ ] T517 Test video playback and progress tracking
- [ ] T518 Test course completion flow
- [ ] T519 Test certificate generation

**Checkpoint**: \u2705 Academy LMS is functional

---

## Phase 6: Rank System (Priority: P2) \ud83c\udfc6

**Goal**: Users can see their rank, progress, and requirements

**User Story**: US6 - Rank Achievement and Recognition

### Supabase Edge Functions

- [ ] T600 Create rank update Edge Function
  - File: `supabase/functions/update-ranks/index.ts`
  - Logic: Check user PV and earnings, update rank
  - Schedule: Run daily after commissions

### Server Actions

- [ ] T601 Create rank server actions
  - File: `app/actions/ranks.ts`
  - Actions:
    - `getCurrentRank()` - Get user's rank
    - `getRankProgress()` - Progress to next rank
    - `getRankHistory()` - Rank achievement history

### UI Components

- [ ] T602 [P] Create RankBadge component
  - File: `components/commissions/rank-badge.tsx`
  - Display: Rank icon, name, color

- [ ] T603 [P] Create RankProgress component
  - File: `components/rank/rank-progress.tsx`
  - Show: Progress bar, requirements, estimated time

### Pages

- [ ] T604 Create Current Rank page
  - File: `app/(dashboard)/rank/current/page.tsx`
  - Display: Badge, benefits, daily cap

- [ ] T605 Create Progress page
  - File: `app/(dashboard)/rank/progress/page.tsx`
  - Show: Next rank, requirements, progress

- [ ] T606 [P] Create Requirements page
  - File: `app/(dashboard)/rank/requirements/page.tsx`
  - Table: All ranks with requirements

- [ ] T607 [P] Create History page
  - File: `app/(dashboard)/rank/history/page.tsx`
  - Timeline: Rank achievements

### Integration

- [ ] T608 Send notification on rank advancement
  - Create notification record
  - Send email via SendGrid

### Testing

- [ ] T609 Test rank advancement logic
- [ ] T610 Test daily earning caps

**Checkpoint**: \u2705 Rank system is functional

---

## Phase 7: Notifications & Profile (Priority: P2) \ud83d\udd14

**Goal**: Users receive notifications and can manage their profile

### Server Actions

- [ ] T700 Create notification server actions
  - File: `app/actions/notifications.ts`
  - Actions:
    - `getNotifications()` - Get user notifications
    - `markAsRead()` - Mark notification as read
    - `deleteNotification()` - Delete notification

- [ ] T701 Create profile server actions
  - File: `app/actions/profile.ts`
  - Actions:
    - `updateProfile()` - Update user info
    - `changePassword()` - Change password
    - `enable2FA()` - Enable two-factor auth

### UI Components

- [ ] T702 [P] Create NotificationBell component
  - File: `components/notifications/notification-bell.tsx`
  - Features: Badge count, dropdown list

- [ ] T703 [P] Create NotificationList component
  - File: `components/notifications/notification-list.tsx`
  - Display: List with read/unread status

### Pages

- [ ] T704 Create Notifications page
  - File: `app/(dashboard)/notifications/page.tsx`
  - List: All notifications with filters

- [ ] T705 Create Profile Info page
  - File: `app/(dashboard)/profile/info/page.tsx`
  - Form: Edit personal information

- [ ] T706 Create Security page
  - File: `app/(dashboard)/profile/security/page.tsx`
  - Features: Change password, 2FA setup

- [ ] T707 [P] Create Settings page
  - File: `app/(dashboard)/profile/settings/page.tsx`
  - Options: Email preferences, notifications

### Integration

- [ ] T708 Setup SendGrid for email notifications
  - Templates: Welcome, rank advancement, commission

- [ ] T709 Implement Supabase Realtime for live notifications

### Testing

- [ ] T710 Test notification creation and display
- [ ] T711 Test email delivery

**Checkpoint**: \u2705 Notifications and profile management working

---

## Phase 8: Support & Help (Priority: P3) \u2753

**Goal**: Users can access help, FAQs, and contact support

### Pages

- [ ] T800 [P] Create Help Center page
  - File: `app/(dashboard)/support/help-center/page.tsx`
  - Content: Articles, guides, tutorials

- [ ] T801 [P] Create FAQs page
  - File: `app/(dashboard)/support/faqs/page.tsx`
  - Layout: Accordion with common questions

- [ ] T802 [P] Create Contact Support page
  - File: `app/(dashboard)/support/contact/page.tsx`
  - Form: Support ticket submission

**Checkpoint**: \u2705 Support pages are available

---

## Phase 9: Admin Panel (Priority: P3) \ud83d\udd27

**Goal**: Admins can manage users, content, and system

### Pages

- [ ] T900 Create Admin Dashboard
  - File: `app/(dashboard)/admin/page.tsx`
  - Stats: Users, transactions, commissions

- [ ] T901 [P] Create User Management
  - File: `app/(dashboard)/admin/users/page.tsx`
  - Actions: View, edit, suspend users

- [ ] T902 [P] Create Content Management
  - File: `app/(dashboard)/admin/content/page.tsx`
  - Actions: Add, edit, delete courses

- [ ] T903 [P] Create Transaction Management
  - File: `app/(dashboard)/admin/transactions/page.tsx`
  - Actions: Approve withdrawals, refunds

**Checkpoint**: \u2705 Admin panel is functional

---

## Phase 10: Testing & Optimization (Priority: P3) \u2699\ufe0f

**Goal**: Ensure quality, performance, and reliability

- [ ] T1000 [P] Write unit tests for utilities
- [ ] T1001 [P] Write integration tests for server actions
- [ ] T1002 [P] Performance optimization (React.memo, lazy loading)
- [ ] T1003 [P] SEO optimization (metadata, sitemap)
- [ ] T1004 [P] Accessibility audit (WCAG compliance)
- [ ] T1005 Security audit (pen testing)
- [ ] T1006 [P] Load testing (10k concurrent users)
- [ ] T1007 Documentation updates

---

## Execution Strategy

### MVP First (Phases 1-5)
1. Database Setup (\u26a0\ufe0f Must complete first)
2. Binary Tree
3. Wallet
4. Commissions
5. Academy
\u2192 **VALIDATE MVP** \u2192 Deploy/Demo

### Enhanced Features (Phases 6-8)
6. Rank System
7. Notifications & Profile
8. Support

### Advanced (Phases 9-10)
9. Admin Panel
10. Testing & Optimization

---

**Total Tasks**: 150+  
**Estimated Time**: 8-12 weeks for MVP  
**Team Size**: 2-3 developers recommended  
**Last Updated**: 2025-10-17
