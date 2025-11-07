import { OutboxEvent } from "../models/outbox";
import { natsWrapper } from "../nats-wrapper";


let isRunning = false;
let isShuttingDown = false;
let processorInterval: NodeJS.Timeout | null = null;
const WORKER_ID = `worker-${Math.random().toString(36).substring(2, 10)}`;


const publishEvent = (event: any): Promise<void> => {
    return new Promise((resolve, reject) => {
        natsWrapper.client.publish(
            event.eventType,
            JSON.stringify(event.data),
            (err) => {
                if (err) return reject(err);
                resolve();
            }
        );
    });
};


const processOutbox = async () => {
    if (isShuttingDown) return;
    if (isRunning) return;

    isRunning = true;

    try {
        const event = await OutboxEvent.findOneAndUpdate(
            {
                processed: false,
                $or: [
                    { lockedBy: null },
                    { lockedAt: { $lt: new Date(Date.now() - 30_000) } },
                ],
            },
            {
                lockedBy: WORKER_ID,
                lockedAt: new Date(),
            },
            { new: true }
        );

        if (!event) {
            isRunning = false;
            return;
        }

        try {
            await publishEvent(event);
            event.processed = true;
            event.processedAt = new Date();
            event.lockedBy = null;
            event.lockedAt = null;

            await event.save();

            console.log(` Outbox event processed: ${event._id}`);

        } catch (err) {
            console.error(` Failed to process Outbox event ${event._id}:`, err);
            await OutboxEvent.updateOne(
                { _id: event._id },
                { lockedBy: null, lockedAt: null }
            );
        }

    } catch (err) {
        console.error("🔥 Unexpected Outbox Processor Error:", err);
    }

    isRunning = false;
};

export const startOutboxProcessor = () => {
    if (processorInterval) {
        console.log(" Outbox processor already running.");
        return;
    }

    console.log(" Outbox Processor Started");

    processorInterval = setInterval(processOutbox, 2000); // every 2 seconds
};


export const stopOutboxProcessor = async () => {
    console.log(" Stopping Outbox Processor...");
    isShuttingDown = true;

    if (processorInterval) {
        clearInterval(processorInterval);
        processorInterval = null;
    }

    while (isRunning) {
        console.log(" Waiting for outbox processor to finish...");
        await new Promise((resolve) => setTimeout(resolve, 200));
    }

    console.log(" Outbox Processor Stopped");
};