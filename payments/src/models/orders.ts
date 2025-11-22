import mongoose from 'mongoose';
import { OrderStatus } from '@zspersonal/common';
const { Schema } = mongoose;

interface OrderAttrs {
    orderId: string;
    userId: string;
    price: number;
    currency: string;
    status: OrderStatus;
}

const OrderSchema = new Schema({
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    currency: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        minlength: 3,
        maxlength: 3,
    },
    status: { type: String, required: true, enum: Object.values(OrderStatus) },
    version: { type: Number, default: 0 }
}, {
    toJSON: {
        virtuals: true,
        transform(doc: any, ret: any) {
            ret.id = ret.id;
            ret.orderId = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    },
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version'
});


interface OrderDoc extends mongoose.Document {
    id: string;
    orderId: string;
    userId: string;
    price: number;
    currency: string;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    version: number;
}

OrderSchema.virtual('orderId').get(function () {
    return this._id;
});

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

OrderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.orderId,
        userId: attrs.userId,
        price: attrs.price,
        currency: attrs.currency,
        status: attrs.status
    });
};



const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);

export { Order, OrderAttrs, OrderDoc };