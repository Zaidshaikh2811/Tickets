import { app } from "./app";
import { startServices, setupGracefulShutdown } from "./db/db";

const port = process.env.PORT || 3001;

const start = async () => {
    try {
        console.log("Starting Payments service...");

        await startServices();
        setupGracefulShutdown();


        app.listen(port, () => {
            console.log(` Payments service running on port ${port}`);
        });

    } catch (err) {
        console.error(" Failed during service startup:", err);
    }
};

start();