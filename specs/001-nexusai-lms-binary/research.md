# Phase 0 Research: Nexus AI LMS Platform with Binary MLM System

**Date**: 2025-10-17  
**Feature**: [001-nexusai-lms-binary](plan.md)  
**Updated for**: Next.js 15 + Supabase + WowDash Template

## Technology Stack Research

### Frontend: Next.js 15 + WowDash Template

**Rationale**: 
- Next.js 15 provides modern React features with App Router
- WowDash template already implemented and provides solid admin UI foundation
- Server Components reduce JavaScript bundle size
- Built-in authentication already implemented with Supabase
- TypeScript ensures type safety across the application

**Key Features**:
- Next.js 15.3 with Turbopack for fast development
- React 19 with Server Components
- WowDash admin template (already integrated)
- Tailwind CSS 4 for styling
- TypeScript strict mode
- Existing Supabase auth integration (DO NOT MODIFY)

**Performance Benefits**:
- Server-side rendering for optimal SEO
- Automatic code splitting
- Image optimization
- Edge runtime support
- Streaming SSR capabilities

### Backend: Supabase (Complete Backend Solution)

**Rationale**:
- Authentication already implemented and working
- PostgreSQL database with advanced features (recursive CTEs for binary tree)
- Edge Functions for serverless backend logic
- Real-time subscriptions for live updates
- Row Level Security (RLS) for data protection
- Built-in API generation

**Key Features**:
- Supabase Auth (already configured)
- PostgreSQL 15+ database
- Edge Functions (Deno runtime)
- Realtime subscriptions
- Storage for course videos/files
- Auto-generated TypeScript types

### Binary Tree Implementation Research

**Database Schema Considerations**:
- Recursive Common Table Expressions (CTE) via Supabase PostgreSQL
- Materialized path pattern for efficient tree queries
- Closure table for complex genealogy queries
- Optimized indexes on parent_id, left_child_id, right_child_id

**Calculation Requirements**:
- Daily commission calculations via Supabase Edge Functions
- Carry-over tracking for stronger leg volume
- Rank advancement based on cumulative PV
- Matching bonus calculations for level 1 referrals
- Real-time volume updates via Supabase Realtime

### Cryptocurrency Integration Research

**Binance Smart Chain (BSC) Testnet Integration**:
- USDT (BEP-20) token handling
- QR code generation for deposit addresses
- Webhook implementation for payment confirmations
- Transaction monitoring via Edge Functions

**Payment Gateway Options**:

**Option 1: NowPayments (Recommended)**
- Pros: Cryptocurrency-specific, supports USDT BEP-20, webhooks, easy integration
- Cons: Transaction fees (typically 0.5-1%)
- Integration: Next.js API routes + Edge Functions

**Option 2: CoinPayments**
- Pros: Multi-currency support, established platform
- Cons: Higher fees, more complex API

**Option 3: Direct Smart Contract Integration**
- Pros: Full control, lower fees
- Cons: Requires blockchain development expertise, security audits
- Not recommended for MVP

**Security Considerations**:
- Wallet private key management (use Supabase Vault)
- Transaction signature validation
- Webhook signature verification
- Rate limiting on deposit endpoints
- Minimum confirmation blocks (12 for BSC)

## Security Research

### Authentication & Authorization
- Supabase Auth with JWT tokens (already implemented)
- Two-factor authentication (TOTP) via Supabase Auth helpers
- Row Level Security (RLS) for database access control
- API rate limiting via Edge Functions
- Session management handled by Supabase

### Financial Security
- Transaction signing and verification
- Audit trail using Supabase triggers
- Withdrawal approval workflows
- Fraud detection patterns
- Minimum withdrawal amounts (20 USDT)
- 3% withdrawal fee

### Data Protection
- GDPR compliance considerations
- Data encryption at rest (Supabase default)
- Data encryption in transit (HTTPS)
- Secure password hashing (Supabase Auth handles this)
- Session security via httpOnly cookies

## Performance Research

### Database Optimization
- Indexing strategy for binary tree queries
- Partitioning for large transaction tables
- Connection pooling (Supabase handles this)
- Query optimization via Supabase Explain
- Database query result caching

### Caching Strategy
- Edge caching for static content (Vercel Edge)
- Application-level caching with Next.js revalidation
- Supabase Realtime for live data
- CDN integration (Vercel CDN)
- Browser caching headers

### Scalability Considerations
- Horizontal scaling via Vercel serverless
- Supabase database read replicas
- Edge Function concurrency limits
- Load balancing (handled by Vercel)
- Rate limiting per user/IP

## Legal & Compliance Research

### MLM Regulations
- Compliance requirements for different jurisdictions
- Income disclosure requirements
- Terms of service and privacy policy
- User agreement and terms acceptance
- Tax reporting considerations

### Cryptocurrency Regulations
- KYC/AML requirements (optional for testnet)
- Transaction reporting obligations
- Jurisdiction-specific crypto regulations
- Tax reporting for crypto earnings

## Risk Assessment

### Technical Risks
- Database performance with large binary trees (mitigated by PostgreSQL CTEs)
- Cryptocurrency transaction delays (12 block confirmations)
- Security vulnerabilities in payment processing
- Scalability limitations at scale

### Business Risks
- Regulatory changes affecting MLM operations
- Cryptocurrency market volatility
- User adoption challenges
- Competitive pressure

### Mitigation Strategies
- Comprehensive testing plan
- Security audit schedule
- Performance monitoring (Vercel Analytics + Supabase Dashboard)
- Regulatory compliance tracking
- User education programs

## Development Environment Research

### Local Development Setup
- Next.js local development server (already running)
- Supabase local development (optional)
- Mock cryptocurrency testnet
- Development tools and debugging (React DevTools, Vercel Toolbar)

### Deployment Strategy
- Vercel deployment for Next.js frontend
- Supabase hosted database and auth
- Edge Functions deployed to Supabase
- Environment variable management (Vercel + Supabase)
- Monitoring and alerting (Vercel Analytics + Sentry)

## Research Summary

The research phase confirms the technical feasibility of the Nexus AI platform with Next.js 15 and Supabase. The existing WowDash template provides a solid foundation, and Supabase's comprehensive backend services eliminate the need for separate backend infrastructure.

Key findings:
1. ✅ Existing Supabase Auth integration works perfectly - DO NOT MODIFY
2. ✅ PostgreSQL recursive CTEs (via Supabase) are ideal for binary tree calculations
3. ✅ Supabase Edge Functions are perfect for commission processing
4. ✅ Third-party payment gateway (NowPayments) recommended for faster MVP
5. ✅ Supabase Realtime enables live binary tree updates
6. ✅ Next.js Server Components optimize performance
7. ✅ TypeScript + Supabase auto-generated types ensure type safety

Next steps involve creating detailed data models and Supabase migrations in Phase 1.