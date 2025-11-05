import mongoose from "mongoose";
import { OrderStatus } from "@zspersonal/common";
import { TicketDoc } from "./tickets";

interface OrderAttrs {
    userId: mongoose.Schema.Types.ObjectId;
    status: OrderStatus;
    ticket: TicketDoc;
    expiresAt: Date;
}

interface OrderDoc extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId;
    status: OrderStatus;
    ticket: TicketDoc;
    expiresAt: Date;
    createdAt: string;

    updatedAt: string;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}




const orderSchema = new mongoose.Schema<OrderDoc>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Ticket"
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete (ret as any)._id;
            delete (ret as any).__v;
        }
    }
});
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };