ALTER TABLE tabs ADD COLUMN IF NOT EXISTS alpha_tex_data TEXT;

CREATE TABLE IF NOT EXISTS tab_versions (
    id BIGSERIAL PRIMARY KEY,
    tab_id BIGINT NOT NULL REFERENCES tabs(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    alpha_tex_data TEXT,
    change_notes VARCHAR(500),
    created_by BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS tab_ratings (
    id BIGSERIAL PRIMARY KEY,
    tab_id BIGINT NOT NULL REFERENCES tabs(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(tab_id, user_id)
);

CREATE TABLE IF NOT EXISTS user_favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tab_id BIGINT NOT NULL REFERENCES tabs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(user_id, tab_id)
);

CREATE INDEX IF NOT EXISTS idx_tab_versions_tab_id ON tab_versions(tab_id);
CREATE INDEX IF NOT EXISTS idx_tab_ratings_tab_id ON tab_ratings(tab_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_tab_id ON user_favorites(tab_id);

CREATE TRIGGER update_tab_ratings_updated_at BEFORE UPDATE ON tab_ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
