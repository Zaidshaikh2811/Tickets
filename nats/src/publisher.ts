import nats from "node-nats-streaming";
console.clear();

const stan = nats.connect("ticketing", "abc", {
    url: "http://localhost:4222",
});

stan.on("connect", async () => {
    console.log("Publisher connected to NATS");
    const data = {
        "message": "test"
    };

    stan.publish("test:subject", JSON.stringify(data), () => {
        console.log("Event published to subject 'test:subject'");
    });
});