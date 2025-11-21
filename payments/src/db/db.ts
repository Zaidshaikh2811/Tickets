import mongoose from "mongoose";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelledListener } from "../events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "../events/listeners/order-created-listener";

const config = {
    mongoURI: process.env.MONGO_URI!,
    nats: {
        clusterId: process.env.NATS_CLUSTER_ID!,
        clientId: process.env.NATS_CLIENT_ID!,
        url: process.env.NATS_URL!,
    },
};






const validateEnv = () => {
    const required = [
        "JWT_KEY",
        "MONGO_URI",
        "NATS_CLUSTER_ID",
        "NATS_CLIENT_ID",
        "NATS_URL",
    ];

    const missing = required.filter(v => !process.env[v]);
    if (missing.length > 0) {
        throw new Error(`Missing ENV variables: ${missing.join(", ")}`);
    }
};

export const startServices = async () => {
    validateEnv();

    try {





        await natsWrapper.connect(
            config.nats.clusterId,
            config.nats.clientId,
            config.nats.url
        );


        new OrderCancelledListener(natsWrapper.client).listen();
        new OrderCreatedListener(natsWrapper.client).listen();

        natsWrapper.client.on("close", () => {
            console.log("NATS connection closed. Exiting...");
            process.exit();
        });


        await mongoose.connect(config.mongoURI);
        console.log(" MongoDB connected");

        mongoose.connection.on("error", err => {
            console.error(" MongoDB Error:", err);
        });

    } catch (err) {
        console.error(" Failed during service startup:", err);
        process.exit(1);
    }
};


export const setupGracefulShutdown = () => {
    process.on("SIGINT", () => shutdown());
    process.on("SIGTERM", () => shutdown());
};




const shutdown = async () => {


    try {



        if (natsWrapper.client) {
            natsWrapper.client.close();
            console.log("NATS connection closed");
        }


        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log("MongoDB connection closed");
        }

        console.log(" Graceful shutdown complete. Exiting...");
        process.exit(0);
    } catch (err) {
        console.error(" Error during shutdown:", err);
        process.exit(1);
    }
};
