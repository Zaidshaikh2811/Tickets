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
        if (order.status === OrderStatus.Completed) {
            console.log(
                `Order with id: ${order.id} is already completed. No action taken.`
            );
            return;
        }
        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.ticket.id.toString(),
            ticket: {
                id: order.ticket.id.toString(),
                price: (order.ticket as any).price
            },
            version: order.version
        });

        msg.ack();
    }
}