import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent, OrderStatus } from "@zspersonal/common";
import { Ticket } from "../../model/tickets";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../model/orders";
import { OrderCreatedPublisher } from "../order-created-publisher";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price, userId, version } = data;

        const existing = await Ticket.findById(id);
        if (existing) {
            console.log(`Ticket ${id} already exists, skipping`);
            return msg.ack();
        }


        const ticket = Ticket.build({
            id,
            title,
            price,
            userId,
            version
        });
        await ticket.save();


        // const expiration = new Date();
        // expiration.setUTCMinutes(expiration.getUTCMinutes() + 1);

        // const order = Order.build({
        //     userId,
        //     status: OrderStatus.Created,
        //     expiresAt: expiration,
        //     ticket
        // });
        // await order.save();

        // await new OrderCreatedPublisher(this.client).publish({
        //     id: order.id,
        //     userId: order.userId,
        //     status: order.status,
        //     ticket: {
        //         id: ticket.id,
        //         price: ticket.price
        //     },
        //     expiresAt: expiration.toISOString(),
        //     version: order.version
        // });


        msg.ack();
    }
}