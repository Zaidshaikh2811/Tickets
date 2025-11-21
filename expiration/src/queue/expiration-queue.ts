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
expirationQueue.on("completed", (job) => {
    console.log(`Expiration job completed for orderId: ${job.data.orderId}`);
});

expirationQueue.on("failed", (job, err) => {
    console.error(`Expiration job failed for orderId: ${job?.data.orderId}`, err);
});

expirationQueue.on("error", (error) => {
    console.error("Expiration queue error:", error);
});
expirationQueue.on("waiting", (jobId) => {
    console.log(`Job with ID ${jobId} is waiting to be processed.`);
});

expirationQueue.on("active", (job) => {
    console.log(`Job with ID ${job.id} is now active and being processed.`);
});

expirationQueue.on("stalled", (job) => {
    console.warn(`Job with ID ${job.id} has stalled and will be retried.`);
});

expirationQueue.on("removed", (job) => {
    console.log(`Job with ID ${job.id} has been removed from the queue.`);
});

expirationQueue.on("drained", () => {
    console.log("All jobs have been processed and the queue is now drained.");
});

expirationQueue.on("paused", () => {
    console.log("The expiration queue has been paused.");
});

expirationQueue.on("resumed", () => {
    console.log("The expiration queue has been resumed.");
});


expirationQueue.process(async (job) => {
    console.log(`Processing expiration job for orderId: ${job.data.orderId}`);
    new ExpirationCompletedPublisher(natsWrapper.client).publish({
        orderId: job.data.orderId,
    });


});

export { expirationQueue };