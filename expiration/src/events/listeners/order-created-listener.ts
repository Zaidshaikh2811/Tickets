import { Listener, OrderCreatedEvent, Subjects } from "@zspersonal/common";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queue/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent["data"], msg: any) {
        const delay = Math.max(0, new Date(data.expiresAt).getTime() - Date.now());



        console.log("Adding job to expiration queue for orderId:", data.id, "with delay:", delay);
        await expirationQueue.add({
            orderId: data.id,
        }, {
            delay
        });
        msg.ack();
    }
}