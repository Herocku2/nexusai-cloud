-- Migration 017: Add placement preference to user_profiles
-- Created: 2025-10-20
-- Purpose: Allow users to select preferred leg for new referrals

-- Add placement_preference column to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS placement_preference VARCHAR(10) DEFAULT 'auto' 
CHECK (placement_preference IN ('left', 'right', 'auto'));

-- Add wallet_address column if not exists
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS wallet_address VARCHAR(100);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_placement ON user_profiles(placement_preference);

-- Comments
COMMENT ON COLUMN user_profiles.placement_preference IS 'Preferred leg for placing new referrals: left, right, or auto';
COMMENT ON COLUMN user_profiles.wallet_address IS 'User USDT wallet address for withdrawals';
