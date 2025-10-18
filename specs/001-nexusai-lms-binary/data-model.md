# Data Model: Nexus AI LMS Platform with Binary MLM System

**Date**: 2025-10-17  
**Feature**: [001-nexusai-lms-binary](plan.md)  
**Updated for**: Supabase PostgreSQL

## Entity Relationship Overview

The data model is designed around core entities: Users, Binary Tree Structure, Financial Transactions, Educational Content, and Commissions.

**Important**: This document provides the conceptual data model. For actual SQL migrations to run in Supabase, see [SUPABASE_MIGRATIONS_GUIDE.md](SUPABASE_MIGRATIONS_GUIDE.md).

## Supabase Authentication Integration

### Users (Supabase Auth)

Supabase provides a built-in `auth.users` table that handles:
- Email/password authentication
- OAuth providers (Google, Facebook, etc.)
- Email verification
- Password reset
- Session management

**We extend this with a `user_profiles` table:**

### User Profiles Table (Extends auth.users)

```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    country_code CHAR(2),
    date_of_birth DATE,
    sponsor_id UUID REFERENCES auth.users(id),
    status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN ('pending', 'active', 'inactive', 'suspended')),
    balance DECIMAL(20, 8) DEFAULT 0,
    total_earnings DECIMAL(20, 8) DEFAULT 0,
    total_pv DECIMAL(20, 8) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_profiles_sponsor ON user_profiles(sponsor_id);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at);
```

> **Note**: Supabase Auth handles authentication. The `user_profiles` table stores additional business data.

### Binary Positions Table

```sql
CREATE TABLE binary_positions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    sponsor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    parent_id BIGINT REFERENCES binary_positions(id) ON DELETE CASCADE,
    position_leg VARCHAR(5) NOT NULL CHECK (position_leg IN ('left', 'right')),
    left_child_id BIGINT REFERENCES binary_positions(id) ON DELETE SET NULL,
    right_child_id BIGINT REFERENCES binary_positions(id) ON DELETE SET NULL,
    left_volume DECIMAL(20,8) DEFAULT 0,
    right_volume DECIMAL(20,8) DEFAULT 0,
    left_carryover DECIMAL(20,8) DEFAULT 0,
    right_carryover DECIMAL(20,8) DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    path TEXT, -- Materialized path for efficient queries
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_binary_positions_user ON binary_positions(user_id);
CREATE INDEX idx_binary_positions_sponsor ON binary_positions(sponsor_id);
CREATE INDEX idx_binary_positions_parent ON binary_positions(parent_id);
CREATE INDEX idx_binary_positions_path ON binary_positions(path);
CREATE INDEX idx_binary_positions_level ON binary_positions(level);
```

> **Note**: References `auth.users(id)` from Supabase Auth instead of a custom users table.

### Memberships Table

**Note**: See actual migration in `002_nexusai/supabase/migrations/003_memberships.sql`

```sql
CREATE TABLE memberships (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('initial', 'monthly')),
    amount DECIMAL(20,8) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USDT',
    pv_value DECIMAL(20,8) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),
    starts_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Transactions Table

**Note**: See actual migration in `002_nexusai/supabase/migrations/004_transactions.sql`

```sql
CREATE TABLE transactions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'commission', 'bonus', 'fee', 'membership')),
    subtype VARCHAR(50), -- fast_start, binary, matching, etc.
    amount DECIMAL(20,8) NOT NULL CHECK (amount >= 0),
    fee DECIMAL(20,8) DEFAULT 0 CHECK (fee >= 0),
    net_amount DECIMAL(20,8) GENERATED ALWAYS AS (amount - fee) STORED,
    currency VARCHAR(10) DEFAULT 'USDT',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    blockchain_tx_hash VARCHAR(255),
    metadata JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Ranks Table

**Note**: See actual migration in `002_nexusai/supabase/migrations/002_ranks_and_binary.sql` (includes 13 ranks seed data)

