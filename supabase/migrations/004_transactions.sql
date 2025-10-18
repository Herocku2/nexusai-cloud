-- Create transactions table
-- Tracks all financial movements: deposits, withdrawals, commissions, fees

CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'commission', 'bonus', 'fee', 'membership')),
    subtype VARCHAR(50), -- fast_start, binary, matching, initial_membership, monthly_membership
    amount DECIMAL(20, 8) NOT NULL CHECK (amount >= 0),
    fee DECIMAL(20, 8) DEFAULT 0 CHECK (fee >= 0),
    net_amount DECIMAL(20, 8) GENERATED ALWAYS AS (amount - fee) STORED,
    currency VARCHAR(10) DEFAULT 'USDT',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    
    -- Blockchain data
    blockchain_tx_hash VARCHAR(255),
    from_address VARCHAR(255),
    to_address VARCHAR(255),
    block_number BIGINT,
    confirmations INTEGER DEFAULT 0,
    required_confirmations INTEGER DEFAULT 12,
    
    -- Additional data
    metadata JSONB,
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_blockchain ON transactions(blockchain_tx_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_uuid ON transactions(uuid);

-- Trigger for updated_at
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE transactions IS 'All financial transactions - deposits, withdrawals, commissions, fees';
COMMENT ON COLUMN transactions.net_amount IS 'Calculated field: amount - fee';
COMMENT ON COLUMN transactions.confirmations IS 'Blockchain confirmations for deposits (requires 12)';
COMMENT ON COLUMN transactions.metadata IS 'Additional JSON data: payment gateway info, reference IDs, etc.';
