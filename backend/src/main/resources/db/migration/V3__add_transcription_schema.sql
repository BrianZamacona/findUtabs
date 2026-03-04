-- Enum type para el tipo de fuente de la canción
CREATE TYPE source_type AS ENUM ('YOUTUBE', 'SPOTIFY', 'TIDAL', 'FILE_UPLOAD', 'URL');

-- Enum type para el estado de la transcripción
CREATE TYPE transcription_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- Tabla songs: representa una canción enviada por el usuario para transcribir
CREATE TABLE songs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    artist VARCHAR(255),
    source_url VARCHAR(1000),
    source_type source_type NOT NULL,
    duration_seconds INTEGER,
    audio_file_path VARCHAR(500),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Tabla transcriptions: resultado de una transcripción de IA
CREATE TABLE transcriptions (
    id BIGSERIAL PRIMARY KEY,
    song_id BIGINT NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    status transcription_status NOT NULL DEFAULT 'PENDING',
    -- Datos de tablatura en formato JSON (alphaTex / texto ASCII)
    tabs_data JSONB,
    -- Datos de pentagrama en formato MusicXML o ABC notation
    staff_data JSONB,
    -- Acordes detectados
    chords_data JSONB,
    -- Metadata del proveedor de IA usado
    ai_provider VARCHAR(100),
    ai_model_version VARCHAR(50),
    -- Mensaje de error si status = FAILED
    error_message TEXT,
    processing_started_at TIMESTAMP,
    processing_completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_songs_user_id ON songs(user_id);
CREATE INDEX idx_songs_source_type ON songs(source_type);
CREATE INDEX idx_transcriptions_song_id ON transcriptions(song_id);
CREATE INDEX idx_transcriptions_status ON transcriptions(status);

-- Trigger para updated_at en songs
CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para updated_at en transcriptions
CREATE TRIGGER update_transcriptions_updated_at BEFORE UPDATE ON transcriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
