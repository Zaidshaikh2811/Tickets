import { ExpirationCompleteEvent, Publisher, Subjects } from '@zspersonal/common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;

}