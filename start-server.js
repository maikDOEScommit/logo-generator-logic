#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Next.js Logo Generator Server...');

// Kill any existing processes on port 3000
const killExistingProcess = () => {
  return new Promise((resolve) => {
    const killProcess = spawn('lsof', ['-ti:3000']);
    
    killProcess.stdout.on('data', (data) => {
      const pid = data.toString().trim();
      if (pid) {
        console.log(`🔄 Killing existing process on port 3000 (PID: ${pid})`);
        spawn('kill', ['-9', pid]);
      }
    });
    
    killProcess.on('close', () => {
      setTimeout(resolve, 1000); // Wait 1 second
    });
    
    killProcess.on('error', () => {
      resolve(); // Continue even if lsof fails
    });
  });
};

// Clean build cache
const cleanCache = () => {
  console.log('🧹 Cleaning build cache...');
  const nextDir = path.join(__dirname, '.next');
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
  }
};

// Start the server
const startServer = async () => {
  await killExistingProcess();
  cleanCache();
  
  console.log('✨ Starting fresh Next.js development server...');
  
  const server = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    env: { ...process.env, FORCE_COLOR: '1' }
  });

  server.on('error', (err) => {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  });

  server.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Server process exited with code ${code}`);
      process.exit(code);
    }
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Gracefully shutting down server...');
    server.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Gracefully shutting down server...');
    server.kill('SIGTERM');
  });
};

startServer().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});