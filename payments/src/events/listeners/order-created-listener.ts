import { Listener, OrderCreatedEvent, Subjects } from "@zspersonal/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/orders";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: any) {

        const order = Order.build({
            orderId: data.id,
            userId: data.userId,
            price: data.ticket.price,
            currency: 'USD',
            status: data.status
        });
        await order.save();
        msg.ack();
    }
}