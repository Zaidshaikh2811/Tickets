import { Subjects, Publisher, OrderCancelledEvent } from "@zspersonal/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}