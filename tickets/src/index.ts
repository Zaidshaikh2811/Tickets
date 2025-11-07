import { app } from "./app";
import { startServices, setupGracefulShutdown } from "./db/db";
import { startOutboxProcessor } from "./outbox/outbox-processor";

const port = process.env.PORT || 3001;

const start = async () => {
    try {
        console.log("Starting Tickets service...");



        await startServices();



        startOutboxProcessor();
        setupGracefulShutdown();


        app.listen(port, () => {
            console.log(` Tickets service running on port ${port}`);
        });

    } catch (err) {
        console.error(" Failed during service startup:", err);
    }
};

start();