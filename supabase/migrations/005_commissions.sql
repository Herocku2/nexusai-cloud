-- Create commissions table
-- Tracks all types of commissions: Fast Start, Binary, Matching

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
    
    -- Binary commission specific
    left_leg_volume DECIMAL(20, 8),
    right_leg_volume DECIMAL(20, 8),
    weaker_leg_volume DECIMAL(20, 8),
    
    -- Capping data
    daily_cap DECIMAL(20, 8),
    capped_amount DECIMAL(20, 8),
    
    cycle_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_commissions_user ON commissions(user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_type ON commissions(type);
CREATE INDEX IF NOT EXISTS idx_commissions_cycle ON commissions(cycle_date);
CREATE INDEX IF NOT EXISTS idx_commissions_source ON commissions(source_user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_created_at ON commissions(created_at);

-- Trigger for updated_at
CREATE TRIGGER update_commissions_updated_at
    BEFORE UPDATE ON commissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE commissions IS 'All commission records - Fast Start ($40 L1, $8 L2), Binary (50% weaker leg), Matching (50% of directs binary)';
COMMENT ON COLUMN commissions.source_user_id IS 'User who generated this commission (e.g., the person who bought membership or generated volume)';
COMMENT ON COLUMN commissions.level IS 'Level for matching bonus (1-5 levels deep based on rank)';
COMMENT ON COLUMN commissions.weaker_leg_volume IS 'Volume of the weaker leg for binary commission calculation';
COMMENT ON COLUMN commissions.daily_cap IS 'Daily earning cap based on user rank';
COMMENT ON COLUMN commissions.capped_amount IS 'Amount that was capped due to daily limit';
