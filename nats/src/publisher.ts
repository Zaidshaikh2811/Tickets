import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-publisher.js";


console.clear();


const stan = nats.connect("ticketing", "abc", {
    url: "http://localhost:4222",

});



stan.on("connect", async () => {
    console.log("Publisher connected to NATS");
    // const data = {
    //     "message": "test"
    // };

    // for (let i = 0; i < 1; i++) {
    //     stan.publish("test:subject", JSON.stringify(data), () => {
    //         console.log(`📤 Message ${i + 1} published`);
    //     });
    // }

    const publisher = new TicketCreatedPublisher(stan);
    try {

        await publisher.publish({
            id: "",
            title: "",
            price: 12
        })
    }
    catch (err) {
        console.error('Error publishing event:', err);
    }


}
);