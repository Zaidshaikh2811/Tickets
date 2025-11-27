import { Subjects, Listener, PaymentFailedEvent, OrderStatus } from "@zspersonal/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../model/orders";

export class PaymentFailedListener extends Listener<PaymentFailedEvent> {
    readonly subject = Subjects.PaymentFailed
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentFailedEvent["data"], msg: any) {
        const { orderId } = data;

        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error("Order not found");
        }
        order.set({ status: OrderStatus.Failed });
        await order.save();
        msg.ack();
    }
}