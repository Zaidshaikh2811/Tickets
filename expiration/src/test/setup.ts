import { RedisMemoryServer } from "redis-memory-server";

let redisServer: RedisMemoryServer;

beforeAll(async () => {
    redisServer = new RedisMemoryServer();
    const host = await redisServer.getHost();
    const port = await redisServer.getPort();

    process.env.REDIS_HOST = host;
    process.env.REDIS_PORT = port.toString();
});

afterAll(async () => {
    if (redisServer) {
        await redisServer.stop();
    }
});

jest.mock("../__mocks__/nats-wrapper.ts");

jest.mock("../events/publisher/expiration-completed-publisher.ts");
