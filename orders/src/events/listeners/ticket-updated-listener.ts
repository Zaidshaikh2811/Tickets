import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@zspersonal/common";
import { Ticket } from "../../model/tickets";
import { queueGroupName } from "./queue-group-name";


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { id, title, price, userId, version } = data;

        const ticket = await Ticket.findOne({
            _id: id,
            version: version - 1,
        });

        if (!ticket) {
            throw new Error("Ticket not found");
        }

        ticket.set({
            title,
            price,
            userId,
        });
        await ticket.save();

        msg.ack();
    }
}