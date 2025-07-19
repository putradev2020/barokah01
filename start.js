// Start script for production hosting
// This file can be used as Application Startup File for various hosting platforms

import app from './app.js';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

console.log('🔄 Starting Barokah Printer application...');
console.log(`📊 Node.js version: ${process.version}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`✅ Barokah Printer server successfully started!`);
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`📱 Access your application at: http://localhost:${PORT}`);
  console.log(`📁 Entry point: start.js`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Export the app
export default app;