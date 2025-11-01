
import nats from "node-nats-streaming";
import { TestListener } from "./events/ticket-created-listener.js";
console.clear();

const stan = nats.connect("ticketing", "123", {
    url: "http://localhost:4222",
});


stan.on("connect", async () => {
    console.log("Publisher connected to NATS");

    const testListener = new TestListener(stan);


    testListener.listen();


    stan.on("close", () => {
        console.log("NATS connection closed");
        process.exit();
    });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());



