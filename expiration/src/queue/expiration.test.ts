import { ExpirationCompletedPublisher } from "../events/publisher/expiration-completed-publisher";
import { expirationQueue } from "./expiration-queue";

describe("Expiration Queue", () => {
    beforeAll(() => {
        process.env.REDIS_HOST = "localhost";
        process.env.REDIS_PORT = "6379";
    });

    afterEach(async () => {
        await expirationQueue.empty();
    });

    afterAll(async () => {
        await expirationQueue.close();
    });

    it("processes a job and publishes an event", async () => {
        const orderId = "order123";

        const publishMock = jest.fn();

        (ExpirationCompletedPublisher as any).mockImplementation(() => {
            return { publish: publishMock };
        });


        const job = await expirationQueue.add({ orderId });

        expect(job.id).toBeDefined();


        await (expirationQueue as any).process(job);

        // Assertions
        expect(publishMock).toHaveBeenCalledTimes(1);
        expect(publishMock).toHaveBeenCalledWith({ orderId });
    });

    it("marks job as completed", async () => {
        const job = await expirationQueue.add({ orderId: "xyz789" });
        expect(job.id).toBeDefined();
        await (expirationQueue as any).process(job);
        expect(await job.isCompleted()).toBe(true);
    });
});
