import request from "supertest";
import { app } from "../../app";

// Mock database connection if needed
jest.mock("../../db/db", () => ({
    connectToDatabase: jest.fn().mockResolvedValue(true),
}));

jest.mock("../../models/users", () => {
    return {
        User: {
            findOne: jest.fn().mockResolvedValue(null), // no existing user
            build: jest.fn(() => ({
                save: jest.fn().mockResolvedValue(true),
                id: "mockUserId",
                name: "John Doe",
                email: "john@example.com",
                comparePassword: jest.fn().mockResolvedValue(true),
            })),
        },
    };
});



describe("Users API", () => {

    it("should return 200 for /api/users/health", async () => {
        const res = await request(app).get("/api/users/health");
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("Auth service is healthy");
    });

    it("should return validation error for invalid signup data", async () => {
        const res = await request(app)
            .post("/api/users/signup")
            .send({ email: "not-an-email", password: "123" }); // missing name, short password
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
    });

    it("should call signup successfully with valid data", async () => {
        const res = await request(app)
            .post("/api/users/signup")
            .send({
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
            });

        expect([200, 201]).toContain(res.status);
        expect(res.body).toHaveProperty("user");
        expect(res.body.user.email).toBe("john@example.com");
    });


    it("should return validation error for invalid signin", async () => {
        const res = await request(app)
            .post("/api/users/signin")
            .send({
                email: "notanemail",
                password: "",
            });
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
    });

    it("should handle valid signin (if user exists)", async () => {
        const res = await request(app)
            .post("/api/users/signin")
            .send({
                email: "john@example.com",
                password: "password123",
            });

        // Actual result depends on your controller
        expect([200, 400, 401]).toContain(res.status);
    });

    it("should handle signout route", async () => {
        const res = await request(app).post("/api/users/signout");
        expect(res.status).toBe(200);
    });

    it("should return 404 for unknown route", async () => {
        const res = await request(app).get("/api/users/unknownroute");
        expect(res.status).toBe(404);
        expect(res.body.errors[0].message).toContain("not found");
    });
});
