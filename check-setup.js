#!/usr/bin/env node

/**
 * Pre-flight check script to verify setup before running the application
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

console.log('🔍 Running pre-flight checks...\n');

// Check 1: Frontend node_modules
const frontendNodeModules = join(__dirname, 'node_modules');
if (existsSync(frontendNodeModules)) {
  checks.passed.push('✅ Frontend dependencies installed');
} else {
  checks.failed.push('❌ Frontend dependencies NOT installed - Run: npm install');
}

// Check 2: Backend node_modules
const backendNodeModules = join(__dirname, 'server', 'node_modules');
if (existsSync(backendNodeModules)) {
  checks.passed.push('✅ Backend dependencies installed');
} else {
  checks.failed.push('❌ Backend dependencies NOT installed - Run: cd server && npm install');
}

// Check 3: .env file
const envFile = join(__dirname, '.env');
if (existsSync(envFile)) {
  checks.passed.push('✅ .env file exists');
  
  // Check if DATABASE_URL is configured
  try {
    const envContent = readFileSync(envFile, 'utf-8');
    if (envContent.includes('DATABASE_URL=postgresql://') && !envContent.includes('DATABASE_URL=postgresql://user:password@localhost')) {
      checks.passed.push('✅ DATABASE_URL appears to be configured');
    } else if (envContent.includes('DATABASE_URL=')) {
      checks.warnings.push('⚠️  DATABASE_URL found but may not be configured - Update with your PostgreSQL credentials');
    } else {
      checks.warnings.push('⚠️  DATABASE_URL not found in .env - Add your PostgreSQL connection string');
    }
    
    // Check if AWS credentials are configured
    if (envContent.includes('AWS_ACCESS_KEY_ID=') && !envContent.includes('AWS_ACCESS_KEY_ID=your-access-key')) {
      checks.passed.push('✅ AWS credentials appear to be configured');
    } else {
      checks.warnings.push('⚠️  AWS credentials not configured - Update AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY');
    }
  } catch (err) {
    checks.warnings.push('⚠️  Could not read .env file');
  }
} else {
  checks.failed.push('❌ .env file NOT found - Run: cp .env.example .env (then configure it)');
}

// Check 4: concurrently package
const concurrentlyPath = join(__dirname, 'node_modules', 'concurrently');
if (existsSync(concurrentlyPath)) {
  checks.passed.push('✅ concurrently package available');
} else {
  checks.failed.push('❌ concurrently package NOT found - Run: npm install');
}

// Print results
console.log('📋 Check Results:\n');

if (checks.passed.length > 0) {
  checks.passed.forEach(msg => console.log(msg));
}

if (checks.warnings.length > 0) {
  console.log('');
  checks.warnings.forEach(msg => console.log(msg));
}

if (checks.failed.length > 0) {
  console.log('');
  checks.failed.forEach(msg => console.log(msg));
}

console.log('\n' + '='.repeat(60) + '\n');

if (checks.failed.length > 0) {
  console.log('❌ Pre-flight checks FAILED\n');
  console.log('Please fix the issues above before running npm run dev:all\n');
  console.log('Quick fix commands:');
  console.log('  npm install');
  console.log('  cd server && npm install && cd ..');
  console.log('  cp .env.example .env');
  console.log('  # Edit .env with your actual credentials');
  console.log('');
  process.exit(1);
} else if (checks.warnings.length > 0) {
  console.log('⚠️  Pre-flight checks passed with warnings\n');
  console.log('You can proceed, but you may encounter runtime errors.');
  console.log('Make sure to:');
  console.log('  1. Configure DATABASE_URL in .env with your PostgreSQL connection');
  console.log('  2. Configure AWS credentials in .env');
  console.log('  3. Create the database: createdb bhashini');
  console.log('  4. Ensure PostgreSQL is running');
  console.log('');
  process.exit(0);
} else {
  console.log('✅ All pre-flight checks passed!\n');
  console.log('You can now run: npm run dev:all\n');
  console.log('Make sure PostgreSQL is running before starting the servers.');
  console.log('');
  process.exit(0);
}
