import { OrderCancelledEvent, Subjects, Listener, OrderStatus } from "@zspersonal/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/orders";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: any) {
        const order = await Order.findOne({ orderId: data.id });

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        console.log(`Order with ID ${data.id} has been cancelled.`);
        msg.ack();
    }
}