const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting ChargeFlow Backend and Frontend...\n');

// Start Backend
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Start Frontend (after 2 seconds delay)
setTimeout(() => {
  console.log('📱 Starting Frontend...\n');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  frontend.on('close', (code) => {
    console.log(`Frontend exited with code ${code}`);
    backend.kill();
  });
}, 2000);

backend.on('close', (code) => {
  console.log(`Backend exited with code ${code}`);
  process.exit(0);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down both servers...');
  backend.kill();
  process.exit(0);
});
