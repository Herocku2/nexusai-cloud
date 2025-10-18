# Implementation Plan: Nexus AI LMS Platform with Binary MLM System

**Branch**: `[001-nexusai-lms-binary]` | **Date**: 2025-10-17 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-nexusai-lms-binary/spec.md`

## Summary

The Nexus AI platform is an LMS academy with a binary MLM compensation system built with Next.js 15 and Supabase. The implementation uses the WowDash admin template as the frontend foundation, leveraging Supabase for backend services including authentication, database, edge functions, and real-time subscriptions. The system handles user registration, binary tree management, educational content delivery, cryptocurrency payments (USDT on BSC testnet), and commission calculations according to the compensation plan.

## Technical Context

**Language/Version**: TypeScript 5+, Next.js 15.3, React 19  
**Primary Dependencies**: Next.js 15+, Supabase (Auth, Database, Edge Functions), Tailwind CSS 4, React 19  
**Storage**: Supabase PostgreSQL for primary data, Supabase Realtime for live updates  
**Testing**: Jest for unit tests, Playwright for E2E tests  
**Target Platform**: Web application (responsive design for desktop/mobile)  
**Project Type**: Next.js App Router with WowDash admin template  
**Performance Goals**: <2s page load time, <500ms API response time, support 10k concurrent users  
**Constraints**: Supabase-first architecture, TypeScript strict mode, optimized for binary tree calculations  
**Scale/Scope**: 10k+ users, complex binary tree calculations, financial transactions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Next.js App Router with WowDash template provides solid foundation
- ✅ Supabase handles authentication, database, and backend logic
- ✅ Financial transaction handling requires proper security measures
- ✅ Binary tree calculations leverage PostgreSQL recursive CTEs via Supabase
- ✅ TypeScript ensures type safety across the application
- ✅ Existing auth implementation (Supabase) remains untouched

## Project Structure

### Documentation (this feature)

```
specs/001-nexusai-lms-binary/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── api.yaml         # OpenAPI specification
│   └── database.sql     # Database schema
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
# Next.js App Router with WowDash Template
nexusai/front end/wowdash/
├── app/
│   ├── (dashboard)/              # Dashboard routes (protected)
│   │   ├── (homes)/              # Dashboard home variants
│   │   │   ├── dashboard/        # Main dashboard (already exists)
│   │   │   ├── binary-tree/      # Binary tree visualization
│   │   │   ├── my-network/       # User's network overview
│   │   │   └── academy/          # LMS dashboard
│   │   ├── academy/              # Academy routes
│   │   │   ├── courses/          # Course listings
│   │   │   ├── course/[id]/     # Individual course
│   │   │   ├── progress/         # User progress
│   │   │   └── certificates/     # Certificates
│   │   ├── commissions/          # Commission management
│   │   │   ├── earnings/         # Earnings overview
│   │   │   ├── history/          # Commission history
│   │   │   └── reports/          # Commission reports
│   │   ├── wallet/               # Wallet & transactions
│   │   │   ├── deposit/          # Deposit funds
│   │   │   ├── withdraw/         # Withdraw funds
│   │   │   └── transactions/     # Transaction history
│   │   ├── profile/              # User profile
│   │   │   ├── settings/         # Profile settings
│   │   │   └── rank/             # Rank progression
│   │   └── layout.tsx            # Dashboard layout (already exists)
│   ├── auth/                     # Authentication routes (already exists)
│   │   ├── login/                # Login page (exists)
│   │   ├── register/             # Register page (exists)
│   │   ├── forgot-password/      # Password reset (exists)
│   │   └── confirm/              # Email confirmation (exists)
│   ├── actions/                  # Server actions
│   │   ├── auth.ts               # Auth actions (exists)
│   │   ├── binary.ts             # Binary tree actions
│   │   ├── academy.ts            # Academy actions
│   │   ├── commissions.ts        # Commission actions
│   │   └── wallet.ts             # Wallet actions
│   ├── api/                      # API routes
│   │   └── webhooks/             # Webhook handlers
│   │       └── crypto-payment/   # Crypto payment webhooks
│   └── landing.tsx               # Landing page (exists)
├── components/
│   ├── auth/                     # Auth components (exist)
│   ├── binary/                   # Binary tree components
│   │   ├── tree-visualization.tsx
│   │   ├── node-card.tsx
│   │   └── volume-stats.tsx
│   ├── academy/                  # Academy components
│   │   ├── course-card.tsx
│   │   ├── video-player.tsx
│   │   ├── progress-tracker.tsx
│   │   └── certificate.tsx
│   ├── wallet/                   # Wallet components
│   │   ├── deposit-qr.tsx
│   │   ├── withdraw-form.tsx
│   │   └── transaction-list.tsx
│   ├── commissions/              # Commission components
│   │   ├── earnings-card.tsx
│   │   ├── commission-chart.tsx
│   │   └── rank-badge.tsx
│   ├── sidebar-data.ts           # Sidebar configuration (exists)
│   └── nav-main.tsx              # Main navigation (exists)
├── utils/
│   ├── supabase/                 # Supabase utilities (exist)
│   │   ├── client.ts             # Client-side Supabase
│   │   ├── server.ts             # Server-side Supabase
│   │   └── middleware.ts         # Auth middleware
│   ├── binary-calculations.ts    # Binary tree math
│   ├── commission-calculator.ts  # Commission logic
│   └── crypto-helpers.ts         # Crypto utilities
├── lib/
│   ├── types/                    # TypeScript types
│   │   ├── database.ts           # Supabase database types
│   │   ├── binary.ts             # Binary tree types
│   │   ├── academy.ts            # Academy types
│   │   └── commission.ts         # Commission types
│   └── constants.ts              # App constants
└── middleware.ts                 # Next.js middleware (exists)

