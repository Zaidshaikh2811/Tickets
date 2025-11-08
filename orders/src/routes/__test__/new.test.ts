import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../model/tickets";
import { Order } from "../../model/orders";
import { OrderStatus } from "@zspersonal/common";
import { natsWrapper } from "../../nats-wrapper";
import { incrementSafely, getCounter } from "../lock/counter";



jest.mock("../../nats-wrapper");


describe("Orders API", () => {


    it("GET /api/orders returns empty orders list", async () => {
        const res = await request(app)
            .get("/api/orders")
            .set("Cookie", global.signin())
            .expect(200);

        expect(res.body.orders).toBeDefined();
        expect(Array.isArray(res.body.orders)).toBe(true);
    });


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



        expect(response.body.order.ticket.id).toBe(ticket.id.toString());
        expect(response.body.order.status).toBe(OrderStatus.Created);
        expect(response.body.order.userId).toBeDefined();
    });


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
            .delete(`/api/orders/${createRes.body.order.id}`)
            .set("Cookie", user)
            .send()
            .expect(204);


        const updatedOrder = await Order.findById(createRes.body.order.id);
        expect(updatedOrder!.status).toBe(OrderStatus.Cancelled);
    });

    it("POST /api/orders/:orderId/pay returns success", async () => {
        const ticket = Ticket.build({
            title: "Payment Ticket",
            price: 300,
        });
        await ticket.save();



        const user = global.signin();
        const orderRes = await request(app)
            .post(`/api/orders/${ticket.id}`)
            .set("Cookie", user)
            .send()
            .expect(201);



        const payRes = await request(app)
            .post(`/api/orders/${orderRes.body.order.id}/pay`)
            .set("Cookie", user)
            .send()
            .expect(200);

        expect(payRes.body.status).toBe("Payment successful");
    });


    it("GET particular order of User", async () => {
        const ticket = Ticket.build({
            title: "User Order Ticket",
            price: 400,
        });
        await ticket.save();

        const user = global.signin();
        const orderRes = await request(app)
            .post(`/api/orders/${ticket.id}`)
            .set("Cookie", user)
            .send()
            .expect(201);

        const getRes = await request(app)
            .get(`/api/orders`)
            .set("Cookie", user)
            .send()
            .expect(200);

        expect(getRes.body.orders[0].id).toBe(orderRes.body.id);
    });




    it("Emits an order created event", async () => {
        const ticket = Ticket.build({
            title: "Event Ticket",
            price: 250,
        });
        await ticket.save();

        const user = global.signin();
        await request(app)
            .post(`/api/orders/${ticket.id}`)
            .set("Cookie", user)
            .send()
            .expect(201);

        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });

    it("Emits an order cancelled event", async () => {
        const ticket = Ticket.build({
            title: "Cancel Event Ticket",
            price: 350,
        });
        await ticket.save();
        const user = global.signin();

        const orderRes = await request(app)
            .post(`/api/orders/${ticket.id}`)
            .set("Cookie", user)
            .send()
            .expect(201);
        await request(app)
            .delete(`/api/orders/${orderRes.body.order.id}`)
            .set("Cookie", user)
            .send()
            .expect(204);
        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });


    it("correctly handles race conditions using lock", async () => {
        const parallelCalls = 50;

        await Promise.all(
            Array.from({ length: parallelCalls }).map(() => incrementSafely())
        );

        expect(getCounter()).toBe(parallelCalls);
    });


    it("handles concurrent updates correctly", async () => {
        // Create a ticket
        const ticket = Ticket.build({ title: "concert", price: 20, userId: 'testuser' });
        await ticket.save();

        // Fetch the same ticket twice (simulate two users editing at same time)
        const firstInstance = await Ticket.findById(ticket.id);
        const secondInstance = await Ticket.findById(ticket.id);

        // Make two different updates
        firstInstance!.set({ price: 100 });
        secondInstance!.set({ price: 200 });

        await firstInstance!.save();

        try {
            await secondInstance!.save();
        } catch (err) {
            return; // ✅ Test passes (error expected)
        }

        throw new Error("Should not reach this line — concurrency not handled properly");
    });

});
