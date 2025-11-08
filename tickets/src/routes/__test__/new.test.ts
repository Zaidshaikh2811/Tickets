import { Request, Response } from "express";
import { addTicket, getTickets, updateTicket, deleteTicket, getParticularTicket } from "../../controller/ticketsController";
import { Ticket } from "../../models/tickets";
import { CustomError, Subjects } from "@zspersonal/common";
import { OutboxEvent } from "../../models/outbox";
import { natsWrapper } from "../../__mocks__/nats-wrapper";
import { app } from "../../app";
import request from "supertest";
import mongoose from "mongoose";



jest.mock("../../nats-wrapper");

const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
}

describe("Ticket Controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create a new ticket", async () => {
        await request(app)
            .post("/api/tickets")
            .send({ title: "Concert", price: 100 })
            .set("Cookie", global.signin())
            .expect(201);

        const tickets = await Ticket.find({});
        expect(tickets.length).toBe(1);
        expect(tickets[0].title).toBe("Concert");
    });

    it("creates a ticket and an outbox event", async () => {
        const title = "Concert";
        const price = 200;

        await request(app)
            .post("/api/tickets")
            .send({ title, price })
            .set("Cookie", global.signin())
            .expect(201);

        const ticket = await Ticket.findOne({});
        expect(ticket).not.toBeNull();

        const outbox = await OutboxEvent.findOne({});


        expect(outbox).not.toBeNull();
        expect(outbox!.eventType).toBe(Subjects.TicketCreated);



        expect(outbox!.data.id).toBe((ticket!.id));
        expect(outbox?.data.title).toBe(title);
        expect(outbox?.data.price).toBe(price);


        expect(natsWrapper.client.publish).not.toHaveBeenCalled();
    });


    it("should throw error if title or price missing", async () => {
        const req = {
            body: { title: "" },
            currentUser: { id: "69044e182f066d6798373402" }
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnValue(this),
            json: jest.fn(),
        } as any as Response;



        await expect(addTicket(req, res)).rejects.toThrow(CustomError);


    });

    it("should throw error if user not logged in", async () => {
        const req = {
            body: { title: "Event", price: 50 },
        } as unknown as Request;
        const res = mockResponse();

        await expect(addTicket(req, res)).rejects.toThrow(CustomError);
    });

    it("should return list of tickets", async () => {

        await Ticket.create({ title: "A", price: 10, userId: "123" });
        await Ticket.create({ title: "B", price: 20, userId: "123" });

        const req = {} as Request;
        const res = mockResponse();

        await getTickets(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                count: 2,
                data: expect.arrayContaining([
                    expect.objectContaining({ title: "A" }),
                    expect.objectContaining({ title: "B" })
                ])
            })
        );
    });

    it("should get particular ticket", async () => {

        const ticket = await Ticket.create(
            { title: "Special Event", price: 75, userId: "69044e182f066d6798373402" }
        );


        const req = { params: { id: ticket.id } } as unknown as Request;
        const res = mockResponse();


        await getParticularTicket(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: expect.objectContaining({
                id: ticket.id,
                title: "Special Event"
            })
        });
    });

    it("should throw 404 if ticket not found", async () => {
        const nonExistingId = new mongoose.Types.ObjectId().toHexString();
        const req = { params: { id: nonExistingId } } as unknown as Request;
        const res = mockResponse();


        await expect(getParticularTicket(req, res)).rejects.toThrow(CustomError);
    });

    it("should update a ticket", async () => {
        const userCookie = global.signin();
        const createRes = await request(app)
            .post("/api/tickets")
            .set("Cookie", userCookie)
            .send({ title: "Special Event", price: 100 })
            .expect(201);


        const ticketId = createRes.body.data.id;



        const updateRes = await request(app)
            .put(`/api/tickets/${ticketId}`)
            .set("Cookie", userCookie)
            .send({ price: 150 })
            .expect(200);



        expect(updateRes.body.success).toBe(true);
        expect(updateRes.body.data.price).toBe(150);
        expect(updateRes.body.data.title).toBe("Special Event");

        // option B: verify DB directly
        const ticketFromDb = await Ticket.findById(ticketId);
        expect(ticketFromDb).toBeTruthy();
        expect(ticketFromDb!.price).toBe(150);
        expect(ticketFromDb!.title).toBe("Special Event");
    });

    it("should throw 404 when updating non-existent ticket", async () => {

        const nonExistingId = new mongoose.Types.ObjectId().toHexString();
        const userCookie = global.signin();
        const res = await request(app)
            .put(`/api/tickets/${nonExistingId}`)
            .set("Cookie", userCookie)
            .send({ price: 150 })
            .expect(404);

        expect(res.body.errors[0].message).toMatch(/not found/);

    });

    it("should delete a ticket", async () => {
        const userCookie = global.signin();
        const createRes = await request(app)
            .post("/api/tickets")
            .set("Cookie", userCookie)
            .send({ title: "Event to Delete", price: 80 })
            .expect(201);
        const ticketId = createRes.body.data.id;
        const deleteRes = await request(app)
            .delete(`/api/tickets/${ticketId}`)
            .set("Cookie", userCookie)
            .expect(200);
        expect(deleteRes.body.message).toBe("Ticket deleted successfully");
    });

    it("should throw 404 if ticket not found for delete", async () => {
        const nonExistingId = new mongoose.Types.ObjectId().toHexString();
        const userCookie = global.signin();
        const res = await request(app)
            .delete(`/api/tickets/${nonExistingId}`)
            .set("Cookie", userCookie)
            .expect(404);
        expect(res.body.errors[0].message).toMatch(/not found/);
    });









    it("creates a ticket + outbox event without publishing to NATS", async () => {
        const title = "Concert";
        const price = 199;

        const response = await request(app)
            .post("/api/tickets")
            .send({ title, price })
            .set("Cookie", global.signin())
            .expect(201);

        const ticket = await Ticket.findOne({});
        expect(ticket).not.toBeNull();
        expect(ticket!.title).toBe(title);
        expect(ticket!.price).toBe(price);

        // ✅ Outbox saved
        const outbox = await OutboxEvent.findOne({});
        expect(outbox).not.toBeNull();
        expect(outbox!.eventType).toBe(Subjects.TicketCreated);
        expect(outbox!.data.title).toBe(title);
        expect(outbox!.data.price).toBe(price);

        // ✅ Should NOT publish directly in controller
        const { natsWrapper } = require("../../nats-wrapper");
        expect(natsWrapper.client.publish).not.toHaveBeenCalled();
    });

    it("throws error if title or price missing", async () => {
        const res = await request(app)
            .post("/api/tickets")
            .send({ title: "" })
            .set("Cookie", global.signin())
            .expect(400);

        expect(res.body.errors[0].message).toMatch(/required/);
    });


    it("throws error if user not logged in", async () => {
        await request(app)
            .post("/api/tickets")
            .send({ title: "Event", price: 50 })
            .expect(401);
    });

    it("calls Ticket.build with correct args", async () => {
        const title = "Theater Play";
        const price = 75;
        await request(app)
            .post("/api/tickets")
            .send({ title, price })
            .set("Cookie", global.signin())
            .expect(201);
        const ticket = await Ticket.findOne({});
        expect(ticket).not.toBeNull();
        expect(ticket!.title).toBe(title);
        expect(ticket!.price).toBe(price);
    });

    it("creates outbox BEFORE responding", async () => {
        const title = "Stage Show";
        const price = 999;

        await request(app)
            .post("/api/tickets")
            .send({ title, price })
            .set("Cookie", global.signin())
            .expect(201);

        const ticket = await Ticket.findOne({});
        const outbox = await OutboxEvent.findOne({});

        expect(outbox!.data.id).toBe(ticket!.id);
    });

    it("does not create duplicate outbox events", async () => {
        const title = "Magic Show";
        const price = 50;

        const cookie = global.signin();

        await request(app)
            .post("/api/tickets")
            .send({ title, price })
            .set("Cookie", cookie)
            .expect(201);

        await request(app)
            .post("/api/tickets")
            .send({ title, price })
            .set("Cookie", cookie)
            .expect(201);

        const outboxes = await OutboxEvent.find({});
        expect(outboxes.length).toBe(2); // 2 different requests
    });

    it("handles high concurrency ticket creation", async () => {
        const cookie = global.signin();

        const tasks = [];
        for (let i = 0; i < 20; i++) {
            tasks.push(
                request(app)
                    .post("/api/tickets")
                    .send({ title: `Ticket-${i}`, price: i + 1 })
                    .set("Cookie", cookie)
            );
        }

        const results = await Promise.all(tasks);

        results.forEach((res) => expect(res.status).toBe(201));

        const count = await Ticket.countDocuments();
        expect(count).toBe(20);
    });



});
