import request from "supertest";
import { app } from "../../app";
import { createOrder } from "../../test/createOrder";

// it("requires admin access", async () => {
//     const cookie = global.signin();

//     await request(app)
//         .get("/api/payments/user/payments")
//         .set("Cookie", cookie)
//         .expect(403);
// });

it("returns all orders for admins", async () => {
    const userId = "adminUser";
    const cookie = global.signin(userId);
    await createOrder(userId);
    await createOrder(userId);

    const res = await request(app)
        .get("/api/payments/user/payments")
        .set("Cookie", cookie)
        .expect(200);


    expect(res.body.orders.length).toBe(2);
});
