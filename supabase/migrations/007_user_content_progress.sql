-- Create user content progress table
-- Tracks user progress on courses, videos, quizzes

CREATE TABLE IF NOT EXISTS user_content_progress (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_id BIGINT NOT NULL REFERENCES academy_content(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- Video tracking
    watch_time INTEGER DEFAULT 0, -- in seconds
    last_position INTEGER DEFAULT 0, -- resume position in seconds
    
    -- Quiz tracking
    quiz_attempts INTEGER DEFAULT 0,
    quiz_score DECIMAL(5, 2), -- percentage score
    quiz_answers JSONB, -- User answers
    
    -- Completion
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint: one progress record per user per content
    UNIQUE (user_id, content_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_content_progress_user ON user_content_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_content_progress_content ON user_content_progress(content_id);
CREATE INDEX IF NOT EXISTS idx_user_content_progress_status ON user_content_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_content_progress_completed ON user_content_progress(completed_at);

-- Trigger for updated_at
CREATE TRIGGER update_user_content_progress_updated_at
    BEFORE UPDATE ON user_content_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE user_content_progress IS 'Tracks user progress on courses, videos, quizzes';
COMMENT ON COLUMN user_content_progress.watch_time IS 'Total time spent watching video in seconds';
COMMENT ON COLUMN user_content_progress.last_position IS 'Resume position for videos in seconds';
COMMENT ON COLUMN user_content_progress.quiz_answers IS 'JSON array of user answers for quizzes';
