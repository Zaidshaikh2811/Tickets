import { Publisher, PaymentCreatedEvent, Subjects } from '@zspersonal/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}