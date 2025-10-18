-- Migration 001: User Profiles Table
-- Created: 2025-10-17
-- Purpose: Extend auth.users with additional profile data

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

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_sponsor ON user_profiles(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

-- Trigger for updated_at
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

-- Comments
COMMENT ON TABLE user_profiles IS 'Extended user profile data for MLM system';
COMMENT ON COLUMN user_profiles.sponsor_id IS 'User who referred this user';
COMMENT ON COLUMN user_profiles.status IS 'Account status: pending, active, inactive, suspended';
COMMENT ON COLUMN user_profiles.balance IS 'Current USDT balance';
COMMENT ON COLUMN user_profiles.total_earnings IS 'Lifetime earnings from commissions';
COMMENT ON COLUMN user_profiles.total_pv IS 'Total accumulated PV';
