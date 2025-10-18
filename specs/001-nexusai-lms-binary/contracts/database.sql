-- Nexus AI LMS Platform Database Schema
-- PostgreSQL 15+ compatible

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_status AS ENUM ('pending', 'active', 'inactive', 'suspended');
CREATE TYPE position_leg AS ENUM ('left', 'right');
CREATE TYPE membership_type AS ENUM ('initial', 'monthly');
CREATE TYPE membership_status AS ENUM ('pending', 'active', 'expired', 'cancelled');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'commission', 'bonus', 'fee');
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE commission_type AS ENUM ('fast_start', 'binary', 'matching');
CREATE TYPE content_type AS ENUM ('video', 'document', 'quiz', 'zoom_meeting');
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE withdrawal_status AS ENUM ('pending', 'processing', 'completed', 'rejected', 'cancelled');

-- Users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    country_code CHAR(2),
    date_of_birth DATE,
    two_factor_secret VARCHAR(255),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_backup_codes JSONB,
    email_verified_at TIMESTAMP,
    status user_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    terms_accepted_at TIMESTAMP,
    terms_accepted_ip INET,
    social_accounts JSONB
);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Binary positions table
CREATE TABLE binary_positions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sponsor_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    position_leg position_leg NOT NULL,
    parent_id BIGINT REFERENCES binary_positions(id) ON DELETE CASCADE,
    left_child_id BIGINT REFERENCES binary_positions(id) ON DELETE SET NULL,
    right_child_id BIGINT REFERENCES binary_positions(id) ON DELETE SET NULL,
    left_volume DECIMAL(20,8) DEFAULT 0,
    right_volume DECIMAL(20,8) DEFAULT 0,
    left_carryover DECIMAL(20,8) DEFAULT 0,
    right_carryover DECIMAL(20,8) DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_binary_positions_user UNIQUE (user_id)
);

-- Indexes for binary positions
CREATE INDEX idx_binary_positions_sponsor ON binary_positions(sponsor_id);
CREATE INDEX idx_binary_positions_parent ON binary_positions(parent_id);
CREATE INDEX idx_binary_positions_path ON binary_positions(path);
CREATE INDEX idx_binary_positions_level ON binary_positions(level);

-- Ranks table
CREATE TABLE ranks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    min_direct_left INTEGER NOT NULL DEFAULT 0,
    min_direct_right INTEGER NOT NULL DEFAULT 0,
    min_pv_leg DECIMAL(20,8) NOT NULL DEFAULT 0,
    max_daily_earnings DECIMAL(20,8),
    requirements JSONB,
    benefits JSONB,
    order_index INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for ranks
CREATE INDEX idx_ranks_order ON ranks(order_index);
CREATE INDEX idx_ranks_active ON ranks(is_active);

-- Memberships table
CREATE TABLE memberships (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type membership_type NOT NULL,
    amount DECIMAL(20,8) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USDT',
    pv_value DECIMAL(20,8) NOT NULL,
    status membership_status DEFAULT 'pending',
    starts_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_id BIGINT
);

-- Indexes for memberships
CREATE INDEX idx_memberships_user ON memberships(user_id);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_memberships_expires ON memberships(expires_at);

-- Transactions table
CREATE TABLE transactions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    subtype VARCHAR(50),
    amount DECIMAL(20,8) NOT NULL,
    fee DECIMAL(20,8) DEFAULT 0,
    net_amount DECIMAL(20,8) GENERATED ALWAYS AS (amount - fee) STORED,
    currency VARCHAR(10) DEFAULT 'USDT',
    status transaction_status DEFAULT 'pending',
    blockchain_tx_hash VARCHAR(255),
    from_address VARCHAR(255),
    to_address VARCHAR(255),
    block_number BIGINT,
    confirmations INTEGER DEFAULT 0,
    required_confirmations INTEGER DEFAULT 12,
    metadata JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

-- Indexes for transactions
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_blockchain ON transactions(blockchain_tx_hash);

-- User ranks table
CREATE TABLE user_ranks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rank_id BIGINT NOT NULL REFERENCES ranks(id) ON DELETE CASCADE,
    achieved_at TIMESTAMP NOT NULL,
    total_earnings DECIMAL(20,8) NOT NULL DEFAULT 0,
    total_pv DECIMAL(20,8) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_ranks_user_rank UNIQUE (user_id, rank_id)
);

