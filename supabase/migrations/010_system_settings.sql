-- Create system settings table
-- Stores configurable system settings

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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_settings_key ON system_settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_public ON system_settings(is_public);

-- Trigger for updated_at
CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed initial settings
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

-- Comments
COMMENT ON TABLE system_settings IS 'Configurable system settings and constants';
COMMENT ON COLUMN system_settings.is_public IS 'Whether this setting can be accessed by clients';
