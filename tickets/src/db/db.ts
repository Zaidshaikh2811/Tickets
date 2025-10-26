import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI || 'mongodb://tickets-mongo-srv:27017/tickets';

export const connectToDatabase = async () => {

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined in environment variables');
    }

    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};
export const disconnectFromDatabase = async () => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected successfully');
    } catch (error) {
        console.error('MongoDB disconnection error:', error);
        throw error;
    }
};