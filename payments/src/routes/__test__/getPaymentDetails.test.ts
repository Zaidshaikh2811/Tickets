import request from "supertest";
import { app } from "../../app";
import { createOrder } from "../../test/createOrder";

it("returns payment details", async () => {
    const userId = "u123";
    const cookie = global.signin(userId);

    const order = await createOrder(userId);

    const res = await request(app)
        .get(`/api/payments/${order.id}/details`)
        .set("Cookie", cookie)
        .expect(200);

    expect(res.body.orderId).toBe(order.id);
});
