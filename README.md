# Bhashini - Audio Data Management Application

A full-stack audio data management application with a persistent table UI. Built with React 19 + TypeScript (Vite) frontend, Node.js + Express + TypeScript backend, PostgreSQL database, and AWS S3 storage.

## ⚡ Quick Start

**Important:** This application requires **both backend and frontend servers** to be running simultaneously.

```bash
# 1. Clone the repository (if you haven't already)
git clone <repository-url>
cd bhashini

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd server
npm install
cd ..

# 4. Run setup check (optional but recommended)
npm run check

# 5. Set up environment variables
cp .env.example .env
# Edit .env with your database and AWS credentials

# 6. Create database
createdb bhashini

# 7. Run both servers with one command
npm run dev:all
```

The application will be available at `http://localhost:5173`

**💡 Tip:** Run `npm run check` before starting to verify your setup is correct!

**Note:** If you get "Missing script: dev:all" error, make sure you ran `npm install` in step 2.

## Features

- 📊 Comprehensive audio metadata management
- 🎵 Direct S3 audio file upload via presigned URLs
- 🎧 In-browser audio playback
- 💾 Persistent data storage in PostgreSQL
- ✏️ Create, read, update, and delete audio records
- 🎨 Clean, modern, responsive UI
- 🔒 Secure AWS S3 integration

## Tech Stack

### Frontend
- React 19
- TypeScript 5.9
- Vite 7
- Native Fetch API

### Backend
- Node.js
- Express 4
- TypeScript 5
- PostgreSQL (via `pg`)
- AWS SDK v3 (@aws-sdk/client-s3, @aws-sdk/s3-request-presigner)

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- AWS S3 bucket with appropriate permissions
- AWS credentials (Access Key ID and Secret Access Key)

## Project Structure

```
bhashini/
├── src/                      # Frontend source
│   ├── components/          # React components
│   │   ├── AudioTable.tsx
│   │   ├── AudioPlayer.tsx
│   │   ├── RecordForm.tsx
│   │   └── FileUpload.tsx
│   ├── pages/              # Page components
│   │   └── AudioDataPage.tsx
│   ├── services/           # API service layer
│   │   └── api.ts
│   ├── types/              # TypeScript interfaces
│   │   └── audio-record.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── server/                  # Backend source
│   ├── src/
│   │   ├── db/
│   │   │   ├── migrations/
│   │   │   │   └── 001_create_audio_records.sql
│   │   │   └── pool.ts
│   │   ├── routes/
│   │   │   └── records.ts
│   │   ├── services/
│   │   │   └── s3.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── .env.example
├── package.json
└── vite.config.ts
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bhashini
```

### 2. Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# PostgreSQL Database
DATABASE_URL=postgresql://user:password@localhost:5432/bhashini

# AWS S3
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=your-bucket-name

# Server
PORT=3001
```

### 3. Database Setup

Create a PostgreSQL database:

```bash
createdb bhashini
```

Or using psql:

```sql
CREATE DATABASE bhashini;
```

The migration will run automatically when the server starts for the first time.

### 4. Install Dependencies

#### Frontend Dependencies

```bash
npm install
```

#### Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 5. Running the Application

**⚠️ IMPORTANT**: Both backend and frontend servers must be running for the application to work.

#### Option A: Run Both Servers with One Command (Recommended)

```bash
npm run dev:all
```

This will start both the backend (port 3001) and frontend (port 5173) servers simultaneously with color-coded output.

#### Option B: Run Servers Separately

If you prefer to run them in separate terminals:

**Terminal 1 - Backend Server**

```bash
cd server
npm run dev
```

The backend will start on `http://localhost:3001`

**Terminal 2 - Frontend Server**

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

### 6. Access the Application

Open your browser and navigate to `http://localhost:5173`

## API Documentation

### Base URL: `/api`

#### Get All Records
```
GET /api/records
```

Returns all audio records.

