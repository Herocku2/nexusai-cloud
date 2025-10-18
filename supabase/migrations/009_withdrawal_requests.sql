-- Create withdrawal requests table
-- Tracks user withdrawal requests with 3% fee

CREATE TABLE IF NOT EXISTS withdrawal_requests (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(20, 8) NOT NULL CHECK (amount >= 20), -- Minimum $20 USDT
    fee DECIMAL(20, 8) GENERATED ALWAYS AS (amount * 0.03) STORED, -- 3% fee
    net_amount DECIMAL(20, 8) GENERATED ALWAYS AS (amount - (amount * 0.03)) STORED,
    currency VARCHAR(10) DEFAULT 'USDT',
    
    -- Destination
    destination_address VARCHAR(255) NOT NULL,
    network VARCHAR(50) DEFAULT 'TRC20', -- TRC20, ERC20, BEP20
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected', 'cancelled')),
    
    -- Blockchain
    blockchain_tx_hash VARCHAR(255),
    
    -- Notes
    notes TEXT,
    admin_notes TEXT,
    rejection_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_withdrawal_user ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_status ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_created ON withdrawal_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_withdrawal_uuid ON withdrawal_requests(uuid);

-- Trigger for updated_at
CREATE TRIGGER update_withdrawal_requests_updated_at
    BEFORE UPDATE ON withdrawal_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE withdrawal_requests IS 'User withdrawal requests - minimum $20 USDT, 3% fee';
COMMENT ON COLUMN withdrawal_requests.fee IS 'Calculated field: amount * 0.03 (3% fee)';
COMMENT ON COLUMN withdrawal_requests.net_amount IS 'Calculated field: amount - fee';
COMMENT ON COLUMN withdrawal_requests.network IS 'Blockchain network: TRC20 (TRON), ERC20 (Ethereum), BEP20 (BSC)';
