import request from "supertest";
import { app } from "../../app";
import { createOrder } from "../../test/createOrder";
import { OrderStatus } from "@zspersonal/common";

it("refunds a completed order", async () => {
    const userId = "abc123";
    const cookie = global.signin(userId);

    const order = await createOrder(userId, OrderStatus.Completed);

    const res = await request(app)
        .post("/api/payments/refund")
        .set("Cookie", cookie)
        .send({ orderId: order.id })
        .expect(200);

    expect(res.body.status).toBe(OrderStatus.Refunded);
});
