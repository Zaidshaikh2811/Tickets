import request from "supertest";
import { app } from "../../app";
import { createOrder } from "../../test/createOrder";

it("returns only the current user's payments", async () => {
    const user1 = "u1";
    const user2 = "u2";

    await createOrder(user1);
    await createOrder(user2);

    const cookie = global.signin(user1);

    const res = await request(app)
        .get("/api/payments/user-payments")
        .set("Cookie", cookie)
        .expect(200);
    console.log(res.body);



    expect(res.body.orders.length).toBe(1);
});
