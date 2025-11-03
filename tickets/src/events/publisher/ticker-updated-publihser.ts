import { Publisher, Subjects, TicketUpdatedEvent } from "@zspersonal/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}