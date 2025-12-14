#!/usr/bin/env node

console.log('🔍 Math Boss Server Diagnostics');
console.log('================================\n');

// Check Node.js version
console.log('📦 Node.js Version:', process.version);

// Check if we're in the right directory
const path = require('path');
const fs = require('fs');
console.log('📁 Current Directory:', process.cwd());

// Check if package.json exists
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('✅ package.json found');
  console.log('📋 Project Name:', packageJson.name);
  console.log('📋 Version:', packageJson.version);
} catch (error) {
  console.log('❌ package.json not found or invalid');
  process.exit(1);
}

// Check if node_modules exists
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules found');
} else {
  console.log('❌ node_modules not found - run npm install');
}

// Check if .env.local exists
if (fs.existsSync('.env.local')) {
  console.log('✅ .env.local found');
} else {
  console.log('⚠️  .env.local not found');
}

// Check key directories
const dirs = ['app', 'components', 'lib', 'public'];
dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/ directory found`);
  } else {
    console.log(`❌ ${dir}/ directory missing`);
  }
});

// Check key files
const files = [
  'app/layout.tsx',
  'app/page.tsx',
  'app/globals.css',
  'tailwind.config.js',
  'next.config.ts'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} found`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

console.log('\n🚀 Attempting to start Next.js development server...\n');

// Try to start the dev server
const { spawn } = require('child_process');

const devServer = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '3001' }
});

devServer.on('error', (error) => {
  console.log('\n❌ Failed to start development server:');
  console.log('Error:', error.message);

  if (error.message.includes('EPERM')) {
    console.log('\n💡 This is likely a macOS permission issue.');
    console.log('Try running:');
    console.log('  sudo npm run dev');
    console.log('Or disable firewall temporarily');
  }
});

devServer.on('close', (code) => {
  console.log(`\nDevelopment server exited with code ${code}`);
});

setTimeout(() => {
  console.log('\n⏰ Timeout reached - stopping diagnostic server...');
  devServer.kill();
}, 10000);






