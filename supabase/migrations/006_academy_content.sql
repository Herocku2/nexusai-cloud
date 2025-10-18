-- Create academy content tables
-- Stores courses, videos, documents, quizzes, and Zoom meetings

CREATE TABLE IF NOT EXISTS academy_content (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('video', 'document', 'quiz', 'zoom_meeting', 'article')),
    
    -- Content location
    url VARCHAR(500),
    file_path VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    thumbnail_url VARCHAR(500),
    
    -- Video specific
    duration INTEGER, -- in seconds
    
    -- Additional data
    content_data JSONB, -- Quiz questions, meeting details, etc.
    
    -- Access control
    required_rank_id BIGINT REFERENCES ranks(id),
    is_free BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Organization
    category VARCHAR(100),
    tags TEXT[],
    order_index INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_academy_content_type ON academy_content(type);
CREATE INDEX IF NOT EXISTS idx_academy_content_rank ON academy_content(required_rank_id);
CREATE INDEX IF NOT EXISTS idx_academy_content_active ON academy_content(is_active);
CREATE INDEX IF NOT EXISTS idx_academy_content_order ON academy_content(order_index);
CREATE INDEX IF NOT EXISTS idx_academy_content_category ON academy_content(category);
CREATE INDEX IF NOT EXISTS idx_academy_content_slug ON academy_content(slug);

-- Trigger for updated_at
CREATE TRIGGER update_academy_content_updated_at
    BEFORE UPDATE ON academy_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE academy_content IS 'Educational content - videos, documents, quizzes, Zoom meetings';
COMMENT ON COLUMN academy_content.content_data IS 'JSON data: quiz questions, Zoom meeting links, article HTML, etc.';
COMMENT ON COLUMN academy_content.required_rank_id IS 'Minimum rank required to access this content';
COMMENT ON COLUMN academy_content.duration IS 'Video duration in seconds';
COMMENT ON COLUMN academy_content.tags IS 'Array of tags for filtering and search';
