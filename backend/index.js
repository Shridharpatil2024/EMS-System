import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './src/routes/auth.js';
import attendanceRoutes from './src/routes/attendance.js';  
import userRoutes from './src/routes/user.js';
import leaveRequestRoutes from './src/routes/leaveRequest.js'
import departmentRoutes from './src/routes/department.js'

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaves', leaveRequestRoutes)
app.use('/api/department', departmentRoutes)

app.get('/', (req, res) => {
  res.send('Employee Management System Backend is running!');
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });


