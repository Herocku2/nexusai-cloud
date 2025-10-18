-- Create memberships table
-- Tracks initial ($89) and monthly ($29) membership payments

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

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);
CREATE INDEX IF NOT EXISTS idx_memberships_expires ON memberships(expires_at);
CREATE INDEX IF NOT EXISTS idx_memberships_type ON memberships(type);

-- Trigger for updated_at
CREATE TRIGGER update_memberships_updated_at
    BEFORE UPDATE ON memberships
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE memberships IS 'User membership subscriptions - initial ($89) and monthly ($29)';
COMMENT ON COLUMN memberships.pv_value IS 'Point Value - 89 PV for initial, 29 PV for monthly';
COMMENT ON COLUMN memberships.expires_at IS 'Expiration date - monthly memberships need renewal';
