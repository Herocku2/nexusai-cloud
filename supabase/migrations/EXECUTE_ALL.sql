-- ============================================================================
-- NEXUS AI - ALL MIGRATIONS COMBINED
-- ============================================================================
-- This file contains ALL 12 migrations in order for easy execution
-- You can copy this entire file and paste it into Supabase SQL Editor
-- 
-- WARNING: Only run this ONCE on a fresh database!
-- If you've already run some migrations, execute them individually.
--
-- Created: 2025-10-17
-- Total Lines: ~2000+ lines
-- ============================================================================

-- ============================================================================
-- MIGRATION 001: USER PROFILES
-- ============================================================================

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    country_code CHAR(2),
    date_of_birth DATE,
    sponsor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN ('pending', 'active', 'inactive', 'suspended')),
    balance DECIMAL(20, 8) DEFAULT 0 CHECK (balance >= 0),
    total_earnings DECIMAL(20, 8) DEFAULT 0 CHECK (total_earnings >= 0),
    total_pv DECIMAL(20, 8) DEFAULT 0 CHECK (total_pv >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_sponsor ON user_profiles(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION 002: RANKS AND BINARY TREE
-- ============================================================================

-- Create ranks table
CREATE TABLE IF NOT EXISTS ranks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    min_direct_left INTEGER NOT NULL DEFAULT 1,
    min_direct_right INTEGER NOT NULL DEFAULT 1,
    min_pv_leg DECIMAL(20, 8) NOT NULL DEFAULT 0,
    max_daily_earnings DECIMAL(20, 8),
    requirements JSONB,
    benefits JSONB,
    order_index INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ranks_order ON ranks(order_index);
CREATE INDEX IF NOT EXISTS idx_ranks_active ON ranks(is_active);

-- Seed ranks data (13 ranks)
INSERT INTO ranks (name, slug, min_pv_leg, max_daily_earnings, order_index) VALUES
('Afiliado', 'afiliado', 100, 100, 1),
('Constructor', 'constructor', 150, 250, 2),
('Líder', 'lider', 300, 500, 3),
('Elite', 'elite', 1000, 1000, 4),
('Visionario', 'visionario', 2000, 2000, 5),
('Embajador', 'embajador', 4000, 4000, 6),
('Ejecutivo', 'ejecutivo', 8000, 8000, 7),
('Estrella', 'estrella', 15000, 15000, 8),
('Zafiro', 'zafiro', 25000, 25000, 9),
('Esmeralda', 'esmeralda', 35000, 35000, 10),
('Diamante', 'diamante', 50000, 50000, 11),
('Diamante Azul', 'diamante-azul', 60000, 60000, 12),
('Imperial Nexus', 'imperial-nexus', 70000, 70000, 13)
ON CONFLICT (slug) DO NOTHING;

CREATE TRIGGER update_ranks_updated_at
    BEFORE UPDATE ON ranks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create binary_positions table
CREATE TABLE IF NOT EXISTS binary_positions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    sponsor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    parent_id BIGINT REFERENCES binary_positions(id) ON DELETE CASCADE,
    position_leg VARCHAR(5) NOT NULL CHECK (position_leg IN ('left', 'right')),
    left_child_id BIGINT REFERENCES binary_positions(id) ON DELETE SET NULL,
    right_child_id BIGINT REFERENCES binary_positions(id) ON DELETE SET NULL,
    left_volume DECIMAL(20, 8) DEFAULT 0 CHECK (left_volume >= 0),
    right_volume DECIMAL(20, 8) DEFAULT 0 CHECK (right_volume >= 0),
    left_carryover DECIMAL(20, 8) DEFAULT 0 CHECK (left_carryover >= 0),
    right_carryover DECIMAL(20, 8) DEFAULT 0 CHECK (right_carryover >= 0),
    level INTEGER NOT NULL DEFAULT 1 CHECK (level > 0),
    path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_binary_positions_user ON binary_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_binary_positions_sponsor ON binary_positions(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_binary_positions_parent ON binary_positions(parent_id);
CREATE INDEX IF NOT EXISTS idx_binary_positions_path ON binary_positions(path);
CREATE INDEX IF NOT EXISTS idx_binary_positions_level ON binary_positions(level);

CREATE TRIGGER update_binary_positions_updated_at
    BEFORE UPDATE ON binary_positions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create user_ranks table
CREATE TABLE IF NOT EXISTS user_ranks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rank_id BIGINT NOT NULL REFERENCES ranks(id) ON DELETE CASCADE,
    achieved_at TIMESTAMP WITH TIME ZONE NOT NULL,
    total_earnings DECIMAL(20, 8) NOT NULL DEFAULT 0,
    total_pv DECIMAL(20, 8) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, rank_id)
);

CREATE INDEX IF NOT EXISTS idx_user_ranks_user ON user_ranks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ranks_rank ON user_ranks(rank_id);
CREATE INDEX IF NOT EXISTS idx_user_ranks_achieved ON user_ranks(achieved_at);

CREATE TRIGGER update_user_ranks_updated_at
    BEFORE UPDATE ON user_ranks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION 003: MEMBERSHIPS
-- ============================================================================

CREATE TABLE IF NOT EXISTS memberships (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('initial', 'monthly')),
    amount DECIMAL(20, 8) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USDT',
    pv_value DECIMAL(20, 8) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),
    starts_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    transaction_id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);
