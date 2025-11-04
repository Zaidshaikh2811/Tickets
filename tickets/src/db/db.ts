import mongoose from 'mongoose';
import { natsWrapper } from '../nats-wrapper';



const config = {
    mongoURI: process.env.MONGO_URI || 'mongodb://tickets-mongo-srv:27017/tickets',
    nats: {
        clusterId: process.env.NATS_CLUSTER_ID || 'ticketing',
        clientId: process.env.NATS_CLIENT_ID || 'tickets-service',
        url: process.env.NATS_URL || 'nats://nats-service:4222',
    },

}

const validateEnv = () => {
    const requiredVars = ['JWT_KEY', 'MONGO_URI', 'NATS_CLUSTER_ID', 'NATS_CLIENT_ID', 'NATS_URL'];
    const missing = requiredVars.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(` Missing required environment variables: ${missing.join(', ')}`);
    }
};

export const connectToDatabase = async () => {



    validateEnv();


    try {
        await natsWrapper.connect(
            config.nats.clusterId,
            config.nats.clientId,
            config.nats.url
        );

        natsWrapper.client.on("close", () => {
            console.log("NATS connection closed");
            process.exit();
        });

        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());

        console.log('NATS connected successfully');
        await mongoose.connect(config.mongoURI, {
            retryWrites: true,
            w: 'majority',
            autoIndex: false,
            connectTimeoutMS: 10000,
        });
        mongoose.connection.on('error', (err) => {
            console.error(' MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });
        console.log('MongoDB connected successfully');


        process.on('SIGINT', gracefulShutdown);
        process.on('SIGTERM', gracefulShutdown);



    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);

    }
};

export const natsConnect = async (client: any): Promise<void> => {
    try {
        await client.connect();
        console.log(' NATS connected successfully');
    } catch (error) {
        console.error(' NATS connection error:', error);
        throw error;
    }
};

export const natsDisconnect = async (client: any): Promise<void> => {
    try {
        await client.close();
        console.log(' NATS disconnected successfully');
    } catch (error) {
        console.error(' NATS disconnection error:', error);
        throw error;
    }
};

export const disconnectFromDatabase = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log(' MongoDB disconnected successfully');
    } catch (error) {
        console.error('  MongoDB disconnection error:', error);
        throw error;
    }
};

const gracefulShutdown = async () => {
    console.log('\n Initiating graceful shutdown...');

    try {

        if (natsWrapper.client) {
            natsWrapper.client.close();
            console.log('  NATS connection closed.');
        }


        await mongoose.connection.close();
        console.log('  MongoDB connection closed.');


        console.log(' Graceful shutdown complete. Exiting...');
        process.exit(0);
    } catch (error) {
        console.error(' Error during graceful shutdown:', error);
        process.exit(1);
    }
};