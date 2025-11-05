import mongoose from "mongoose";
import { Order } from "./orders";
import { OrderStatus } from "@zspersonal/common";

interface TicketAttrs {

    title: string;
    price: number;

}

export interface TicketDoc extends mongoose.Document {

    title: string;
    price: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    isReserved(): Promise<boolean>;
}

const ticketSchema = new mongoose.Schema<TicketDoc>({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete (ret as any)._id;
            delete (ret as any).__v;
        }
    }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Completed
            ]
        }
    });

    return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };