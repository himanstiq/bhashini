-- Create audio_records table
CREATE TABLE IF NOT EXISTS audio_records (
  id SERIAL PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  speaker_id VARCHAR(100) NOT NULL,
  age INTEGER,
  gender VARCHAR(20),
  native_language VARCHAR(100),
  accent_region VARCHAR(100),
  device_type VARCHAR(100),
  environment VARCHAR(50),
  noise_level VARCHAR(50),
  duration NUMERIC(10, 2),
  sample_rate INTEGER,
  transcription TEXT,
  sentence_type VARCHAR(50),
  emotion VARCHAR(50),
  code_mixing VARCHAR(100),
  clarity_score INTEGER,
  consent_obtained VARCHAR(10),
  s3_bucket VARCHAR(255),
  s3_key VARCHAR(500) NOT NULL,
  upload_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on speaker_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_audio_records_speaker_id ON audio_records(speaker_id);

-- Create index on upload_complete for filtering
CREATE INDEX IF NOT EXISTS idx_audio_records_upload_complete ON audio_records(upload_complete);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_audio_records_updated_at ON audio_records;
CREATE TRIGGER update_audio_records_updated_at
    BEFORE UPDATE ON audio_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
