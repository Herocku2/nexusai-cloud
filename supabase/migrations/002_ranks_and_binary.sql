-- Migration 002: Ranks and Binary Positions
-- Created: 2025-10-17
-- Purpose: MLM ranks and binary tree structure

-- =======================
-- RANKS TABLE
-- =======================

CREATE TABLE IF NOT EXISTS ranks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    min_direct_left INTEGER NOT NULL DEFAULT 1,
    min_direct_right INTEGER NOT NULL DEFAULT 1,
    min_pv_leg DECIMAL(20, 8) NOT NULL DEFAULT 0,
    max_daily_earnings DECIMAL(20, 8),
    requirements JSONB,
    benefits JSONB,
    order_index INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ranks_order ON ranks(order_index);
CREATE INDEX IF NOT EXISTS idx_ranks_active ON ranks(is_active);

-- Trigger
CREATE TRIGGER update_ranks_updated_at
    BEFORE UPDATE ON ranks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert 13 ranks with compensation plan data
INSERT INTO ranks (name, slug, description, min_direct_left, min_direct_right, min_pv_leg, max_daily_earnings, order_index) VALUES
('Afiliado', 'afiliado', 'Rango inicial para todos los miembros', 1, 1, 100, 100, 1),
('Constructor', 'constructor', 'Segundo rango con beneficios incrementados', 1, 1, 150, 250, 2),
('Líder', 'lider', 'Rango de liderazgo con comisiones más altas', 2, 2, 300, 500, 3),
('Ejecutivo', 'ejecutivo', 'Rango ejecutivo con beneficios significativos', 2, 2, 500, 800, 4),
('Director', 'director', 'Rango de director con potencial de ganancias mejorado', 3, 3, 700, 1200, 5),
('Diamante', 'diamante', 'Rango diamante con beneficios premium', 3, 3, 1000, 2000, 6),
('Doble Diamante', 'doble-diamante', 'Doble diamante con ventajas exclusivas', 4, 4, 1500, 2500, 7),
('Corona', 'corona', 'Rango corona con máximo potencial de ganancias', 5, 5, 3000, 5000, 8),
('Doble Corona', 'doble-corona', 'Doble corona con beneficios élite', 6, 6, 6000, 10000, 9),
('Embajador', 'embajador', 'Rango embajador con recompensas prestigiosas', 7, 7, 12000, 20000, 10),
('Embajador Corona', 'embajador-corona', 'Embajador corona con beneficios supremos', 8, 8, 20000, 30000, 11),
('Imperial', 'imperial', 'Rango imperial con potencial de ganancias definitivo', 10, 10, 35000, 50000, 12),
('Imperial Nexus', 'imperial-nexus', 'Rango más alto con beneficios máximos', 12, 12, 70000, 70000, 13)
ON CONFLICT (slug) DO NOTHING;

-- =======================
-- BINARY POSITIONS TABLE
-- =======================

CREATE TABLE IF NOT EXISTS binary_positions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    sponsor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    parent_id BIGINT REFERENCES binary_positions(id) ON DELETE CASCADE,
    position_leg VARCHAR(5) NOT NULL CHECK (position_leg IN ('left', 'right')),
    left_child_id BIGINT REFERENCES binary_positions(id) ON DELETE SET NULL,
    right_child_id BIGINT REFERENCES binary_positions(id) ON DELETE SET NULL,
    left_volume DECIMAL(20, 8) DEFAULT 0 CHECK (left_volume >= 0),
    right_volume DECIMAL(20, 8) DEFAULT 0 CHECK (right_volume >= 0),
    left_carryover DECIMAL(20, 8) DEFAULT 0 CHECK (left_carryover >= 0),
    right_carryover DECIMAL(20, 8) DEFAULT 0 CHECK (right_carryover >= 0),
    level INTEGER NOT NULL DEFAULT 1 CHECK (level > 0),
    path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_binary_positions_user ON binary_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_binary_positions_sponsor ON binary_positions(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_binary_positions_parent ON binary_positions(parent_id);
CREATE INDEX IF NOT EXISTS idx_binary_positions_path ON binary_positions(path);
CREATE INDEX IF NOT EXISTS idx_binary_positions_level ON binary_positions(level);
CREATE INDEX IF NOT EXISTS idx_binary_positions_left_child ON binary_positions(left_child_id);
CREATE INDEX IF NOT EXISTS idx_binary_positions_right_child ON binary_positions(right_child_id);

-- Trigger
CREATE TRIGGER update_binary_positions_updated_at
    BEFORE UPDATE ON binary_positions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE ranks IS 'MLM compensation plan ranks (13 levels)';
COMMENT ON TABLE binary_positions IS 'Binary tree structure for MLM network';
COMMENT ON COLUMN binary_positions.position_leg IS 'Position relative to parent: left or right';
COMMENT ON COLUMN binary_positions.left_volume IS 'Total PV volume in left leg';
COMMENT ON COLUMN binary_positions.right_volume IS 'Total PV volume in right leg';
COMMENT ON COLUMN binary_positions.left_carryover IS 'Carry-over volume from left leg';
COMMENT ON COLUMN binary_positions.right_carryover IS 'Carry-over volume from right leg';
COMMENT ON COLUMN binary_positions.path IS 'Materialized path for tree traversal';

-- =======================
-- USER RANKS TABLE
-- =======================

CREATE TABLE IF NOT EXISTS user_ranks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rank_id BIGINT NOT NULL REFERENCES ranks(id) ON DELETE CASCADE,
    achieved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    total_earnings DECIMAL(20, 8) NOT NULL DEFAULT 0,
    total_pv DECIMAL(20, 8) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, rank_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_ranks_user ON user_ranks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ranks_rank ON user_ranks(rank_id);
CREATE INDEX IF NOT EXISTS idx_user_ranks_achieved ON user_ranks(achieved_at);

-- Trigger
CREATE TRIGGER update_user_ranks_updated_at
    BEFORE UPDATE ON user_ranks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE user_ranks IS 'History of rank achievements for each user';
