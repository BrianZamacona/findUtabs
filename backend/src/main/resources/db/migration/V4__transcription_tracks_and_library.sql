-- ============================================================
-- V4: Transcription Tracks, Library Tables, and Extended Fields
-- ============================================================

-- Add new columns to songs table
ALTER TABLE songs ADD COLUMN source_fingerprint VARCHAR(64) UNIQUE;
ALTER TABLE songs ADD COLUMN is_public BOOLEAN DEFAULT TRUE;
ALTER TABLE songs ADD COLUMN play_count INTEGER DEFAULT 0;

-- Add SOUNDCLOUD to source_type enum
ALTER TYPE source_type ADD VALUE IF NOT EXISTS 'SOUNDCLOUD';

-- Add new columns to transcriptions table
ALTER TABLE transcriptions ADD COLUMN bpm DECIMAL(6,2);
ALTER TABLE transcriptions ADD COLUMN time_signature VARCHAR(10) DEFAULT '4/4';
ALTER TABLE transcriptions ADD COLUMN musical_key VARCHAR(10);
ALTER TABLE transcriptions ADD COLUMN duration_ms INTEGER;
ALTER TABLE transcriptions ADD COLUMN transcription_type VARCHAR(20) DEFAULT 'AI_GENERATED';
ALTER TABLE transcriptions ADD COLUMN uploaded_file_id BIGINT;
ALTER TABLE transcriptions ADD COLUMN parent_transcription_id BIGINT REFERENCES transcriptions(id);

-- DMCA Reports table (referenced by uploaded_files and transcription_tracks)
CREATE TABLE dmca_reports (
    id BIGSERIAL PRIMARY KEY,
    reporter_name VARCHAR(255) NOT NULL,
    reporter_email VARCHAR(255) NOT NULL,
    reporter_company VARCHAR(255),
    content_url VARCHAR(1000) NOT NULL,
    original_work_description TEXT NOT NULL,
    ownership_statement TEXT NOT NULL,
    good_faith_statement BOOLEAN NOT NULL,
    accuracy_statement BOOLEAN NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
    actioned_at TIMESTAMP,
    actioned_by BIGINT REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Uploaded Files table
CREATE TABLE uploaded_files (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    processing_status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
    transcription_id BIGINT,
    error_message TEXT,
    is_dmca_removed BOOLEAN DEFAULT FALSE NOT NULL,
    dmca_report_id BIGINT REFERENCES dmca_reports(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Add FK constraint from transcriptions to uploaded_files
ALTER TABLE transcriptions ADD CONSTRAINT fk_transcriptions_uploaded_file
    FOREIGN KEY (uploaded_file_id) REFERENCES uploaded_files(id);

-- Add FK constraint from uploaded_files to transcriptions
ALTER TABLE uploaded_files ADD CONSTRAINT fk_uploaded_files_transcription
    FOREIGN KEY (transcription_id) REFERENCES transcriptions(id);

-- Transcription Tracks table
CREATE TABLE transcription_tracks (
    id BIGSERIAL PRIMARY KEY,
    transcription_id BIGINT NOT NULL REFERENCES transcriptions(id) ON DELETE CASCADE,
    track_type VARCHAR(30) NOT NULL,
    instrument_detail VARCHAR(255),
    tabs_data JSONB,
    staff_data JSONB,
    chords_data JSONB,
    lyrics_data JSONB,
    groove_data JSONB,
    sync_points JSONB,
    display_order INTEGER DEFAULT 0 NOT NULL,
    is_dmca_removed BOOLEAN DEFAULT FALSE NOT NULL,
    dmca_report_id BIGINT REFERENCES dmca_reports(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- User Songs (personal library)
CREATE TABLE user_songs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    song_id BIGINT NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    custom_name VARCHAR(255),
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE (user_id, song_id)
);

-- Transcription Votes
CREATE TABLE transcription_votes (
    id BIGSERIAL PRIMARY KEY,
    transcription_id BIGINT NOT NULL REFERENCES transcriptions(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE (transcription_id, user_id)
);

-- Indexes
CREATE INDEX idx_songs_source_fingerprint ON songs(source_fingerprint);
CREATE INDEX idx_songs_is_public ON songs(is_public);
CREATE INDEX idx_songs_play_count ON songs(play_count DESC);
CREATE INDEX idx_dmca_reports_status ON dmca_reports(status);
CREATE INDEX idx_uploaded_files_user_id ON uploaded_files(user_id);
CREATE INDEX idx_uploaded_files_processing_status ON uploaded_files(processing_status);
CREATE INDEX idx_uploaded_files_transcription_id ON uploaded_files(transcription_id);
CREATE INDEX idx_transcription_tracks_transcription_id ON transcription_tracks(transcription_id);
CREATE INDEX idx_transcription_tracks_track_type ON transcription_tracks(track_type);
CREATE INDEX idx_user_songs_user_id ON user_songs(user_id);
CREATE INDEX idx_user_songs_song_id ON user_songs(song_id);
CREATE INDEX idx_transcription_votes_transcription_id ON transcription_votes(transcription_id);
CREATE INDEX idx_transcription_votes_user_id ON transcription_votes(user_id);

-- Triggers for updated_at
CREATE TRIGGER update_uploaded_files_updated_at BEFORE UPDATE ON uploaded_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
