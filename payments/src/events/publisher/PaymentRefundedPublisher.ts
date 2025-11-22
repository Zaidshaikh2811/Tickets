import { Publisher, PaymentRefundedEvent, Subjects } from '@zspersonal/common';

export class PaymentRefundedPublisher extends Publisher<PaymentRefundedEvent> {
    readonly subject = Subjects.PaymentRefunded;
}