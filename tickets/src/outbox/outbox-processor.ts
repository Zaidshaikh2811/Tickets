import { OutboxEvent } from "../models/outbox";
import { natsWrapper } from "../nats-wrapper";


let isRunning = false;
let isShuttingDown = false;
let processorInterval: NodeJS.Timeout | null = null;


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

        const events = await OutboxEvent.find({
            processed: false,

        }).limit(20);

        for (const event of events) {
            if (isShuttingDown) break;

            try {
                await publishEvent(event);

                event.processed = true;
                event.processedAt = new Date();
                await event.save();

                console.log(` Outbox event processed: ${event._id}`);

            } catch (err) {
                console.error(` Failed to process Outbox event ${event._id}:`, err);

            }
        }
    } catch (err) {
        console.error(` Unexpected Outbox Processor Error:`, err);
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