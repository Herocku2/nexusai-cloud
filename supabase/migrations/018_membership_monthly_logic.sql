-- Migration 018: Membership Monthly Logic and Withdrawal Restrictions
-- Created: 2025-10-20
-- Purpose: Implement monthly membership renewals and withdrawal restrictions

-- ============================================
-- STEP 1: Add is_active flag to user_profiles
-- ============================================

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT FALSE;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);

COMMENT ON COLUMN user_profiles.is_active IS 'User is active only if they have a valid membership (initial + active monthly)';

-- ============================================
-- STEP 2: Function to check if user has active membership
-- ============================================

CREATE OR REPLACE FUNCTION has_active_membership(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_has_initial BOOLEAN;
    v_has_active_monthly BOOLEAN;
BEGIN
    -- Check if user has completed initial membership ($89)
    SELECT EXISTS(
        SELECT 1 
        FROM memberships 
        WHERE user_id = p_user_id 
          AND type = 'initial' 
          AND status = 'active'
    ) INTO v_has_initial;

    -- Check if user has an active monthly membership ($29) that hasn't expired
    SELECT EXISTS(
        SELECT 1 
        FROM memberships 
        WHERE user_id = p_user_id 
          AND type = 'monthly' 
          AND status = 'active'
          AND expires_at > NOW()
    ) INTO v_has_active_monthly;

    -- User is active if they have both initial AND active monthly
    RETURN v_has_initial AND v_has_active_monthly;
END;
$$;

COMMENT ON FUNCTION has_active_membership IS 'Returns TRUE if user has initial membership AND active monthly membership';

-- ============================================
-- STEP 3: Function to update user active status
-- ============================================

CREATE OR REPLACE FUNCTION update_user_active_status(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE user_profiles
    SET is_active = has_active_membership(p_user_id)
    WHERE id = p_user_id;
END;
$$;

COMMENT ON FUNCTION update_user_active_status IS 'Updates user_profiles.is_active based on membership status';

-- ============================================
-- STEP 4: Trigger to auto-update active status when membership changes
-- ============================================

CREATE OR REPLACE FUNCTION trigger_update_user_active_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update active status for the affected user
    PERFORM update_user_active_status(NEW.user_id);
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS memberships_update_active_status ON memberships;

CREATE TRIGGER memberships_update_active_status
    AFTER INSERT OR UPDATE ON memberships
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_user_active_status();

COMMENT ON TRIGGER memberships_update_active_status ON memberships IS 'Auto-updates user is_active status when membership changes';

-- ============================================
-- STEP 5: Function to check expired memberships
-- ============================================

CREATE OR REPLACE FUNCTION check_expired_memberships()
RETURNS TABLE(user_id UUID, email TEXT, expires_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.user_id,
        u.email,
        m.expires_at
    FROM memberships m
    JOIN auth.users u ON u.id = m.user_id
    WHERE m.type = 'monthly'
      AND m.status = 'active'
      AND m.expires_at < NOW()
    ORDER BY m.expires_at ASC;
END;
$$;

COMMENT ON FUNCTION check_expired_memberships IS 'Returns all users with expired monthly memberships';

-- ============================================
-- STEP 6: Function to get memberships expiring soon (for reminders)
-- ============================================

CREATE OR REPLACE FUNCTION get_memberships_expiring_soon(days_ahead INTEGER DEFAULT 3)
RETURNS TABLE(
    user_id UUID, 
    email TEXT, 
    first_name VARCHAR, 
    last_name VARCHAR,
    expires_at TIMESTAMPTZ,
    days_remaining INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.user_id,
        u.email,
        up.first_name,
        up.last_name,
        m.expires_at,
        EXTRACT(DAY FROM (m.expires_at - NOW()))::INTEGER as days_remaining
    FROM memberships m
    JOIN auth.users u ON u.id = m.user_id
    JOIN user_profiles up ON up.id = m.user_id
    WHERE m.type = 'monthly'
      AND m.status = 'active'
      AND m.expires_at > NOW()
      AND m.expires_at <= (NOW() + INTERVAL '1 day' * days_ahead)
    ORDER BY m.expires_at ASC;
END;
$$;

COMMENT ON FUNCTION get_memberships_expiring_soon IS 'Returns users whose memberships are expiring in the next N days (default 3)';

-- ============================================
-- STEP 7: Function to renew monthly membership
-- ============================================

CREATE OR REPLACE FUNCTION renew_monthly_membership(
    p_user_id UUID,
    p_transaction_id BIGINT DEFAULT NULL
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_membership_id BIGINT;
    v_current_expires_at TIMESTAMPTZ;
    v_new_starts_at TIMESTAMPTZ;
    v_new_expires_at TIMESTAMPTZ;
BEGIN
    -- Get current membership expiration
    SELECT expires_at INTO v_current_expires_at
    FROM memberships
    WHERE user_id = p_user_id
      AND type = 'monthly'
      AND status = 'active'
    ORDER BY expires_at DESC
    LIMIT 1;

    -- If exists and not expired, extend from current expiration
    -- Otherwise, start from now
    IF v_current_expires_at IS NOT NULL AND v_current_expires_at > NOW() THEN
        v_new_starts_at := v_current_expires_at;
    ELSE
        v_new_starts_at := NOW();
    END IF;

    v_new_expires_at := v_new_starts_at + INTERVAL '30 days';

    -- Insert new monthly membership
    INSERT INTO memberships (
        user_id,
        type,
        amount,
        currency,
        pv_value,
        status,
        starts_at,
        expires_at,
        transaction_id
    ) VALUES (
        p_user_id,
        'monthly',
        29.00,
        'USDT',
        29.00, -- 29 PV for monthly
        'active',
        v_new_starts_at,
        v_new_expires_at,
        p_transaction_id
    )
    RETURNING id INTO v_membership_id;

    -- Update user active status
    PERFORM update_user_active_status(p_user_id);

    RETURN v_membership_id;
END;
$$;

COMMENT ON FUNCTION renew_monthly_membership IS 'Creates a new monthly membership extending from current expiration or now for $29 USD (29 PV)';

-- ============================================
-- STEP 8: Update active status for all existing users
-- ============================================

DO $$
DECLARE
    v_user_id UUID;
BEGIN
    FOR v_user_id IN (SELECT DISTINCT id FROM user_profiles)
    LOOP
        PERFORM update_user_active_status(v_user_id);
    END LOOP;
END;
$$;
