// Minimal web-push dependency for server-side push
const { execSync } = require('child_process');

try {
  require.resolve('web-push');
} catch (e) {
  execSync('npm install web-push', { stdio: 'inherit' });
}
