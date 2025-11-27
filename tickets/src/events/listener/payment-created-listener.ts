import { Listener, PaymentCreatedEvent, Subjects } from '@zspersonal/common';
import { orderQueueGroupName } from './queue-group-name';
import { Ticket, TicketStatus } from '../../models/tickets';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = orderQueueGroupName;
    async onMessage(data: PaymentCreatedEvent['data'], msg: any) {
        const ticket = await Ticket.findById(data.ticketId);
        if (!ticket) {
            throw new Error('Ticket not found or have been deleted');
        }
        ticket.set({ status: TicketStatus.Reserved });
        await ticket.save();
        msg.ack();

    }
}