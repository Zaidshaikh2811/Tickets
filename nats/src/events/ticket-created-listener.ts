import nats, { Message } from "node-nats-streaming";
import { Listener } from "./event-listener.js";
import { TicketCreatedEvent } from "./ticket-created-event.js";
import { Subjects } from "./subjects.js";


console.clear();



export class TestListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = "order-service-queue-group";

    constructor(client: nats.Stan) {
        super(client);
    }
    listen() {
        super.listen();
    }

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        this.subject = Subjects.TicketCreated
        console.log("Parsed message data:", data);


        msg.ack();
    }

}

