import request from "supertest";
import { app } from "../../app";
import { createOrder } from "../../test/createOrder";

it("allows discount on valid order", async () => {
    const userId = "u1";
    const cookie = global.signin(userId);

    const order = await createOrder(userId);

    const res = await request(app)
        .post("/api/payments/apply-discount")
        .set("Cookie", cookie)
        .send({ orderId: order.id, discountCode: "SAVE10" })
        .expect(200);
    console.log("Order:", res.body);
    console.log("Order:", order);


    expect(res.body.orderId).toBe(order.orderId);
});
