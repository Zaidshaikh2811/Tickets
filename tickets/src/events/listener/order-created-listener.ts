import { Listener, OrderCreatedEvent, Subjects } from '@zspersonal/common';
import { orderQueueGroupName } from './queue-group-name';
import { Ticket, TicketStatus } from '../../models/tickets';
import { TicketUpdatedPublisher } from '../publisher/ticker-updated-publihser';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
    queueGroupName = orderQueueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: any) {
        try {

            console.log(
                `[OrderCreatedListener] Received OrderCreated event for Order ID: ${data.id}`
            );
            const { id, status, userId, expiresAt, ticket, version } = data;


            const ticketId = ticket.id;
            console.log("OrderCreatedListener ticketId:", ticketId, "version:", version);
            const existingTicket = await Ticket.findById(ticket.id);

            if (!existingTicket) {
                console.warn(
                    `[OrderCreatedListener] Ticket ${data.ticket.id} not found or version mismatch`
                );
                throw new Error('Ticket not found');
            }



            existingTicket.set({ orderId: id, status: TicketStatus.Reserved });
            await existingTicket.save();
            await new TicketUpdatedPublisher(this.client).publish({
                id: existingTicket.id,
                title: existingTicket.title,
                price: existingTicket.price,
                userId: existingTicket.userId,
                orderId: existingTicket.orderId || '',

                version: existingTicket.version,
            });

            msg.ack();
        } catch (error) {
            console.error(
                `[OrderCreatedListener] Error processing OrderCreated event: ${error}`
            );
        }
    }
}