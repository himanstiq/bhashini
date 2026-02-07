# Installation Guide

This guide helps you set up the Bhashini audio data management application.

**Platform Support:** ✅ Windows | ✅ macOS | ✅ Linux

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **PostgreSQL** 12+
- **AWS S3** bucket with appropriate permissions
- **AWS credentials** (Access Key ID and Secret Access Key)

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/himanstiq/bhashini.git
cd bhashini
```

### 2. Install Dependencies

**Frontend dependencies:**
```bash
npm install
```

**Backend dependencies:**
```bash
cd server
npm install
cd ..
```

> ⚠️ **Important:** Both steps are required! The `npm install` in the root directory installs frontend dependencies (including `concurrently` which is needed for the `dev:all` script).

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file with your actual configuration:

```env
# PostgreSQL Database
DATABASE_URL=******localhost:5432/bhashini

# AWS S3
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-access-key-here
AWS_SECRET_ACCESS_KEY=your-secret-key-here
S3_BUCKET_NAME=your-bucket-name

# Server
PORT=3001
```

### 4. Set Up Database

Create the PostgreSQL database:

```bash
createdb bhashini
```

Or using psql:
```sql
CREATE DATABASE bhashini;
```

The database schema will be created automatically when the server starts for the first time.

### 5. Verify Setup (Recommended)

Before running the application, verify your setup:

```bash
npm run check
```

This will check:
- ✅ Frontend dependencies installed
- ✅ Backend dependencies installed
- ✅ .env file exists
- ✅ All required packages available

Fix any issues reported before proceeding.

### 6. Run the Application

**Option A: Run both servers together (Recommended)**

```bash
npm run dev:all
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend server on `http://localhost:5173`

**Option B: Run servers separately**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
npm run dev
```

### 7. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Common Installation Issues

### "concurrently is not recognized" (Windows)

**Error:** `'concurrently' is not recognized as an internal or external command`

**Cause:** Older version of the script or missing dependencies

**Solution:**
```bash
# Pull latest changes
git pull

# Reinstall dependencies
npm install

# Now try again
npm run dev:all
```

**Note:** The application is now fully cross-platform compatible (Windows, Mac, Linux).

### "Missing script: dev:all"

**Cause:** Dependencies not installed

**Solution:**
```bash
npm install
```

### Backend won't start

**Possible causes:**
1. PostgreSQL is not running
2. Database doesn't exist
3. Wrong DATABASE_URL in .env

**Solutions:**
```bash
# Check if PostgreSQL is running
pg_isready

# Create database if missing
createdb bhashini

# Verify .env file exists and is configured
cat .env
```

### Frontend can't connect to backend

**Error:** `[vite] http proxy error: /api/records`

**Cause:** Backend server is not running

**Solution:**
```bash
# Make sure both servers are running
npm run dev:all
```

## Updating Dependencies

When pulling new changes from the repository, always run:

```bash
npm install
cd server && npm install && cd ..
```

This ensures all new dependencies are installed.

## Next Steps

- Read the [README.md](README.md) for detailed API documentation
- Check the [Troubleshooting](README.md#troubleshooting) section for common issues
- Configure your S3 bucket CORS settings (see README.md)

## Getting Help

If you encounter issues:
1. Check the [Troubleshooting](README.md#troubleshooting) section
2. Ensure all prerequisites are installed
3. Verify your `.env` configuration
4. Check that PostgreSQL is running
