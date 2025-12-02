import request from "supertest";
import { app } from "../../app";
import { createOrder } from "../../test/createOrder";
import { OrderStatus } from "@zspersonal/common";

it("retries pending order", async () => {

    const userId = "u123";
    const cookie = global.signin(userId);

    const order = await createOrder(userId, OrderStatus.Pending);

    const res = await request(app)
        .post("/api/payments/retry")
        .set("Cookie", cookie)
        .send({ orderId: order.id, paymentMethod: "stripe" })
        .expect(200);




    expect(res.body.order.status).toBe(OrderStatus.Completed);
})