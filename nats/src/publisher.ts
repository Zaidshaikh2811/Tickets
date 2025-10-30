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

    for (let i = 0; i < 1; i++) {
        stan.publish("test:subject", JSON.stringify(data), () => {
            console.log(`📤 Message ${i + 1} published`);
        });
    }
}
);