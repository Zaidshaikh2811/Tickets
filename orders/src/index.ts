import { app } from "./app";
import { connectToDatabase, gracefulShutdown } from "./db/db";

const port = process.env.PORT || 3001;

const start = async () => {
    try {

        await connectToDatabase();


        process.on("SIGINT", gracefulShutdown);
        process.on("SIGTERM", gracefulShutdown);


        app.listen(port, () => {
            console.log(` Orders service listening on port ${port}`);
        });

    } catch (err) {
        console.error(" Failed during startup:", err);
    }
};

start();
