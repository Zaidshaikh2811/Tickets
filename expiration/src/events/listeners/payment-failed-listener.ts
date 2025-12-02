import { Listener, PaymentFailedEvent, Subjects } from "@zspersonal/common";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queue/expiration-queue";

export class PaymentFailedListener extends Listener<PaymentFailedEvent> {
    subject: Subjects.PaymentFailed = Subjects.PaymentFailed;
    queueGroupName = queueGroupName;
    async onMessage(data: PaymentFailedEvent["data"], msg: any) {

        const job = await expirationQueue.getJob(data.orderId);
        if (job) {
            await job.remove();
        }
        msg.ack();
    }
}