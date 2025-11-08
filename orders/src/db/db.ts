import mongoose from 'mongoose';
import { natsWrapper } from '../nats-wrapper';
import { TicketCreatedListener } from '../listeners/ticket-created-listener';
import { TicketUpdatedListener } from '../listeners/ticket-updated-listener';

const config = {
    mongoURI: process.env.MONGO_URI || 'mongodb://orders-mongo-srv:27017/ordersdb',
    nats: {
        clusterId: process.env.NATS_CLUSTER_ID || 'orders',
        clientId: process.env.NATS_CLIENT_ID || 'orders-service',
        url: process.env.NATS_URL || 'nats://nats-service:4222',
    },
};


const validateEnv = () => {
    const requiredEnvVars = ['NATS_CLUSTER_ID', 'NATS_CLIENT_ID', 'NATS_URL'];
    const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
};


const connectToDatabase = async (): Promise<void> => {
    validateEnv();

    try {
        await mongoose.connect(config.mongoURI, {

            retryWrites: true,
            w: 'majority',
            autoIndex: false,
        });

        console.log('✅ MongoDB connected successfully');


        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });


        await natsWrapper.connect(
            config.nats.clusterId,
            config.nats.clientId,
            config.nats.url
        );
        console.log('✅ NATS connected successfully');

        natsWrapper.client.on('close', () => {
            console.warn('⚠️ NATS connection closed. Waiting for reconnect...');
        });
        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();




    } catch (error) {
        console.error('❌ MongoDB initial connection failed:', error);

        throw error;
    }
};

export const gracefulShutdown = async () => {
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

export { connectToDatabase, config };
