import Queue from "bull";
import { ExpirationCompletedPublisher } from "../events/publisher/expiration-completed-publisher";
import { natsWrapper } from "../nats-wrapper";

interface ExpirationJobData {
    orderId: string;
}

const expirationQueue = new Queue<ExpirationJobData>("order:expiration", {
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || "6379"),
    },
});

expirationQueue.process(async (job) => {
    console.log(`Processing expiration for orderId: ${job.data.orderId}`);
    new ExpirationCompletedPublisher(natsWrapper.client).publish({
        orderId: job.data.orderId,
    });


});




export { expirationQueue };