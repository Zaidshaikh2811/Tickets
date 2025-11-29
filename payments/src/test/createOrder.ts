import { Order } from "../models/orders";
import mongoose from "mongoose";
import { OrderStatus } from "@zspersonal/common";

export const createOrder = async (userId: string, status = OrderStatus.AwaitingPayment) => {
    return Order.build({
        orderId: new mongoose.Types.ObjectId().toHexString(),
        userId,
        price: 500,
        currency: "INR",
        status,
        ticketId: new mongoose.Types.ObjectId().toHexString(),
    }).save();
};
