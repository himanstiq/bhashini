#!/usr/bin/env node

/**
 * Pre-flight check script to verify setup before running the application
 */

import { existsSync } from 'fs';
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
} else {
  checks.warnings.push('⚠️  .env file NOT found - Copy .env.example and configure it');
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
  console.log('');
  process.exit(1);
} else if (checks.warnings.length > 0) {
  console.log('⚠️  Pre-flight checks passed with warnings\n');
  console.log('You can proceed, but you may encounter runtime errors.');
  console.log('Make sure to configure your .env file with proper credentials.\n');
  process.exit(0);
} else {
  console.log('✅ All pre-flight checks passed!\n');
  console.log('You can now run: npm run dev:all\n');
  process.exit(0);
}