```sql
CREATE TABLE ranks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    min_direct_left INTEGER NOT NULL DEFAULT 1,
    min_direct_right INTEGER NOT NULL DEFAULT 1,
    min_pv_leg DECIMAL(20,8) NOT NULL DEFAULT 0,
    max_daily_earnings DECIMAL(20,8),
    requirements JSONB,
    benefits JSONB,
    order_index INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### User Ranks Table

**Note**: See actual migration in `002_nexusai/supabase/migrations/002_ranks_and_binary.sql`

```sql
CREATE TABLE user_ranks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rank_id BIGINT NOT NULL REFERENCES ranks(id) ON DELETE CASCADE,
    achieved_at TIMESTAMP WITH TIME ZONE NOT NULL,
    total_earnings DECIMAL(20,8) NOT NULL DEFAULT 0,
    total_pv DECIMAL(20,8) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Content Table

```sql
CREATE TABLE content (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    type ENUM('video', 'document', 'quiz', 'zoom_meeting') NOT NULL,
    url VARCHAR(500),
    duration INTEGER, -- in seconds for videos
    file_path VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    thumbnail_url VARCHAR(500),
    content_data JSONB, -- Additional content-specific data
    required_rank_id BIGINT REFERENCES ranks(id),
    is_free BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_content_type (type),
    INDEX idx_content_rank (required_rank_id),
    INDEX idx_content_active (is_active),
    INDEX idx_content_order (order_index)
);
```

### Content Progress Table

```sql
CREATE TABLE content_progress (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id BIGINT NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
    progress_percentage INTEGER DEFAULT 0,
    watch_time INTEGER DEFAULT 0, -- in seconds for videos
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_content_progress_user_content (user_id, content_id),
    INDEX idx_content_progress_user (user_id),
    INDEX idx_content_progress_status (status)
);
```

### Commissions Table

```sql
CREATE TABLE commissions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL, -- User who generated the commission
    type ENUM('fast_start', 'binary', 'matching') NOT NULL,
    transaction_id BIGINT REFERENCES transactions(id),
    amount DECIMAL(20,8) NOT NULL,
    percentage DECIMAL(5,2), -- Commission percentage
    base_amount DECIMAL(20,8), -- Base amount for percentage calculation
    level INTEGER, -- Commission level (for matching bonuses)
    left_leg_volume DECIMAL(20,8),
    right_leg_volume DECIMAL(20,8),
    weaker_leg_volume DECIMAL(20,8),
    cycle_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_commissions_user (user_id),
    INDEX idx_commissions_type (type),
    INDEX idx_commissions_cycle (cycle_date),
    INDEX idx_commissions_source (source_user_id)
);
```

### Withdrawal Requests Table

```sql
CREATE TABLE withdrawal_requests (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(20,8) NOT NULL,
    fee DECIMAL(20,8) GENERATED ALWAYS AS (amount * 0.03) STORED,
    net_amount DECIMAL(20,8) GENERATED ALWAYS AS (amount - fee) STORED,
    currency VARCHAR(10) DEFAULT 'USDT',
    destination_address VARCHAR(255) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'rejected', 'cancelled') DEFAULT 'pending',
    blockchain_tx_hash VARCHAR(255),
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    INDEX idx_withdrawal_user (user_id),
    INDEX idx_withdrawal_status (status),
    INDEX idx_withdrawal_created (created_at)
);
```

### Notifications Table

```sql
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    email_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    INDEX idx_notifications_user (user_id),
    INDEX idx_notifications_read (is_read),
    INDEX idx_notifications_type (type),
    INDEX idx_notifications_created (created_at)
);
```

### System Settings Table

```sql
CREATE TABLE system_settings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_settings_key (key),
    INDEX idx_settings_public (is_public)
);
```

## Data Relationships

### Binary Tree Relationships
- Each User (`auth.users`) has one BinaryPosition
- BinaryPositions form a hierarchical tree structure
- Each position has a left and right child
- Users can sponsor multiple direct recruits via `sponsor_id`

### Financial Relationships
- Users (`auth.users`) have multiple Transactions
- Transactions can generate Commissions
- Withdrawal Requests create Transactions
- Memberships create Transactions

