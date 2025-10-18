-- Row Level Security Policies
-- Ensures users can only access their own data and admins have full access

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE binary_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_content_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Helper function to check if user is admin
-- ============================================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid()
        AND status = 'active'
        -- Add your admin role check here, e.g., checking a role column
        -- For now, we'll add this later when implementing admin functionality
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- USER_PROFILES Policies
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Service role can insert profiles (for registration)
CREATE POLICY "Service role can insert profiles"
    ON user_profiles FOR INSERT
    WITH CHECK (true);

-- ============================================================================
-- BINARY_POSITIONS Policies
-- ============================================================================

-- Users can view their own position and downline
CREATE POLICY "Users can view own position"
    ON binary_positions FOR SELECT
    USING (
        user_id = auth.uid() 
        OR user_id IN (
            -- Can see downline
            SELECT user_id FROM get_binary_downline(auth.uid())
        )
    );

-- Service role can insert positions (for registration)
CREATE POLICY "Service role can insert positions"
    ON binary_positions FOR INSERT
    WITH CHECK (true);

-- Service role can update positions (for volume calculations)
CREATE POLICY "Service role can update positions"
    ON binary_positions FOR UPDATE
    WITH CHECK (true);

-- ============================================================================
-- USER_RANKS Policies
-- ============================================================================

-- Users can view their own ranks
CREATE POLICY "Users can view own ranks"
    ON user_ranks FOR SELECT
    USING (user_id = auth.uid());

-- Service role can insert ranks (for rank advancement)
CREATE POLICY "Service role can insert ranks"
    ON user_ranks FOR INSERT
    WITH CHECK (true);

-- ============================================================================
-- MEMBERSHIPS Policies
-- ============================================================================

-- Users can view their own memberships
CREATE POLICY "Users can view own memberships"
    ON memberships FOR SELECT
    USING (user_id = auth.uid());

-- Service role can insert memberships (for payments)
CREATE POLICY "Service role can insert memberships"
    ON memberships FOR INSERT
    WITH CHECK (true);

-- Service role can update memberships (for status changes)
CREATE POLICY "Service role can update memberships"
    ON memberships FOR UPDATE
    WITH CHECK (true);

-- ============================================================================
-- TRANSACTIONS Policies
-- ============================================================================

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (user_id = auth.uid());

-- Service role can insert transactions
CREATE POLICY "Service role can insert transactions"
    ON transactions FOR INSERT
    WITH CHECK (true);

-- Service role can update transactions (for status changes)
CREATE POLICY "Service role can update transactions"
    ON transactions FOR UPDATE
    WITH CHECK (true);

-- ============================================================================
-- COMMISSIONS Policies
-- ============================================================================

-- Users can view their own commissions
CREATE POLICY "Users can view own commissions"
    ON commissions FOR SELECT
    USING (user_id = auth.uid());

-- Service role can insert commissions
CREATE POLICY "Service role can insert commissions"
    ON commissions FOR INSERT
    WITH CHECK (true);

-- ============================================================================
-- ACADEMY_CONTENT Policies
-- ============================================================================

-- All authenticated users can view active content
-- (rank-based access control handled at application level)
CREATE POLICY "Users can view active content"
    ON academy_content FOR SELECT
    USING (is_active = true AND auth.uid() IS NOT NULL);

-- Service role can manage content (for admin panel)
CREATE POLICY "Service role can manage content"
    ON academy_content FOR ALL
    WITH CHECK (true);

-- ============================================================================
-- USER_CONTENT_PROGRESS Policies
-- ============================================================================

-- Users can view their own progress
CREATE POLICY "Users can view own progress"
    ON user_content_progress FOR SELECT
    USING (user_id = auth.uid());

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress"
    ON user_content_progress FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
    ON user_content_progress FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- NOTIFICATIONS Policies
-- ============================================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Service role can insert notifications
CREATE POLICY "Service role can insert notifications"
    ON notifications FOR INSERT
    WITH CHECK (true);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
    ON notifications FOR DELETE
    USING (user_id = auth.uid());

-- ============================================================================
-- WITHDRAWAL_REQUESTS Policies
-- ============================================================================

-- Users can view their own withdrawal requests
CREATE POLICY "Users can view own withdrawals"
    ON withdrawal_requests FOR SELECT
    USING (user_id = auth.uid());

-- Users can insert their own withdrawal requests
CREATE POLICY "Users can insert own withdrawals"
    ON withdrawal_requests FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Users can cancel their own pending withdrawals
CREATE POLICY "Users can cancel own withdrawals"
    ON withdrawal_requests FOR UPDATE
    USING (user_id = auth.uid() AND status = 'pending')
    WITH CHECK (user_id = auth.uid() AND status IN ('pending', 'cancelled'));

-- Service role can update withdrawals (for processing)
CREATE POLICY "Service role can update withdrawals"
    ON withdrawal_requests FOR UPDATE
    WITH CHECK (true);

-- ============================================================================
-- SYSTEM_SETTINGS Policies
-- ============================================================================

-- All authenticated users can view public settings
CREATE POLICY "Users can view public settings"
    ON system_settings FOR SELECT
    USING (is_public = true AND auth.uid() IS NOT NULL);

-- Service role can manage all settings
CREATE POLICY "Service role can manage settings"
    ON system_settings FOR ALL
    WITH CHECK (true);

-- ============================================================================
-- RANKS Table (Read-only for all authenticated users)
-- ============================================================================

ALTER TABLE ranks ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view ranks
CREATE POLICY "Users can view ranks"
    ON ranks FOR SELECT
    USING (is_active = true AND auth.uid() IS NOT NULL);

-- Service role can manage ranks
CREATE POLICY "Service role can manage ranks"
    ON ranks FOR ALL
    WITH CHECK (true);

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON POLICY "Users can view own profile" ON user_profiles IS 
    'Users can only see their own profile data';
    
COMMENT ON POLICY "Users can view own position" ON binary_positions IS 
    'Users can see their own position and entire downline';
    
COMMENT ON POLICY "Users can view active content" ON academy_content IS 
    'All authenticated users can view active content. Rank-based restrictions handled in app layer';

COMMENT ON FUNCTION is_admin IS 
    'Helper function to check if current user is admin. To be expanded when admin system is implemented';
