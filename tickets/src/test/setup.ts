import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

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
