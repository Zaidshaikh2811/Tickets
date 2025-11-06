import { Publisher, OrderCreatedEvent, Subjects } from '@zspersonal/common';


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}