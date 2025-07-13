import app from './src/app.js';
import { connectDB } from './src/db.js';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

// Connect to database
(async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");
    
    // For local development
      app.listen(port, () => {
        console.log(`Server started at port:${port}`);
      });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    // Don't exit in production to allow serverless function to respond with error
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
})();

// Global error handler middleware (add this at the end)
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  res.status(500).json({
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});

// For serverless environments like Vercel
export default app;