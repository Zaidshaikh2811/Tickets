import request from "supertest";
import { app } from "../../app";
import { createOrder } from "../../test/createOrder";
import { OrderStatus } from "@zspersonal/common";

it("cancels awaiting payment", async () => {
    const userId = "u123";
    const cookie = global.signin(userId);

    const order = await createOrder(userId, OrderStatus.AwaitingPayment);

    const res = await request(app)
        .post("/api/payments/cancel")
        .set("Cookie", cookie)
        .send({ orderId: order.id })
        .expect(200);
    console.log(res.body);
    console.log(OrderStatus.Cancelled);


    expect(res.body.order.status).toBe(OrderStatus.Cancelled);
});
