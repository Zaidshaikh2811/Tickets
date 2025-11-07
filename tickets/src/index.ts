import { app } from "./app";
import { startServices, setupGracefulShutdown } from "./db/db";
import { startOutboxProcessor } from "./outbox/outbox-processor";

const port = process.env.PORT || 3001;

const start = async () => {


    await startServices();
    setupGracefulShutdown();

    startOutboxProcessor();

    app.listen(port, () => {
        console.log(`Orders service running on port ${port}`);
    });
};

start();