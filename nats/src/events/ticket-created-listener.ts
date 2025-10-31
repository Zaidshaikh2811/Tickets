import nats, { Message } from "node-nats-streaming";
import { Listener } from "./event-listener";
console.clear();



export class TestListener extends Listener {
    subject = "test:subject";
    queueGroupName = "order-service-queue-group";

    constructor(client: nats.Stan) {
        super(client);
    }
    listen() {
        super.listen();
    }

    onMessage(data: any, msg: Message) {
        console.log("Parsed message data:", data);

        msg.ack();
    }

}

