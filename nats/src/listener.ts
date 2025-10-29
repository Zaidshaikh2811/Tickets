
import nats, { Message } from "node-nats-streaming";
console.clear();

const stan = nats.connect("ticketing", "123", {
    url: "http://localhost:4222",
});

stan.on("connect", async () => {
    console.log("Publisher connected to NATS");

    const subscription = stan.subscribe("test:subject");

    subscription.on("message", (msg: Message) => {
        const data = msg.getData();
        console.log(`📩 Received message [${msg.getSequence()}]: ${data}`);
    });
});