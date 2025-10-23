import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI || 'mongodb://auth-mongo-srv:27017/authdb';

export const connectToDatabase = async () => {
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