import request from "supertest";
import { app } from "../../app";
import { createOrder } from "../../test/createOrder";
import { OrderStatus } from "@zspersonal/common";
import mongoose from "mongoose";

it("fails if not authenticated", async () => {
    await request(app).post("/api/payments").send({}).expect(401);
});

it("returns 404 if order not found", async () => {
    const cookie = global.signin();

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({ orderId: new mongoose.Types.ObjectId().toHexString(), paymentMethod: "paypal" })
        .expect(404);
});

it("fails if order does not belong to user", async () => {
    const order = await createOrder("userA");

    const cookie = global.signin("userB");

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({ orderId: order.id, paymentMethod: "paypal" })
        .expect(401);
});

it("fails if order is cancelled", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = await createOrder(userId, OrderStatus.Cancelled);

    const cookie = global.signin(userId);

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({ orderId: order.id, paymentMethod: "paypal" })
        .expect(400);
});

it("completes payment for a valid order", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = await createOrder(userId, OrderStatus.AwaitingPayment);

    const cookie = global.signin(userId);

    const res = await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({ orderId: order.id, paymentMethod: "paypal" })
        .expect(200);

    expect(res.body.order.status).toBe(OrderStatus.Completed);
});