**Response:**
```json
[
  {
    "id": 1,
    "file_name": "KH_001_0001.wav",
    "speaker_id": "KH_SPK_001",
    "age": 22,
    "gender": "F",
    ...
  }
]
```

#### Create Record
```
POST /api/records
```

Creates a new audio record and returns a presigned S3 upload URL.

**Request Body:**
```json
{
  "file_name": "KH_001_0001.wav",
  "speaker_id": "KH_SPK_001",
  "age": 22,
  "gender": "F",
  ...
}
```

**Response:**
```json
{
  "record": { /* created record */ },
  "uploadUrl": "https://s3.amazonaws.com/..."
}
```

#### Update Record
```
PUT /api/records/:id
```

Updates an existing record's metadata.

**Request Body:**
```json
{
  "age": 23,
  "clarity_score": 5
}
```

#### Delete Record
```
DELETE /api/records/:id
```

Deletes a record from the database and removes the audio file from S3.

#### Get Audio URL
```
GET /api/records/:id/audio-url
```

Returns a presigned S3 URL for audio playback (valid for 15 minutes).

**Response:**
```json
{
  "url": "https://s3.amazonaws.com/..."
}
```

#### Confirm Upload
```
PATCH /api/records/:id/confirm-upload
```

Marks an audio file upload as complete.

## Audio Record Data Model

Each audio record contains:

| Field | Type | Description |
|-------|------|-------------|
| id | number | Auto-generated ID |
| file_name | string | Audio file name (e.g., KH_001_0001.wav) |
| speaker_id | string | Speaker identifier |
| age | number | Speaker age |
| gender | string | M, F, or Other |
| native_language | string | Speaker's native language |
| accent_region | string | Regional accent |
| device_type | string | Recording device |
| environment | string | Indoor, Outdoor, or Studio |
| noise_level | string | Low, Moderate, or High |
| duration | number | Audio duration in seconds |
| sample_rate | number | Sample rate in Hz |
| transcription | string | Text transcription |
| sentence_type | string | Spontaneous, Read, or Scripted |
| emotion | string | Neutral, Happy, Sad, Angry, Surprised |
| code_mixing | string | Language mixing details |
| clarity_score | number | 1-5 rating |
| consent_obtained | string | Yes or No |
| upload_complete | boolean | Upload status |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

## Development Scripts

### Root Directory

- `npm run check` - **Verify setup before running** (checks dependencies, .env, etc.)
- `npm run dev:all` - **Run both backend and frontend** (recommended for development)
- `npm run dev` - Start frontend only
- `npm run dev:server` - Start backend only
- `npm run build:all` - Build both backend and frontend
- `npm run build` - Build frontend for production
- `npm run build:server` - Build backend for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend (cd server)

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled JavaScript

## AWS S3 Configuration

