import mongoose from "mongoose";
import { Order } from "./orders";
import { OrderStatus } from "@zspersonal/common";

interface TicketAttrs {
    id: string;
    userId: string;
    title: string;
    price: number;
    version: number;
}


export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
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
    optimisticConcurrency: true,
    versionKey: "version",
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete (ret as any)._id;
            delete (ret as any).__v;
        }
    }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price,
        userId: attrs.userId,
        version: attrs.version
    });
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