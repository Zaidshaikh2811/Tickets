import { Publisher, PaymentFailedEvent, Subjects } from '@zspersonal/common';

export class PaymentFailedPublisher extends Publisher<PaymentFailedEvent> {
    readonly subject = Subjects.PaymentFailed;
}