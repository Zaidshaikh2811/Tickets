import mongoose from 'mongoose';
import { natsWrapper } from '../nats-wrapper';
import { TicketCreatedListener } from '../events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from '../events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from '../events/listeners/expiration-complete-listener';

const config = {
    mongoURI: process.env.MONGO_URI || 'mongodb://orders-mongo-srv:27017/ordersdb',
    nats: {
        clusterId: process.env.NATS_CLUSTER_ID || 'orders',
        clientId: process.env.NATS_CLIENT_ID || 'orders-service',
        url: process.env.NATS_URL || 'nats://nats-service:4222',
    },
};

const validateEnv = () => {
    const requiredEnvVars = [
        'MONGO_URI',
        'NATS_CLUSTER_ID',
        'NATS_CLIENT_ID',
        'NATS_URL',
    ];
    const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

    if (missingVars.length > 0) {
        throw new Error(` Missing required environment variables: ${missingVars.join(', ')}`);
    }
};

export const gracefulShutdown = async () => {
    console.log('\n Initiating graceful shutdown...');
    try {
        if (natsWrapper.client) {
            await new Promise<void>((resolve) => {
                natsWrapper.client.close();
                natsWrapper.client.on('close', resolve);
            });
            console.log(' NATS connection closed.');
        }

        await mongoose.connection.close();
        console.log(' MongoDB connection closed.');

        console.log(' Graceful shutdown complete.');
        process.exit(0);
    } catch (error) {
        console.error(' Error during graceful shutdown:', error);
        process.exit(1);
    }
};

export const connectToDatabase = async (): Promise<void> => {
    validateEnv();

    try {
        await natsWrapper.connect(config.nats.clusterId, config.nats.clientId, config.nats.url);
        console.log(' NATS connected successfully');

        natsWrapper.client.on('close', () => {
            console.warn(' NATS connection closed. Exiting...');
            process.exit();
        });

        process.on('SIGINT', gracefulShutdown);
        process.on('SIGTERM', gracefulShutdown);

        await mongoose.connect(config.mongoURI);
        console.log(' MongoDB connected successfully');

        mongoose.connection.on('error', (err) => {
            console.error(' MongoDB connection error:', err);
        });

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();

    } catch (error) {
        console.error(' Initialization error:', error);
        throw error;
    }
};
