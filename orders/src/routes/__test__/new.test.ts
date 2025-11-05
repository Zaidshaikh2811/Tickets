import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../model/tickets";
import { Order } from "../../model/orders";
import { OrderStatus } from "@zspersonal/common";

describe("Orders API", () => {

    // ✅ GET /api/orders
    it("GET /api/orders returns empty orders list", async () => {
        const res = await request(app)
            .get("/api/orders")
            .set("Cookie", global.signin())
            .expect(200);

        expect(res.body.orders).toBeDefined();
        expect(Array.isArray(res.body.orders)).toBe(true);
    });

    // // ✅ POST /api/orders/:ticketId  → creates new order
    it("POST /api/orders/:ticketId creates an order", async () => {
        const ticket = Ticket.build({
            title: "Sample Ticket",
            price: 150
        });
        await ticket.save();

        const response = await request(app)
            .post(`/api/orders/${ticket.id}`)
            .set("Cookie", global.signin())
            .send()
            .expect(201);

        expect(response.body.ticket.id).toBe(ticket.id);
        expect(response.body.status).toBe(OrderStatus.Created);
        expect(response.body.userId).toBeDefined();
    });

    // // ✅ Ticket reservation logic test
    it("returns 400 if ticket is already reserved", async () => {
        const ticket = Ticket.build({
            title: "Concert Ticket",
            price: 200
        });
        await ticket.save();

        // create existing order
        const order = Order.build({
            ticket,
            userId: new mongoose.Types.ObjectId().toHexString() as any,
            status: OrderStatus.Created,
            expiresAt: new Date()
        });

        await order.save();

        const response = await request(app)
            .post(`/api/orders/${ticket.id}`)
            .set("Cookie", global.signin())
            .send()
            .expect(400);

        expect(response.body.errors[0].message).toBe("Ticket is already reserved");
    });


    it("GET /api/orders/:orderId returns 404 when order not found", async () => {
        const id = new mongoose.Types.ObjectId().toHexString();

        const response = await request(app)
            .get(`/api/orders/${id}`)
            .set("Cookie", global.signin())
            .send()
            .expect(404);

        expect(response.body.errors[0].message).toBe("Order not found");
    });

    // ✅ DELETE /api/orders/:orderId cancels order
    it("DELETE /api/orders/:orderId cancels an order", async () => {
        const ticket = Ticket.build({

            title: "Delete Test Ticket",
            price: 50
        });
        await ticket.save();

        const user = global.signin();

        const createRes = await request(app)
            .post(`/api/orders/${ticket.id}`)
            .set("Cookie", user)
            .send()
            .expect(201);

        await request(app)
            .delete(`/api/orders/${createRes.body.id}`)
            .set("Cookie", user)
            .send()
            .expect(204);

        // Expect order to be canceled
        const updatedOrder = await Order.findById(createRes.body.id);
        expect(updatedOrder!.status).toBe(OrderStatus.Cancelled);
    });

    // ✅ POST /api/orders/:orderId/pay returns payment success
    it("POST /api/orders/:orderId/pay returns success", async () => {
        const ticket = Ticket.build({
            title: "Payment Ticket",
            price: 300,
        });
        await ticket.save();
        console.log(ticket.id);


        const user = global.signin();
        const orderRes = await request(app)
            .post(`/api/orders/${ticket.id}`)
            .set("Cookie", user)
            .send()
            .expect(201);

        const payRes = await request(app)
            .post(`/api/orders/${orderRes.body.id}/pay`)
            .set("Cookie", user)
            .send()
            .expect(200);

        expect(payRes.body.status).toBe("Payment successful");
    });

});
