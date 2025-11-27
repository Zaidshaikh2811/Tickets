import { Listener, PaymentCompletedEvent, Subjects } from "@zspersonal/common";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queue/expiration-queue";

export class PaymentCompletedListener extends Listener<PaymentCompletedEvent> {
    subject: Subjects.PaymentCompleted = Subjects.PaymentCompleted;
    queueGroupName = queueGroupName;
    async onMessage(data: PaymentCompletedEvent["data"], msg: any) {
        console.log("Payment Completed Event Data:", data);
        console.log("Removing expiration job for orderId:", data.orderId);
        const job = await expirationQueue.getJob(data.orderId);

        if (job) {
            await job.remove();
        }

        msg.ack();
    }
}