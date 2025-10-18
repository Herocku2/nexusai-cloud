-- PostgreSQL Functions for Binary Tree Calculations
-- These functions handle complex MLM calculations efficiently

-- ============================================================================
-- 1. Get Binary Downline (Recursive CTE)
-- ============================================================================
-- Returns all users in the downline of a given user

CREATE OR REPLACE FUNCTION get_binary_downline(root_user_id UUID, max_depth INTEGER DEFAULT NULL)
RETURNS TABLE (
    user_id UUID,
    parent_id BIGINT,
    position_leg VARCHAR,
    level INTEGER,
    left_volume DECIMAL,
    right_volume DECIMAL,
    path TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE downline AS (
        -- Base case: root user
        SELECT 
            bp.user_id,
            bp.parent_id,
            bp.position_leg,
            bp.level,
            bp.left_volume,
            bp.right_volume,
            bp.path
        FROM binary_positions bp
        WHERE bp.user_id = root_user_id
        
        UNION ALL
        
        -- Recursive case: children
        SELECT 
            bp.user_id,
            bp.parent_id,
            bp.position_leg,
            bp.level,
            bp.left_volume,
            bp.right_volume,
            bp.path
        FROM binary_positions bp
        INNER JOIN downline d ON bp.parent_id = (
            SELECT id FROM binary_positions WHERE user_id = d.user_id
        )
        WHERE max_depth IS NULL OR bp.level <= max_depth
    )
    SELECT * FROM downline;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 2. Calculate Total Volume for a Leg
-- ============================================================================
-- Calculates total PV volume in left or right leg

CREATE OR REPLACE FUNCTION calculate_leg_volume(
    root_user_id UUID, 
    leg VARCHAR -- 'left' or 'right'
)
RETURNS DECIMAL(20, 8) AS $$
DECLARE
    total_volume DECIMAL(20, 8);
    root_position_id BIGINT;
    child_id BIGINT;
BEGIN
    -- Get root position ID
    SELECT id INTO root_position_id 
    FROM binary_positions 
    WHERE user_id = root_user_id;
    
    IF root_position_id IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Get child ID based on leg
    IF leg = 'left' THEN
        SELECT left_child_id INTO child_id 
        FROM binary_positions 
        WHERE id = root_position_id;
    ELSE
        SELECT right_child_id INTO child_id 
        FROM binary_positions 
        WHERE id = root_position_id;
    END IF;
    
    IF child_id IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Calculate total volume recursively
    WITH RECURSIVE volume_tree AS (
        -- Base case: direct child
        SELECT 
            id,
            left_child_id,
            right_child_id,
            left_volume + right_volume AS volume
        FROM binary_positions
        WHERE id = child_id
        
        UNION ALL
        
        -- Recursive case: all descendants
        SELECT 
            bp.id,
            bp.left_child_id,
            bp.right_child_id,
            bp.left_volume + bp.right_volume AS volume
        FROM binary_positions bp
        INNER JOIN volume_tree vt ON bp.parent_id = vt.id
    )
    SELECT COALESCE(SUM(volume), 0) INTO total_volume FROM volume_tree;
    
    RETURN total_volume;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. Update Binary Volumes (Propagate upwards)
-- ============================================================================
-- Updates volume for a user and propagates up the tree

CREATE OR REPLACE FUNCTION update_binary_volumes(
    affected_user_id UUID,
    new_pv DECIMAL(20, 8)
)
RETURNS VOID AS $$
DECLARE
    current_position_id BIGINT;
    current_parent_id BIGINT;
    current_leg VARCHAR;
BEGIN
    -- Get current position
    SELECT id, parent_id, position_leg 
    INTO current_position_id, current_parent_id, current_leg
    FROM binary_positions
    WHERE user_id = affected_user_id;
    
    -- Propagate volume up the tree
    WHILE current_parent_id IS NOT NULL LOOP
        IF current_leg = 'left' THEN
            UPDATE binary_positions
            SET left_volume = left_volume + new_pv,
                updated_at = NOW()
            WHERE id = current_parent_id;
        ELSE
            UPDATE binary_positions
            SET right_volume = right_volume + new_pv,
                updated_at = NOW()
            WHERE id = current_parent_id;
        END IF;
        
        -- Move up to next parent
        SELECT parent_id, position_leg 
        INTO current_parent_id, current_leg
        FROM binary_positions
        WHERE id = current_parent_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 4. Calculate Binary Commission for User
-- ============================================================================
-- Calculates binary commission based on weaker leg with daily cap

CREATE OR REPLACE FUNCTION calculate_binary_commission(
    target_user_id UUID,
    commission_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    user_id UUID,
    left_volume DECIMAL,
    right_volume DECIMAL,
    weaker_leg_volume DECIMAL,
    commission_amount DECIMAL,
    daily_cap DECIMAL,
    capped_amount DECIMAL,
    carry_over_left DECIMAL,
    carry_over_right DECIMAL
) AS $$
DECLARE
    user_left_volume DECIMAL(20, 8);
    user_right_volume DECIMAL(20, 8);
    user_left_carryover DECIMAL(20, 8);
    user_right_carryover DECIMAL(20, 8);
    weaker_leg DECIMAL(20, 8);
    stronger_leg DECIMAL(20, 8);
    commission DECIMAL(20, 8);
    user_daily_cap DECIMAL(20, 8);
    capped DECIMAL(20, 8);
    new_carry_left DECIMAL(20, 8);
    new_carry_right DECIMAL(20, 8);
    user_rank_id BIGINT;
BEGIN
    -- Get user volumes and carryover
    SELECT 
        bp.left_volume, 
        bp.right_volume,
        bp.left_carryover,
        bp.right_carryover
    INTO 
        user_left_volume, 
        user_right_volume,
        user_left_carryover,
        user_right_carryover
    FROM binary_positions bp
    WHERE bp.user_id = target_user_id;
    
    -- Add carryover to current volumes
    user_left_volume := user_left_volume + user_left_carryover;
    user_right_volume := user_right_volume + user_right_carryover;
    
    -- Calculate weaker and stronger legs
    IF user_left_volume < user_right_volume THEN
        weaker_leg := user_left_volume;
        stronger_leg := user_right_volume;
    ELSE
        weaker_leg := user_right_volume;
        stronger_leg := user_left_volume;
    END IF;
    
    -- Calculate commission (50% of weaker leg)
    commission := weaker_leg * 0.50;
    
    -- Get user's daily cap based on rank
    SELECT ur.rank_id INTO user_rank_id
    FROM user_ranks ur
    WHERE ur.user_id = target_user_id
    ORDER BY ur.achieved_at DESC
    LIMIT 1;
    
    SELECT max_daily_earnings INTO user_daily_cap
    FROM ranks
    WHERE id = COALESCE(user_rank_id, 1); -- Default to rank 1 if no rank
    
    -- Apply daily cap
    IF commission > user_daily_cap THEN
        capped := commission - user_daily_cap;
        commission := user_daily_cap;
    ELSE
        capped := 0;
    END IF;
    
    -- Calculate new carryover (unlimited on stronger leg)
    IF user_left_volume < user_right_volume THEN
        new_carry_left := 0; -- Weaker leg is cleared
        new_carry_right := stronger_leg - weaker_leg; -- Difference goes to carryover
    ELSE
        new_carry_left := stronger_leg - weaker_leg;
        new_carry_right := 0;
    END IF;
    
    -- Update carryover in database
    UPDATE binary_positions
    SET 
        left_carryover = new_carry_left,
        right_carryover = new_carry_right,
        left_volume = 0, -- Reset daily volume
        right_volume = 0,
        updated_at = NOW()
    WHERE binary_positions.user_id = target_user_id;
    
    -- Return results
    RETURN QUERY SELECT 
        target_user_id,
        user_left_volume,
        user_right_volume,
        weaker_leg,
        commission,
        user_daily_cap,
        capped,
        new_carry_left,
        new_carry_right;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. Get Direct Referrals Count
-- ============================================================================
-- Returns count of direct referrals on left and right legs

CREATE OR REPLACE FUNCTION get_direct_referrals_count(target_user_id UUID)
RETURNS TABLE (
    left_count INTEGER,
    right_count INTEGER
) AS $$
DECLARE
    position_id BIGINT;
    left_cnt INTEGER;
    right_cnt INTEGER;
BEGIN
    -- Get user's position ID
    SELECT id INTO position_id
    FROM binary_positions
    WHERE user_id = target_user_id;
    
    -- Count left leg directs
    SELECT COUNT(*) INTO left_cnt
    FROM binary_positions
    WHERE parent_id = position_id AND position_leg = 'left';
    
    -- Count right leg directs
    SELECT COUNT(*) INTO right_cnt
    FROM binary_positions
    WHERE parent_id = position_id AND position_leg = 'right';
    
    RETURN QUERY SELECT left_cnt, right_cnt;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. Find Next Available Position (Auto-placement)
-- ============================================================================
-- Finds the next available position in the binary tree

CREATE OR REPLACE FUNCTION find_next_available_position(
    sponsor_user_id UUID,
    preferred_leg VARCHAR DEFAULT NULL -- 'left' or 'right'
)
RETURNS TABLE (
    parent_user_id UUID,
    parent_position_id BIGINT,
    available_leg VARCHAR,
    level INTEGER
) AS $$
DECLARE
    sponsor_position_id BIGINT;
    target_parent_id BIGINT;
    target_leg VARCHAR;
    target_level INTEGER;
BEGIN
    -- Get sponsor's position
    SELECT id INTO sponsor_position_id
    FROM binary_positions
    WHERE user_id = sponsor_user_id;
    
    IF sponsor_position_id IS NULL THEN
        RAISE EXCEPTION 'Sponsor user not found in binary tree';
    END IF;
    
    -- Check if sponsor has space
    IF preferred_leg = 'left' THEN
        SELECT left_child_id INTO target_parent_id
        FROM binary_positions WHERE id = sponsor_position_id;
        
        IF target_parent_id IS NULL THEN
            RETURN QUERY SELECT sponsor_user_id, sponsor_position_id, 'left'::VARCHAR, 2;
            RETURN;
        END IF;
    ELSIF preferred_leg = 'right' THEN
        SELECT right_child_id INTO target_parent_id
        FROM binary_positions WHERE id = sponsor_position_id;
        
        IF target_parent_id IS NULL THEN
            RETURN QUERY SELECT sponsor_user_id, sponsor_position_id, 'right'::VARCHAR, 2;
            RETURN;
        END IF;
    END IF;
    
    -- Find first available position using breadth-first search
    WITH RECURSIVE available_positions AS (
        SELECT 
            id,
            user_id,
            left_child_id,
            right_child_id,
            level
        FROM binary_positions
        WHERE id = sponsor_position_id
        
        UNION ALL
        
        SELECT 
            bp.id,
            bp.user_id,
            bp.left_child_id,
            bp.right_child_id,
            bp.level
        FROM binary_positions bp
        INNER JOIN available_positions ap ON 
            bp.parent_id = ap.id
    )
    SELECT 
        ap.user_id,
        ap.id,
        CASE 
            WHEN ap.left_child_id IS NULL THEN 'left'
            WHEN ap.right_child_id IS NULL THEN 'right'
        END,
        ap.level + 1
    INTO parent_user_id, parent_position_id, available_leg, level
    FROM available_positions ap
    WHERE ap.left_child_id IS NULL OR ap.right_child_id IS NULL
    ORDER BY ap.level, ap.id
    LIMIT 1;
    
    RETURN QUERY SELECT parent_user_id, parent_position_id, available_leg, level;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON FUNCTION get_binary_downline IS 'Returns all users in downline using recursive CTE';
COMMENT ON FUNCTION calculate_leg_volume IS 'Calculates total PV volume in left or right leg';
COMMENT ON FUNCTION update_binary_volumes IS 'Updates volume for user and propagates up the tree';
COMMENT ON FUNCTION calculate_binary_commission IS 'Calculates binary commission with capping and carryover';
COMMENT ON FUNCTION get_direct_referrals_count IS 'Returns count of direct referrals on each leg';
COMMENT ON FUNCTION find_next_available_position IS 'Finds next available position for auto-placement';
