import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all for hackathon
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Imports
import authRoutes from './routes/auth';
import patientRoutes from './routes/patient';
import appointmentRoutes from './routes/appointment';
import prescriptionRoutes from './routes/prescription';
import inventoryRoutes from './routes/inventory';
import followupRoutes from './routes/followup';
import adminRoutes from './routes/admin';
import contactRoutes from './routes/contact';
import videoRoutes from './routes/video';
import { analyzeSymptomAPI } from './services/aiService';

// Routes
app.use('/auth', authRoutes);
app.use('/patients', patientRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/prescriptions', prescriptionRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/followups', followupRoutes);
app.use('/admin', adminRoutes);
app.use('/contact', contactRoutes);
app.use('/video', videoRoutes);
app.post('/ai/analyze-symptoms', analyzeSymptomAPI);

// Basic Route
app.get('/', (req: express.Request, res: express.Response) => {
    res.send('JanJeevan API is running');
});

// Socket.io
io.on('connection', (socket: any) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (room: any) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
