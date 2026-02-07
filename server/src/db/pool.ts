import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const runMigrations = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    console.log('Running database migrations...');
    const migrationPath = path.join(__dirname, 'migrations', '001_create_audio_records.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    await client.query(migrationSQL);
    console.log('Database migrations completed successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default pool;
