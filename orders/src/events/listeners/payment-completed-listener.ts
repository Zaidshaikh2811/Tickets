import { Subjects, Listener, PaymentCompletedEvent, OrderStatus } from "@zspersonal/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../model/orders";

export class PaymentCompletedListener extends Listener<PaymentCompletedEvent> {
    readonly subject = Subjects.PaymentCompleted
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCompletedEvent["data"], msg: any) {
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