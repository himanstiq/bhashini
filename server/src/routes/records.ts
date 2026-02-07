import express, { Request, Response } from 'express';
import pool from '../db/pool.js';
import { generateUploadUrl, generateDownloadUrl, deleteObject } from '../services/s3.js';

const router = express.Router();

interface AudioRecordBody {
  file_name: string;
  speaker_id: string;
  age?: number;
  gender?: string;
  native_language?: string;
  accent_region?: string;
  device_type?: string;
  environment?: string;
  noise_level?: string;
  duration?: number;
  sample_rate?: number;
  transcription?: string;
  sentence_type?: string;
  emotion?: string;
  code_mixing?: string;
  clarity_score?: number;
  consent_obtained?: string;
}

// GET /api/records - Fetch all records
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT * FROM audio_records ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// POST /api/records - Create record metadata + return presigned S3 upload URL
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const body: AudioRecordBody = req.body;

    // Validate required fields
    if (!body.file_name || !body.speaker_id) {
      res.status(400).json({ error: 'file_name and speaker_id are required' });
      return;
    }

    const s3Bucket = process.env.S3_BUCKET_NAME || '';
    const s3Key = `audio/${body.speaker_id}/${body.file_name}`;

    // Insert record into database
    const result = await pool.query(
      `INSERT INTO audio_records (
        file_name, speaker_id, age, gender, native_language, accent_region,
        device_type, environment, noise_level, duration, sample_rate,
        transcription, sentence_type, emotion, code_mixing, clarity_score,
        consent_obtained, s3_bucket, s3_key, upload_complete
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *`,
      [
        body.file_name,
        body.speaker_id,
        body.age,
        body.gender,
        body.native_language,
        body.accent_region,
        body.device_type,
        body.environment,
        body.noise_level,
        body.duration,
        body.sample_rate,
        body.transcription,
        body.sentence_type,
        body.emotion,
        body.code_mixing,
        body.clarity_score,
        body.consent_obtained,
        s3Bucket,
        s3Key,
        false,
      ]
    );

    // Generate presigned upload URL
    const uploadUrl = await generateUploadUrl(s3Bucket, s3Key);

    res.status(201).json({
      record: result.rows[0],
      uploadUrl,
    });
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Failed to create record' });
  }
});

// GET /api/records/:id/audio-url - Generate presigned GET URL for audio playback
router.get('/:id/audio-url', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT s3_bucket, s3_key, upload_complete FROM audio_records WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }

    const record = result.rows[0];

    if (!record.upload_complete) {
      res.status(400).json({ error: 'Audio file not yet uploaded' });
      return;
    }

    const downloadUrl = await generateDownloadUrl(record.s3_bucket, record.s3_key);

    res.json({ url: downloadUrl });
  } catch (error) {
    console.error('Error generating audio URL:', error);
    res.status(500).json({ error: 'Failed to generate audio URL' });
  }
});

// PATCH /api/records/:id/confirm-upload - Mark upload_complete = true
router.patch('/:id/confirm-upload', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE audio_records SET upload_complete = true WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error confirming upload:', error);
    res.status(500).json({ error: 'Failed to confirm upload' });
  }
});

// PUT /api/records/:id - Update record metadata
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const body: AudioRecordBody = req.body;

    const result = await pool.query(
      `UPDATE audio_records SET
        file_name = COALESCE($1, file_name),
        speaker_id = COALESCE($2, speaker_id),
        age = COALESCE($3, age),
        gender = COALESCE($4, gender),
        native_language = COALESCE($5, native_language),
        accent_region = COALESCE($6, accent_region),
        device_type = COALESCE($7, device_type),
        environment = COALESCE($8, environment),
        noise_level = COALESCE($9, noise_level),
        duration = COALESCE($10, duration),
        sample_rate = COALESCE($11, sample_rate),
        transcription = COALESCE($12, transcription),
        sentence_type = COALESCE($13, sentence_type),
        emotion = COALESCE($14, emotion),
        code_mixing = COALESCE($15, code_mixing),
        clarity_score = COALESCE($16, clarity_score),
        consent_obtained = COALESCE($17, consent_obtained)
      WHERE id = $18
      RETURNING *`,
      [
        body.file_name,
        body.speaker_id,
        body.age,
        body.gender,
        body.native_language,
        body.accent_region,
        body.device_type,
        body.environment,
        body.noise_level,
        body.duration,
        body.sample_rate,
        body.transcription,
        body.sentence_type,
        body.emotion,
        body.code_mixing,
        body.clarity_score,
        body.consent_obtained,
        id,
      ]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Failed to update record' });
  }
});

// DELETE /api/records/:id - Delete record from DB + delete S3 object
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Get record to find S3 key
    const selectResult = await pool.query(
      'SELECT s3_bucket, s3_key FROM audio_records WHERE id = $1',
      [id]
    );

    if (selectResult.rows.length === 0) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }

    const record = selectResult.rows[0];

    // Delete from S3 if bucket and key exist
    if (record.s3_bucket && record.s3_key) {
      try {
        await deleteObject(record.s3_bucket, record.s3_key);
      } catch (s3Error) {
        console.error('Error deleting from S3:', s3Error);
        // Continue with DB deletion even if S3 deletion fails
      }
    }

    // Delete from database
    await pool.query('DELETE FROM audio_records WHERE id = $1', [id]);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

export default router;
