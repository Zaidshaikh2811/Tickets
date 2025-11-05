import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";


let mongo: MongoMemoryServer;

beforeAll(async () => {

    process.env.JWT_KEY = "test_jwt_key";
    process.env.NODE_ENV = "test";

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

beforeEach(async () => {
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error("mongoose connection db is not available");
    }
    const collections = await db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});



declare global {
    var signin: () => string[];
}

global.signin = () => {
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: "test@test.com"
    };

    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const session = { jwt: token };
    const sessionJSON = JSON.stringify(session);
    const base64 = Buffer.from(sessionJSON).toString("base64");

    return [`session=${base64}`];
};

