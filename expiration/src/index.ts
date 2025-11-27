import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { PaymentCompletedListener } from "./events/listeners/Payment-completed-listener";
import { PaymentFailedListener } from "./events/listeners/payment-failed-listener";
import { natsWrapper } from "./nats-wrapper";
import './queue/expiration-queue'


const start = async () => {
    try {

        if (!process.env.NATS_CLUSTER_ID) {
            throw new Error("NATS_CLUSTER_ID must be defined");
        }
        if (!process.env.NATS_CLIENT_ID) {
            throw new Error("NATS_CLIENT_ID must be defined");
        }
        if (!process.env.NATS_URL) {
            throw new Error("NATS_URL must be defined");
        }
        if (!process.env.REDIS_HOST) throw new Error("REDIS_HOST must be defined");

        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );






        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();
        new PaymentCompletedListener(natsWrapper.client).listen();
        new PaymentFailedListener(natsWrapper.client).listen();






    } catch (err) {
        console.error(" Failed during service startup:", err);
    }
};

start();