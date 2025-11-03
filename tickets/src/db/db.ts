import mongoose from 'mongoose';
import { natsWrapper } from '../nats-wrapper';

const mongoURI = process.env.MONGO_URI || 'mongodb://tickets-mongo-srv:27017/tickets';
const NATS_CLUSTER_ID = process.env.NATS_CLUSTER_ID! || 'ticketing';
const NATS_CLIENT_ID = process.env.NATS_CLIENT_ID! || 'tickets-service';
const NATS_URL = process.env.NATS_URL! || 'nats://nats-service:4222';

export const connectToDatabase = async () => {

    console.log(process.env.JWT_KEY);


    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined in environment variables');
    }

    try {
        await natsWrapper.connect(
            NATS_CLUSTER_ID,
            NATS_CLIENT_ID,
            NATS_URL
        );
        console.log('NATS connected successfully');
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

export const natsConnect = async (client: any) => {
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined in environment variables');
    }

    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined in environment variables');
    }

    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined in environment variables');
    }

    try {
        await client.connect();
        console.log('NATS connected successfully');
    } catch (error) {
        console.error('NATS connection error:', error);
        throw error;
    }
};

export const natsDisconnect = async (client: any) => {
    try {
        await client.close();
        console.log('NATS disconnected successfully');
    } catch (error) {
        console.error('NATS disconnection error:', error);
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