
import nats, { Message } from "node-nats-streaming";
console.clear();

const stan = nats.connect("ticketing", "1234", {
    url: "http://localhost:4222",
});

const options = stan.subscriptionOptions().setDeliverAllAvailable().setManualAckMode(true).setAckWait(5 * 1000);


stan.on("connect", async () => {
    console.log("Publisher connected to NATS");

    const subscription = stan.subscribe("test:subject", "order-service-queue-group", options);

    subscription.on("message", (msg: Message) => {
        const data = msg.getData();
        console.log(`📩 Received message [${msg.getSequence()}]: ${data}`);
        msg.ack();
    });

    stan.on("close", () => {
        console.log("NATS connection closed");
        process.exit();
    });

});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());