### Content Relationships
- Users track progress on Content
- Content may require minimum Rank to access
- Content can be organized by type and order

## Supabase-Specific Features

### Row Level Security (RLS)

All tables have RLS policies that ensure:
- Users can only view their own data
- Admins have elevated permissions
- Public data is explicitly marked

```sql
-- Example RLS Policy
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);
```

### Realtime Subscriptions

Key tables support Supabase Realtime for live updates:
- `binary_positions` - Live tree updates
- `transactions` - Real-time balance changes
- `commissions` - Live commission notifications
- `notifications` - Instant notifications

### Edge Functions for Business Logic

Complex calculations run in Supabase Edge Functions:
- `calculate-commissions` - Daily commission calculation
- `update-ranks` - Automatic rank advancement
- `process-payment` - Payment webhook handling

## Indexing Strategy

### Performance Optimization
- Primary keys on all tables
- Foreign key indexes for join performance
- Composite indexes for common query patterns
- Partial indexes for filtered queries

### Binary Tree Optimization
- Materialized path for efficient tree queries
- Level-based indexing for scope queries
- Volume calculation indexes for commission processing

## Data Integrity Constraints

### Business Logic Constraints
- Check constraints for positive amounts
- Enum constraints for valid status values
- Unique constraints for business rules
- Foreign key constraints for referential integrity

### Financial Constraints
- Decimal precision for financial calculations
- Transaction status workflow validation
- Withdrawal minimum amount validation
- Commission percentage range validation

## Data Migration Strategy

### Initial Setup
1. **Supabase Project Creation** - Create project at https://supabase.com
2. **Run Migrations** - Execute SQL from [SUPABASE_MIGRATIONS_GUIDE.md](SUPABASE_MIGRATIONS_GUIDE.md)
3. **Ranks Seeding** - 13 ranks with compensation plan data
4. **RLS Policies** - Enable Row Level Security on all tables
5. **Generate Types** - Auto-generate TypeScript types

### Migration Files (Execute in Order)

```
001_user_profiles.sql       - User profiles extending auth.users
002_ranks.sql               - MLM ranks with seed data
003_binary_positions.sql    - Binary tree structure
004_memberships.sql         - Membership management
005_transactions.sql        - Financial transactions
006_commissions.sql         - Commission records
007_academy_content.sql     - LMS content
008_user_content_progress.sql - Progress tracking
009_notifications.sql       - Notification system
010_user_ranks.sql          - Rank achievement history
011_functions.sql           - PostgreSQL functions
012_triggers.sql            - Automated triggers
013_rls_policies.sql        - Row Level Security
014_seed_data.sql           - Initial data
```

### Ongoing Maintenance
- **Versioned Migrations** - Use Supabase CLI for migrations
- **Automated Backups** - Enable in Supabase dashboard
- **Performance Monitoring** - Use Supabase analytics
- **Type Generation** - Regenerate after schema changes

```bash
# Generate TypeScript types
npx supabase gen types typescript --project-id YOUR_ID > lib/types/database.ts
```

---

## 📖 Complete Migration Guide

For detailed SQL migrations and step-by-step instructions, see:

**[SUPABASE_MIGRATIONS_GUIDE.md](SUPABASE_MIGRATIONS_GUIDE.md)**

This guide includes:
- ✅ All 14 migration files with complete SQL
- ✅ Row Level Security policies
- ✅ PostgreSQL functions for binary tree calculations
- ✅ Triggers for automatic updates
- ✅ Seed data for ranks and settings
- ✅ Verification queries

---

This data model provides a solid foundation for the Nexus AI platform using Supabase PostgreSQL, supporting all required functionality while maintaining data integrity and performance optimizations for complex MLM calculations.

**Last Updated**: 2025-10-17  
**Version**: 2.0 (Updated for Supabase PostgreSQL)  
**See Also**: [SUPABASE_MIGRATIONS_GUIDE.md](SUPABASE_MIGRATIONS_GUIDE.md), [quickstart.md](quickstart.md)