# Supabase (Backend)
supabase/
├── migrations/                   # Database migrations
│   ├── 001_users_and_auth.sql    # Already done by Supabase Auth
│   ├── 002_binary_positions.sql
│   ├── 003_memberships.sql
│   ├── 004_transactions.sql
│   ├── 005_commissions.sql
│   ├── 006_academy_content.sql
│   ├── 007_ranks.sql
│   └── 008_notifications.sql
├── functions/                    # Edge Functions
│   ├── calculate-commissions/    # Daily commission calculation
│   ├── process-payment/          # Payment processing
│   ├── send-notifications/       # Email/push notifications
│   └── update-ranks/             # Rank advancement
├── seed.sql                      # Seed data (ranks, initial content)
└── config.toml                   # Supabase configuration
```

**Structure Decision**: Next.js App Router architecture with WowDash template as foundation. Supabase handles all backend concerns (auth, database, edge functions). Existing authentication system remains untouched. New features integrate seamlessly with current structure.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Binary tree calculations | Complex MLM compensation structure requires efficient tree traversal and volume calculations | Simple parent-child relationships insufficient for binary MLM requirements |
| Cryptocurrency integration | USDT payments on Binance Smart Chain are core business requirement | Traditional payment gateways don't support the specified cryptocurrency requirements |
| Real-time commission calculations | Daily commission processing affects user earnings and rank advancement | Batch processing only would delay user access to their earnings |
| Two-factor authentication | Financial transactions require enhanced security | Basic password authentication insufficient for financial platform |

## Implementation Phases

### Phase 0: Research & Setup
- Technology stack validation
- Database schema design
- API contract definition
- Development environment setup

### Phase 1: Core Foundation
- User authentication system
- Basic binary tree structure
- Database implementation
- API foundation

### Phase 2: LMS Features
- Content management system
- Video progress tracking
- User dashboard
- Basic academy functionality

### Phase 3: MLM System
- Binary tree management
- Commission calculations
- Rank advancement system
- Payment processing

### Phase 4: Advanced Features
- Cryptocurrency integration
- Email notifications
- Social media integration
- Performance optimization

## Key Implementation Decisions

1. **Next.js App Router**: Leveraging Next.js 15 server components and server actions for optimal performance
2. **Supabase Backend**: All backend logic handled by Supabase (auth, database, edge functions, real-time)
3. **WowDash Template**: Using existing admin template as foundation - auth already implemented
4. **TypeScript Strict Mode**: Type safety across entire application
5. **Tailwind CSS 4**: Utility-first CSS with JIT compilation
6. **Supabase Realtime**: Live updates for binary tree changes and commission notifications

## Performance Considerations

- Binary tree calculations use PostgreSQL recursive CTEs via Supabase
- Commission calculations processed in Supabase Edge Functions as scheduled jobs
- Frontend implements React Server Components for optimal initial load
- Database indexing strategy optimized for binary tree traversal
- Supabase Realtime subscriptions for live data updates
- Next.js automatic code splitting and lazy loading