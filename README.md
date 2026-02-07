# Bhashini - Audio Data Management Application

A full-stack audio data management application with a persistent table UI. Built with React 19 + TypeScript (Vite) frontend, Node.js + Express + TypeScript backend, PostgreSQL database, and AWS S3 storage.

## ⚡ Quick Start

**Important:** This application requires **both backend and frontend servers** to be running simultaneously.

```bash
# 1. Install all dependencies
npm install
cd server && npm install && cd ..

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your database and AWS credentials

# 3. Create database
createdb bhashini

# 4. Run both servers with one command
npm run dev:all
```

The application will be available at `http://localhost:5173`

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

### Vite Proxy Error: ECONNREFUSED

**Error Message:**
```
[vite] http proxy error: /api/records
AggregateError [ECONNREFUSED]
```

**Cause:** The backend server is not running, but the frontend is trying to connect to it.

**Solution:**
1. Make sure you're running both servers:
   ```bash
   npm run dev:all
   ```
   
2. Or verify the backend is running separately:
   ```bash
   cd server && npm run dev
   ```

3. Check that the backend is listening on port 3001:
   ```bash
   lsof -i :3001
   ```

4. If the backend won't start, check:
   - Database connection (PostgreSQL must be running)
   - `.env` file exists and has correct DATABASE_URL
   - All environment variables are set

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
