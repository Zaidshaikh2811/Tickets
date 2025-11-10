import { Listener, OrderCreatedEvent, Subjects } from "@zspersonal/common";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queue/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent["data"], msg: any) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log("Order Created Event Data:", data);
        console.log("Delay:", delay);


        await expirationQueue.add({
            orderId: data.id,
        }, {
            delay: delay,
        });
        msg.ack();
    }
}