-- Indexes for user ranks
CREATE INDEX idx_user_ranks_user ON user_ranks(user_id);
CREATE INDEX idx_user_ranks_achieved ON user_ranks(achieved_at);

-- Content table
CREATE TABLE content (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    type content_type NOT NULL,
    url VARCHAR(500),
    duration INTEGER,
    file_path VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    thumbnail_url VARCHAR(500),
    content_data JSONB,
    required_rank_id BIGINT REFERENCES ranks(id),
    is_free BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for content
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_rank ON content(required_rank_id);
CREATE INDEX idx_content_active ON content(is_active);
CREATE INDEX idx_content_order ON content(order_index);

-- Content progress table
CREATE TABLE content_progress (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id BIGINT NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    status progress_status DEFAULT 'not_started',
    progress_percentage INTEGER DEFAULT 0,
    watch_time INTEGER DEFAULT 0,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_content_progress_user_content UNIQUE (user_id, content_id)
);

-- Indexes for content progress
CREATE INDEX idx_content_progress_user ON content_progress(user_id);
CREATE INDEX idx_content_progress_status ON content_progress(status);

-- Commissions table
CREATE TABLE commissions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    type commission_type NOT NULL,
    transaction_id BIGINT REFERENCES transactions(id),
    amount DECIMAL(20,8) NOT NULL,
    percentage DECIMAL(5,2),
    base_amount DECIMAL(20,8),
    level INTEGER,
    left_leg_volume DECIMAL(20,8),
    right_leg_volume DECIMAL(20,8),
    weaker_leg_volume DECIMAL(20,8),
    cycle_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for commissions
CREATE INDEX idx_commissions_user ON commissions(user_id);
CREATE INDEX idx_commissions_type ON commissions(type);
CREATE INDEX idx_commissions_cycle ON commissions(cycle_date);
CREATE INDEX idx_commissions_source ON commissions(source_user_id);

-- Withdrawal requests table
CREATE TABLE withdrawal_requests (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(20,8) NOT NULL,
    fee DECIMAL(20,8) GENERATED ALWAYS AS (amount * 0.03) STORED,
    net_amount DECIMAL(20,8) GENERATED ALWAYS AS (amount - fee) STORED,
    currency VARCHAR(10) DEFAULT 'USDT',
    destination_address VARCHAR(255) NOT NULL,
    status withdrawal_status DEFAULT 'pending',
    blockchain_tx_hash VARCHAR(255),
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

-- Indexes for withdrawal requests
CREATE INDEX idx_withdrawal_user ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_status ON withdrawal_requests(status);
CREATE INDEX idx_withdrawal_created ON withdrawal_requests(created_at);

-- Notifications table
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
    read_at TIMESTAMP
);

-- Indexes for notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- System settings table
CREATE TABLE system_settings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    type VARCHAR(20) DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for system settings
CREATE INDEX idx_settings_key ON system_settings(key);
CREATE INDEX idx_settings_public ON system_settings(is_public);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_binary_positions_updated_at BEFORE UPDATE ON binary_positions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ranks_updated_at BEFORE UPDATE ON ranks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON memberships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_ranks_updated_at BEFORE UPDATE ON user_ranks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_progress_updated_at BEFORE UPDATE ON content_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON commissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_withdrawal_requests_updated_at BEFORE UPDATE ON withdrawal_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Recursive CTE function for binary tree traversal
CREATE OR REPLACE FUNCTION get_binary_downline(root_user_id BIGINT, max_depth INTEGER DEFAULT 10)
RETURNS TABLE(
    user_id BIGINT,
    sponsor_id BIGINT,
    level INTEGER,
    position_leg position_leg,
    left_volume DECIMAL(20,8),
    right_volume DECIMAL(20,8),
    path TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE binary_tree AS (
        -- Base case: Get the root user's binary position
        SELECT 
            bp.user_id,
            bp.sponsor_id,
            0 as level,
            bp.position_leg,
            bp.left_volume,
            bp.right_volume,
            bp.path
        FROM binary_positions bp
        WHERE bp.user_id = root_user_id
        
        UNION ALL
        
        -- Recursive case: Get all descendants
        SELECT 
            bp.user_id,
            bp.sponsor_id,
            bt.level + 1,
            bp.position_leg,
            bp.left_volume,
            bp.right_volume,
            bp.path
        FROM binary_positions bp
        INNER JOIN binary_tree bt ON bp.parent_id = (
            SELECT id FROM binary_positions WHERE user_id = bt.user_id
        )
        WHERE bt.level < max_depth
    )
    SELECT * FROM binary_tree ORDER BY level, position_leg;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate binary commissions
CREATE OR REPLACE FUNCTION calculate_binary_commission(user_id BIGINT, cycle_date DATE DEFAULT CURRENT_DATE)
RETURNS DECIMAL(20,8) AS $$
DECLARE
    weaker_leg_volume DECIMAL(20,8);
    commission_rate DECIMAL(5,2) := 0.50; -- 50% commission rate
    commission_amount DECIMAL(20,8);
    user_rank_id BIGINT;
    max_daily_earnings DECIMAL(20,8);
BEGIN
    -- Get user's current rank
    SELECT ur.rank_id INTO user_rank_id
    FROM user_ranks ur
    WHERE ur.user_id = user_id
    ORDER BY ur.achieved_at DESC
    LIMIT 1;
    
    -- Get max daily earnings from rank
    SELECT r.max_daily_earnings INTO max_daily_earnings
    FROM ranks r
    WHERE r.id = user_rank_id;
    
    -- Get weaker leg volume
    SELECT 
        CASE 
            WHEN left_volume <= right_volume THEN left_volume
            ELSE right_volume
        END INTO weaker_leg_volume
    FROM binary_positions
    WHERE user_id = user_id;
    
    -- Calculate commission
    commission_amount := weaker_leg_volume * commission_rate;
    
    -- Apply daily earnings cap if rank has one
    IF max_daily_earnings IS NOT NULL THEN
        -- Check today's total commissions
        DECLARE
            today_total DECIMAL(20,8);
        BEGIN
            SELECT COALESCE(SUM(amount), 0) INTO today_total
            FROM commissions
            WHERE user_id = user_id 
              AND type = 'binary'
              AND cycle_date = cycle_date;
            
            IF today_total + commission_amount > max_daily_earnings THEN
                commission_amount := max_daily_earnings - today_total;
            END IF;
        END;
    END IF;
    
    RETURN commission_amount;
END;
$$ LANGUAGE plpgsql;

-- Function to update binary tree path
CREATE OR REPLACE FUNCTION update_binary_path()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Build path for new position
        IF NEW.parent_id IS NOT NULL THEN
            SELECT path || '.' || NEW.id INTO NEW.path
            FROM binary_positions
            WHERE id = NEW.parent_id;
        ELSE
            NEW.path := NEW.id::TEXT;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Update path if parent changed
        IF OLD.parent_id IS DISTINCT FROM NEW.parent_id THEN
            IF NEW.parent_id IS NOT NULL THEN
                SELECT path || '.' || NEW.id INTO NEW.path
                FROM binary_positions
                WHERE id = NEW.parent_id;
            ELSE
                NEW.path := NEW.id::TEXT;
            END IF;
            
            -- Update all descendants' paths
            UPDATE binary_positions
            SET path = NEW.path || SUBSTRING(path FROM LENGTH(OLD.path) + 1)
            WHERE path LIKE OLD.path || '.%';
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for binary path updates
CREATE TRIGGER update_binary_path_trigger
    BEFORE INSERT OR UPDATE ON binary_positions
    FOR EACH ROW EXECUTE FUNCTION update_binary_path();

-- Insert initial ranks data
INSERT INTO ranks (name, slug, description, min_direct_left, min_direct_right, min_pv_leg, max_daily_earnings, order_index) VALUES
('Afiliado', 'afiliado', 'Initial rank for all members', 1, 1, 100, 100, 1),
('Constructor', 'constructor', 'Second rank with increased benefits', 1, 1, 150, 250, 2),
('Líder', 'lider', 'Leadership rank with higher commissions', 2, 2, 300, 500, 3),
('Ejecutivo', 'ejecutivo', 'Executive rank with significant benefits', 2, 2, 500, 800, 4),
('Director', 'director', 'Director rank with enhanced earning potential', 3, 3, 700, 1200, 5),
('Diamante', 'diamante', 'Diamond rank with premium benefits', 3, 3, 1000, 2000, 6),
('Doble Diamante', 'doble-diamante', 'Double Diamond rank with exclusive perks', 4, 4, 1500, 2500, 7),
('Corona', 'corona', 'Crown rank with maximum earning potential', 5, 5, 3000, 5000, 8),
('Doble Corona', 'doble-corona', 'Double Crown rank with elite benefits', 6, 6, 6000, 10000, 9),
('Embajador', 'embajador', 'Ambassador rank with prestigious rewards', 7, 7, 12000, 20000, 10),
('Embajador Corona', 'embajador-corona', 'Ambassador Crown rank with supreme benefits', 8, 8, 20000, 30000, 11),
('Imperial', 'imperial', 'Imperial rank with ultimate earning potential', 10, 10, 35000, 50000, 12),
('Imperial Nexus', 'imperial-nexus', 'Highest rank with maximum benefits', 12, 12, 70000, 70000, 13);

-- Insert initial system settings
INSERT INTO system_settings (key, value, type, description, is_public) VALUES
('site_name', 'Nexus AI', 'string', 'Site name', true),
('site_description', 'Academia de Inteligencia Artificial con Sistema MLM', 'string', 'Site description', true),
('initial_membership_fee', '89', 'number', 'Initial membership fee in USDT', false),
('monthly_membership_fee', '29', 'number', 'Monthly membership fee in USDT', false),
('fast_start_bonus_level1', '40', 'number', 'Fast start bonus percentage for level 1', false),
('fast_start_bonus_level2', '8', 'number', 'Fast start bonus percentage for level 2', false),
('binary_commission_rate', '0.50', 'number', 'Binary commission rate (50%)', false),
('matching_bonus_rate', '0.50', 'number', 'Matching bonus rate (50%)', false),
('withdrawal_fee_rate', '0.03', 'number', 'Withdrawal fee rate (3%)', false),
('minimum_withdrawal', '20', 'number', 'Minimum withdrawal amount in USDT', false),
('required_confirmations', '12', 'number', 'Required blockchain confirmations', false),
('email_from_address', 'noreply@nexusai.com', 'string', 'From email address', false),
('email_from_name', 'Nexus AI', 'string', 'From email name', false);

-- Create view for user summary
CREATE VIEW user_summary AS
SELECT 
    u.id,
    u.uuid,
    u.email,
    u.username,
    u.first_name,
    u.last_name,
    u.status,
    u.created_at,
    COALESCE(bp.left_volume, 0) as left_volume,
    COALESCE(bp.right_volume, 0) as right_volume,
    COALESCE(bp.left_carryover, 0) as left_carryover,
    COALESCE(bp.right_carryover, 0) as right_carryover,
    r.name as current_rank,
    r.slug as rank_slug,
    m.status as membership_status,
    m.expires_at as membership_expires_at,
    COALESCE(t.balance, 0) as balance,
    COALESCE(c.total_earnings, 0) as total_earnings,
    COALESCE(cp.completed_courses, 0) as completed_courses
FROM users u
LEFT JOIN binary_positions bp ON u.id = bp.user_id
LEFT JOIN user_ranks ur ON u.id = ur.user_id
LEFT JOIN ranks r ON ur.rank_id = r.id
LEFT JOIN memberships m ON u.id = m.user_id AND m.status = 'active'
LEFT JOIN (
    SELECT user_id, SUM(amount) as balance
    FROM (
        SELECT user_id, net_amount as amount
        FROM transactions
        WHERE type IN ('deposit', 'commission', 'bonus') AND status = 'completed'
        UNION ALL
        SELECT user_id, -net_amount as amount
        FROM transactions
        WHERE type = 'withdrawal' AND status = 'completed'
    ) as all_transactions
    GROUP BY user_id
) t ON u.id = t.user_id
LEFT JOIN (
    SELECT user_id, SUM(amount) as total_earnings
    FROM commissions
    GROUP BY user_id
) c ON u.id = c.user_id
LEFT JOIN (
    SELECT cp.user_id, COUNT(*) as completed_courses
    FROM content_progress cp
    WHERE cp.status = 'completed'
    GROUP BY cp.user_id
) cp ON u.id = cp.user_id
WHERE ur.achieved_at = (
    SELECT MAX(achieved_at)
    FROM user_ranks
    WHERE user_id = u.id
) OR ur.achieved_at IS NULL;