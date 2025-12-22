CREATE INDEX idx_tabs_artist ON tabs(artist);
CREATE INDEX idx_tabs_title ON tabs(title);
CREATE INDEX idx_tabs_user_id ON tabs(user_id);
CREATE INDEX idx_tabs_created_at ON tabs(created_at DESC);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
