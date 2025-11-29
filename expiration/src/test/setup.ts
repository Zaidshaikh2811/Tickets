jest.mock("ioredis", () => {
    const RedisMock = require("ioredis-mock");
    class PatchedRedis extends RedisMock {
        client() {
            // just ignore it
            return Promise.resolve("OK");
        }
    }

    return PatchedRedis;
});

jest.mock("../__mocks__/nats-wrapper.ts");

jest.mock("../events/publisher/expiration-completed-publisher.ts");