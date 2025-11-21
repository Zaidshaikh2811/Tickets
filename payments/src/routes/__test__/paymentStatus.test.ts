import request from "supertest";
import { app } from "../../app";
import { createOrder } from "../../test/createOrder";

it("returns status for owner's order", async () => {
    const userId = "user123";
    const cookie = global.signin(userId);

    const order = await createOrder(userId);

    const res = await request(app)
        .get(`/api/payments/${order.id}/status`)
        .set("Cookie", cookie)
        .expect(200);

    expect(res.body.status).toBe(order.status);
});
