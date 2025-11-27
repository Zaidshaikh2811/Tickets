import { Listener, PaymentCompletedEvent, Subjects } from '@zspersonal/common';
import { orderQueueGroupName } from './queue-group-name';
import { Ticket, TicketStatus } from '../../models/tickets';

export class PaymentCompletedListener extends Listener<PaymentCompletedEvent> {

    subject: Subjects.PaymentCompleted = Subjects.PaymentCompleted;
    queueGroupName = orderQueueGroupName;
    async onMessage(data: PaymentCompletedEvent['data'], msg: any) {
        console.log("Calling Payment Completed Listener", data);
        const ticket = await Ticket.findById(data.ticketId);
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set({ status: TicketStatus.Completed });
        await ticket.save();
        msg.ack();
    }
}