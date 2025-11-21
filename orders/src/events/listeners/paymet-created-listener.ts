import { Subjects, Listener, PaymentCreatedEvent, OrderStatus } from "@zspersonal/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../model/orders";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent["data"], msg: any) {
        const { orderId } = data;

        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error("Order not found");
        }
        order.set({ status: OrderStatus.Completed });
        await order.save();
        msg.ack();
    }
}