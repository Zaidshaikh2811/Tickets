import { Listener, OrderCancelledEvent, Subjects } from '@zspersonal/common';
import { orderQueueGroupName } from './queue-group-name';
import { Ticket, TicketStatus } from '../../models/tickets';
import { TicketUpdatedPublisher } from '../publisher/ticker-updated-publihser';




export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = orderQueueGroupName;
    async onMessage(data: OrderCancelledEvent['data'], msg: any) {


        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set({ orderId: undefined, status: TicketStatus.Expired });
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: undefined,
            version: ticket.version,
            status: ticket.status,
        });

        msg.ack();
    }
}

