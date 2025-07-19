// Alternative entry point for hosting platforms
// This file can be used as Application Startup File

import app from './app.js';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`🚀 Barokah Printer server is running on ${HOST}:${PORT}`);
  console.log(`📱 Access your application at: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Entry point: index.js`);
});

// Export the app for serverless environments
export default app;