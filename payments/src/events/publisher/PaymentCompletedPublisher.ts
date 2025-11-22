import { Publisher, PaymentCompletedEvent, Subjects } from '@zspersonal/common';

export class PaymentCompletedPublisher extends Publisher<PaymentCompletedEvent> {
    readonly subject = Subjects.PaymentCompleted;
}