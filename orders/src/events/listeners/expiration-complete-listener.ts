import { Listener, Subjects, ExpirationCompleteEvent, OrderStatus } from "@zspersonal/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../model/orders";
import { OrderCancelledPublisher } from "../order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;
    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        console.log(
            `Expiration complete event received for orderId: ${data.orderId}`
        );
        const order = await Order.findById(data.orderId).populate("ticket");
        if (!order) {
            throw new Error("Order not found");
        }
        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id.toString(),
            ticket: { id: order.ticket.id.toString(), price: order.ticket.price },
            version: order.version,
            status: order.status,
            userId: order.userId.toString(),
            expiresAt: order.expiresAt.toISOString()
        });

        msg.ack();
    }
}