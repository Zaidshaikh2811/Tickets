import request from "supertest";
import { app } from "../../app";
import { createOrder } from "../../test/createOrder";
import { OrderStatus } from "@zspersonal/common";
import { Payment } from "../../models/payment";

it("refunds a completed order", async () => {
    const userId = "abc123";
    const cookie = global.signin(userId);

    const order = await createOrder(userId, OrderStatus.Completed);


    // save payment to DB
    const payment = new Payment({
        orderId: order.id,
        stripeId: "test_stripe_id_12345"
    });
    await payment.save();


    const res = await request(app)
        .post("/api/payments/refund")
        .set("Cookie", cookie)
        .send({ orderId: order.id })
        .expect(200);




    expect(res.body.order.status).toBe(OrderStatus.Refunded);
});
