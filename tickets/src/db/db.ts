import mongoose from "mongoose";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedListener } from "../events/listener/order-created-listener";
import { OrderCancelledListener } from "../events/listener/order-cancelled-listener";
import { PaymentCreatedListener } from "../events/listener/payment-created-listener";
import { PaymentFailedListener } from "../events/listener/payment-cancelled-listener";
import { PaymentCompletedListener } from "../events/listener/payment-completed-listener";

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

        natsWrapper.client.on("close", () => {
            console.log("NATS connection closed. Exiting...");
            process.exit();
        });

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();
        new PaymentCompletedListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();
        new PaymentFailedListener(natsWrapper.client).listen();


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
