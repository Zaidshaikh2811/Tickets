import request from "supertest";
import { app } from "../../app";


it("returns a 200 on successful ticket creation", async () => {
    return request(app)
        .post("/api/tickets")
        .send({
            title: "Concert",
            price: 20
        })
        .expect(200);
});
it("returns a 400 with an invalid title", async () => {
    await request(app)
        .post("/api/tickets")
        .send({
            title: "",
            price: 20
        })
        .expect(400);
});
it("returns a 400 with an invalid price", async () => {
    await request(app)
        .post("/api/tickets")
        .send({
            title: "Concert",
            price: -10
        })
        .expect(400);
});
it("returns a 400 with missing title and price", async () => {
    await request(app)
        .post("/api/tickets")
        .send({})
        .expect(400);
});
it("creates a ticket with valid inputs", async () => {
    let tickets = await request(app)
        .get("/api/tickets")
        .send();
    expect(tickets.body.length).toEqual(0);
});



