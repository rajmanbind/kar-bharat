import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
// import orderRoutes from './routes/orderRoutes.js';
// import messageRoutes from './routes/messageRoutes.js';
// import notificationRoutes from './routes/notificationRoutes.js';
// import rateLimiter from './middleware/rateLimiter.js';
import errorMiddleware from './middleware/error.middleware.js';
import connectToDatabase from './database/mongodb.js';
import { PORT } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Rest of your application logic...


// Load env vars
dotenv.config();



// Initialize Redis
// require('./config/redis');

const app = express();

// const allowedOrigins = ['http://localhost:8080',"http://192.168.29.194:8080","https://kaarybharat.vercel.app","https://kaarybharat-rajmanbinds-projects.vercel.app/","https://kaarybharat-kb49agxp0-rajmanbinds-projects.vercel.app","https://kaarybharat-ioc339g2w-rajmanbinds-projects.vercel.app",'https://kaarybharat-9hty1xxzh-rajmanbinds-projects.vercel.app']; // Frontend URL
app.use(express.json()); // To parse JSON
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data
// app.use(
//     cors({
//       origin: (origin, callback) => {
//         if (allowedOrigins.includes(origin) || !origin) {
//           callback(null, true);
//         } else {
//           callback(new Error('Not allowed by CORS'));
//         }
//       },
//       methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//       credentials: true,
//       exposedHeaders: ['Authorization'], 
//       allowedHeaders: [
//         'Authorization', 
//         'Content-Type',
//         'X-Requested-With',
//         'Accept'
//       ] 
//     })
//   );

  // Configure CORS
// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Completely open CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});
app.use(cookieParser());
app.use(morgan('dev'));

// Apply rate limiting to all API routes
// app.use('/api', rateLimiter);

// // Set static folder
// app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/notifications', notificationRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CWB API' });
});


// Error Middleware
// app.use(notFound);
// app.use(errorHandler);
app.use(errorMiddleware)
// Create uploads directory if it doesn't exist




app.listen(PORT, async() => {
  console.log(`Server running on port ${PORT}`);
  await connectToDatabase();
});

export default app;