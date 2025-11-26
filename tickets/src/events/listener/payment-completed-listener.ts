import { Listener, PaymentCompletedEvent, Subjects } from '@zspersonal/common';
import { orderQueueGroupName } from './queue-group-name';
import { Ticket, TicketStatus } from '../../models/tickets';

export class PaymentCompletedListener extends Listener<PaymentCompletedEvent> {
    subject: Subjects.PaymentCompleted = Subjects.PaymentCompleted;
    queueGroupName = orderQueueGroupName;
    async onMessage(data: PaymentCompletedEvent['data'], msg: any) {
        const ticket = await Ticket.findById(data.orderId);
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set({ status: TicketStatus.Completed });
        await ticket.save();
        msg.ack();
    }
}