import { Listener, PaymentFailedEvent, Subjects } from '@zspersonal/common';
import { orderQueueGroupName } from './queue-group-name';
import { Ticket, TicketStatus } from '../../models/tickets';

export class PaymentFailedListener extends Listener<PaymentFailedEvent> {
    subject: Subjects.PaymentFailed = Subjects.PaymentFailed;
    queueGroupName = orderQueueGroupName;
    async onMessage(data: PaymentFailedEvent['data'], msg: any) {
        const ticket = await Ticket.findById(data.ticketId);
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set({ status: TicketStatus.Failed });
        await ticket.save();
        msg.ack();
    }
}