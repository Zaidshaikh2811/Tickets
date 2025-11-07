import { Request, Response } from "express";
import { addTicket, getTickets, updateTicket, deleteTicket, getParticularTicket } from "../../controller/ticketsController";
import { Ticket } from "../../models/tickets";
import { CustomError } from "@zspersonal/common";
import { OutboxEvent } from "../../models/outbox";
import { natsWrapper } from "../../__mocks__/nats-wrapper";
import { app } from "../../app";
import request from "supertest";

jest.mock("../../models/tickets");

jest.mock("../../nats-wrapper");

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("Ticket Controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // ---------- addTicket ----------
    // it("should create a new ticket", async () => {
    //     const req = {
    //         body: { title: "Concert", price: 100 },
    //         currentUser: {
    //             id: "69044e182f066d6798373402"

    //         }
    //     } as unknown as Request;

    //     const res = mockResponse();

    //     const saveMock = jest.fn();
    //     (Ticket.build as jest.Mock).mockReturnValue({ save: saveMock });

    //     await addTicket(req, res);

    //     expect(Ticket.build).toHaveBeenCalledWith({
    //         title: "Concert",
    //         price: 100,
    //         userId: "69044e182f066d6798373402"
    //     });
    //     expect(saveMock).toHaveBeenCalled();
    //     expect(res.status).toHaveBeenCalledWith(201);
    //     expect(res.json).toHaveBeenCalled();
    // });

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
        expect(outbox!.eventType).toBe("TicketCreated");


        expect(outbox!.data.id).toBe(ticket!.id);
        expect(outbox!.data.title).toBe(title);
        expect(outbox!.data.price).toBe(price);


        expect(natsWrapper.client.publish).not.toHaveBeenCalled();
    });


    // it("should throw error if title or price missing", () => {
    //     const req = {
    //         body: { title: "" },
    //         currentUser: { id: "user123" }
    //     } as unknown as Request;
    //     const res = mockResponse();

    //     expect(() => addTicket(req, res)).toThrow(CustomError);
    // });

    // it("should throw error if user not logged in", () => {
    //     const req = {
    //         body: { title: "Event", price: 50 },
    //     } as unknown as Request;
    //     const res = mockResponse();

    //     expect(() => addTicket(req, res)).toThrow(CustomError);
    // });

    // // ---------- getTickets ----------
    // it("should return list of tickets", async () => {
    //     const req = {} as Request;
    //     const res = mockResponse();

    //     (Ticket.find as jest.Mock).mockReturnValue({
    //         sort: jest.fn().mockReturnValue([{ title: "A" }, { title: "B" }])
    //     });

    //     await getTickets(req, res);

    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith({
    //         count: 2,
    //         data: [{ title: "A" }, { title: "B" }]
    //     });
    // });

    // // ---------- getParticularTicket ----------
    // it("should get particular ticket", async () => {
    //     const req = { params: { id: "123" } } as unknown as Request;
    //     const res = mockResponse();

    //     (Ticket.findById as jest.Mock).mockResolvedValue({ id: "123", title: "Test" });

    //     await getParticularTicket(req, res);

    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalled();
    // });

    // it("should throw 404 if ticket not found", async () => {
    //     const req = { params: { id: "123" } } as unknown as Request;
    //     const res = mockResponse();

    //     (Ticket.findById as jest.Mock).mockResolvedValue(null);

    //     await expect(getParticularTicket(req, res)).rejects.toThrow(CustomError);
    // });

    // // ---------- updateTicket ----------
    // it("should update a ticket", async () => {
    //     const req = {
    //         params: { id: "123" },
    //         body: { price: 150 }
    //     } as unknown as Request;
    //     const res = mockResponse();

    //     (Ticket.findByIdAndUpdate as jest.Mock).mockResolvedValue({
    //         id: "123",
    //         title: "Updated",
    //         price: 150
    //     });

    //     await updateTicket(req, res);

    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith({
    //         message: "Ticket updated successfully",
    //         data: { id: "123", title: "Updated", price: 150 }
    //     });
    // });

    // it("should throw 404 when updating non-existent ticket", async () => {
    //     const req = { params: { id: "999" }, body: {} } as unknown as Request;
    //     const res = mockResponse();

    //     (Ticket.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    //     await expect(updateTicket(req, res)).rejects.toThrow(CustomError);
    // });

    // // ---------- deleteTicket ----------
    // it("should delete a ticket", async () => {
    //     const req = { params: { id: "123" } } as unknown as Request;
    //     const res = mockResponse();

    //     (Ticket.findByIdAndDelete as jest.Mock).mockResolvedValue({ id: "123" });

    //     await deleteTicket(req, res);

    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith({
    //         message: "Ticket deleted successfully",
    //         data: { id: "123" }
    //     });
    // });

    // it("should throw 404 if ticket not found for delete", async () => {
    //     const req = { params: { id: "123" } } as unknown as Request;
    //     const res = mockResponse();

    //     (Ticket.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    //     await expect(deleteTicket(req, res)).rejects.toThrow(CustomError);
    // });
});