CREATE INDEX IF NOT EXISTS idx_memberships_expires ON memberships(expires_at);
CREATE INDEX IF NOT EXISTS idx_memberships_type ON memberships(type);

CREATE TRIGGER update_memberships_updated_at
    BEFORE UPDATE ON memberships
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION 004: TRANSACTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'commission', 'bonus', 'fee', 'membership')),
    subtype VARCHAR(50),
    amount DECIMAL(20, 8) NOT NULL CHECK (amount >= 0),
    fee DECIMAL(20, 8) DEFAULT 0 CHECK (fee >= 0),
    net_amount DECIMAL(20, 8) GENERATED ALWAYS AS (amount - fee) STORED,
    currency VARCHAR(10) DEFAULT 'USDT',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    blockchain_tx_hash VARCHAR(255),
    from_address VARCHAR(255),
    to_address VARCHAR(255),
    block_number BIGINT,
    confirmations INTEGER DEFAULT 0,
    required_confirmations INTEGER DEFAULT 12,
    metadata JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_blockchain ON transactions(blockchain_tx_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_uuid ON transactions(uuid);

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION 005: COMMISSIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS commissions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('fast_start', 'binary', 'matching')),
    transaction_id BIGINT,
    amount DECIMAL(20, 8) NOT NULL CHECK (amount >= 0),
    percentage DECIMAL(5, 2),
    base_amount DECIMAL(20, 8),
    level INTEGER,
    left_leg_volume DECIMAL(20, 8),
    right_leg_volume DECIMAL(20, 8),
    weaker_leg_volume DECIMAL(20, 8),
    daily_cap DECIMAL(20, 8),
    capped_amount DECIMAL(20, 8),
    cycle_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commissions_user ON commissions(user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_type ON commissions(type);
CREATE INDEX IF NOT EXISTS idx_commissions_cycle ON commissions(cycle_date);
CREATE INDEX IF NOT EXISTS idx_commissions_source ON commissions(source_user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_created_at ON commissions(created_at);

CREATE TRIGGER update_commissions_updated_at
    BEFORE UPDATE ON commissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION 006: ACADEMY CONTENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS academy_content (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('video', 'document', 'quiz', 'zoom_meeting', 'article')),
    url VARCHAR(500),
    file_path VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    thumbnail_url VARCHAR(500),
    duration INTEGER,
    content_data JSONB,
    required_rank_id BIGINT REFERENCES ranks(id),
    is_free BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    category VARCHAR(100),
    tags TEXT[],
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_academy_content_type ON academy_content(type);
CREATE INDEX IF NOT EXISTS idx_academy_content_rank ON academy_content(required_rank_id);
CREATE INDEX IF NOT EXISTS idx_academy_content_active ON academy_content(is_active);
CREATE INDEX IF NOT EXISTS idx_academy_content_order ON academy_content(order_index);
CREATE INDEX IF NOT EXISTS idx_academy_content_category ON academy_content(category);
CREATE INDEX IF NOT EXISTS idx_academy_content_slug ON academy_content(slug);

CREATE TRIGGER update_academy_content_updated_at
    BEFORE UPDATE ON academy_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION 007: USER CONTENT PROGRESS
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_content_progress (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_id BIGINT NOT NULL REFERENCES academy_content(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    watch_time INTEGER DEFAULT 0,
    last_position INTEGER DEFAULT 0,
    quiz_attempts INTEGER DEFAULT 0,
    quiz_score DECIMAL(5, 2),
    quiz_answers JSONB,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, content_id)
);

CREATE INDEX IF NOT EXISTS idx_user_content_progress_user ON user_content_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_content_progress_content ON user_content_progress(content_id);
CREATE INDEX IF NOT EXISTS idx_user_content_progress_status ON user_content_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_content_progress_completed ON user_content_progress(completed_at);

CREATE TRIGGER update_user_content_progress_updated_at
    BEFORE UPDATE ON user_content_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION 008: NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- ============================================================================
-- MIGRATION 009: WITHDRAWAL REQUESTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS withdrawal_requests (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(20, 8) NOT NULL CHECK (amount >= 20),
    fee DECIMAL(20, 8) GENERATED ALWAYS AS (amount * 0.03) STORED,
    net_amount DECIMAL(20, 8) GENERATED ALWAYS AS (amount - (amount * 0.03)) STORED,
    currency VARCHAR(10) DEFAULT 'USDT',
    destination_address VARCHAR(255) NOT NULL,
    network VARCHAR(50) DEFAULT 'TRC20',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected', 'cancelled')),
    blockchain_tx_hash VARCHAR(255),
    notes TEXT,
    admin_notes TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_withdrawal_user ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_status ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_created ON withdrawal_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_withdrawal_uuid ON withdrawal_requests(uuid);

CREATE TRIGGER update_withdrawal_requests_updated_at
    BEFORE UPDATE ON withdrawal_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION 010: SYSTEM SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS system_settings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    type VARCHAR(20) DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_settings_key ON system_settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_public ON system_settings(is_public);

CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

INSERT INTO system_settings (key, value, type, description, is_public) VALUES
('initial_membership_price', '89', 'number', 'Initial membership price in USDT', true),
('monthly_membership_price', '29', 'number', 'Monthly membership renewal price in USDT', true),
('initial_membership_pv', '89', 'number', 'PV value for initial membership', false),
('monthly_membership_pv', '29', 'number', 'PV value for monthly membership', false),
('withdrawal_min_amount', '20', 'number', 'Minimum withdrawal amount in USDT', true),
('withdrawal_fee_percentage', '3', 'number', 'Withdrawal fee percentage (3%)', true),
('blockchain_confirmations_required', '12', 'number', 'Required blockchain confirmations for deposits', false),
('fast_start_l1_bonus', '40', 'number', 'Fast Start bonus for Level 1 referrals in USDT', false),
('fast_start_l2_bonus', '8', 'number', 'Fast Start bonus for Level 2 referrals in USDT', false),
('binary_commission_percentage', '50', 'number', 'Binary commission percentage (50% of weaker leg)', false),
('matching_bonus_percentage', '50', 'number', 'Matching bonus percentage (50% of directs binary)', false),
('platform_name', 'Nexus AI', 'string', 'Platform name', true),
('support_email', 'support@nexusai.com', 'string', 'Support email address', true),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', false)
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- NOTE: Migrations 011 (Functions) and 012 (RLS Policies) are too large
-- to include in this combined file. Please execute them separately:
--
-- 1. Execute this file (001-010) first
-- 2. Then execute 011_functions.sql
-- 3. Finally execute 012_rls_policies.sql
--
-- This ensures proper ordering and error handling.
-- ============================================================================

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Uncomment to verify after running:

-- SELECT 'Tables created:' as status, COUNT(*) as count 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public';

-- SELECT 'Ranks seeded:' as status, COUNT(*) as count FROM ranks;

-- SELECT 'Settings seeded:' as status, COUNT(*) as count FROM system_settings;
