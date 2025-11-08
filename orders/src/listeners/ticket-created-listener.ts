import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent, OrderStatus } from "@zspersonal/common";
import { Ticket } from "../model/tickets";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../model/orders";
import mongoose from "mongoose";


export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price, userId, version } = data;

        const ticket = Ticket.build({
            id,
            title,
            price,
            userId,
            version
        });
        await ticket.save();

        console.log("Ticket Saved");

        const expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 15);

        console.log("Ticket Expiration Set:", expiration);

        const order = Order.build({
            userId,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket,
            version
        });
        await order.save();

        // await new OrderCreatedPublisher(natsWrapper.client).publish({
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

        console.log("Order Created:", order);

        msg.ack();
    }
}