Your S3 bucket needs the following CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedOrigins": ["http://localhost:5173", "http://localhost:3001"],
    "ExposeHeaders": []
  }
]
```

And the following IAM permissions:
- `s3:PutObject`
- `s3:GetObject`
- `s3:DeleteObject`

## Production Build

### Frontend

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Backend

```bash
cd server
npm run build
```

The compiled files will be in the `server/dist/` directory.

## Troubleshooting

### "concurrently is not recognized" Error (Windows)

**Error Message:**
```
'concurrently' is not recognized as an internal or external command,
operable program or batch file.
```

**Cause:** This was an issue in older versions where the script called `concurrently` directly instead of using `npx`.

**Solution:**
1. Make sure you have the latest version of `package.json` (should use `npx concurrently`)
2. If you see this error, pull the latest changes:
   ```bash
   git pull
   ```
3. Reinstall dependencies:
   ```bash
   npm install
   ```
4. The script should now work on Windows, Mac, and Linux

**Technical Note:** The `dev:all` script now uses `npx concurrently` which is cross-platform compatible and works on all operating systems.

### Missing Script Error: "dev:all"

**Error Message:**
```
npm error Missing script: "dev:all"
```

**Cause:** Dependencies are not installed. The `dev:all` script requires the `concurrently` package.

**Solution:**
1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Install backend dependencies:
   ```bash
   cd server && npm install && cd ..
   ```

3. Verify the script is now available:
   ```bash
   npm run dev:all
   ```

**Note:** This error commonly occurs when:
- You just cloned the repository
- You pulled new changes that added dependencies
- Your `node_modules` folder was deleted or is out of sync

### Vite Proxy Error: ECONNREFUSED

**Error Message:**
```
[vite] http proxy error: /api/records
AggregateError [ECONNREFUSED]
```

**Cause:** The backend server is not running or failed to start.

**Solution:**

1. **First, run the setup check:**
   ```bash
   npm run check
   ```
   This will tell you exactly what's missing.

2. **Common fixes:**
   - Backend dependencies not installed: `cd server && npm install`
   - Frontend dependencies not installed: `npm install`
   - Missing .env file: `cp .env.example .env` (then configure it)
   - Database not running: Start PostgreSQL

3. **Verify backend is running separately:**
   ```bash
   cd server && npm run dev
   ```
   
4. **Check that the backend is listening on port 3001:**
   ```bash
   lsof -i :3001
   ```

5. **Make sure both servers are running:**
   ```bash
   npm run dev:all
   ```

**Pro Tip:** Always run `npm run check` first to catch setup issues early!

### 500 Internal Server Error

**Error Message:**
```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
Error loading records: Error: Failed to fetch records: <error details>
```

**Cause:** The backend is running but encountering errors (database connection, missing .env configuration, etc.)

**Solution:**

1. **Check the backend terminal output** for detailed error messages

2. **Common causes and fixes:**
   
   **Database Connection Error:**
   - Error mentions "ECONNREFUSED" or "connection refused" in backend logs
   - PostgreSQL is not running: Start it with `pg_ctl start` or `brew services start postgresql`
   - Wrong DATABASE_URL: Check `.env` file has correct connection string
   - Database doesn't exist: Run `createdb bhashini`
   
   **Table Missing Error:**
   - Error mentions "relation audio_records does not exist"
   - Migration didn't run: Restart the backend server (it runs migrations on startup)
   - Check backend logs for migration errors
   
   **AWS Configuration Error:**
   - Error mentions AWS or S3
   - Missing AWS credentials in .env
   - Invalid AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY
   
3. **Verify your .env configuration:**
   ```bash
   cat .env
   ```
   Make sure all values are set (not placeholder text)

4. **Test database connection:**
   ```bash
   # Try connecting to your database
   psql $DATABASE_URL
   ```

5. **Check backend logs** when you start the server:
   ```bash
   cd server && npm run dev
   ```
   Look for specific error messages

**Pro Tip:** Run `npm run check` to verify your .env file has real values (not placeholders)!

### Health Check Endpoint

You can check if the backend is running and properly configured:

```bash
curl http://localhost:3001/health
```

**Example healthy response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-07T02:36:00.000Z",
  "uptime": 123.45,
  "environment": {
    "nodeVersion": "v18.x.x",
    "port": 3001
  },
  "database": "connected"
}
```

**Example degraded response (database issue):**
```json
{
  "status": "degraded",
  "database": "disconnected",
  "databaseError": "connect ECONNREFUSED 127.0.0.1:5432"
}
```

This helps diagnose whether:
- ✅ Backend is running
- ✅ Database is connected
- ❌ What specific error is occurring

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in .env file
- Ensure database exists: `psql -l | grep bhashini`
- Create database if missing: `createdb bhashini`

### S3 Upload Issues

- Verify AWS credentials are correct
- Check S3 bucket CORS configuration
- Ensure bucket name in .env matches actual bucket
- Check AWS IAM permissions

### Port Already in Use

Backend (3001):
```bash
lsof -ti:3001 | xargs kill
```

Frontend (5173):
```bash
lsof -ti:5173 | xargs kill
```

## License

MIT
