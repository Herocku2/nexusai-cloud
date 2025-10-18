-- Create notifications table
-- Stores in-app and email notifications for users

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    
    -- Read status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Email status
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- Comments
COMMENT ON TABLE notifications IS 'User notifications - in-app and email';
COMMENT ON COLUMN notifications.type IS 'Notification type: commission_earned, rank_advanced, new_referral, etc.';
COMMENT ON COLUMN notifications.data IS 'Additional JSON data related to notification';
