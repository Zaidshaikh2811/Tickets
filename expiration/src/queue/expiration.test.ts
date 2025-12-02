import { expirationQueue } from "./expiration-queue";
import { ExpirationCompletedPublisher } from "../events/publisher/expiration-completed-publisher";

describe("Expiration Queue", () => {

    afterEach(async () => {
        await expirationQueue.empty();
    });

    afterAll(async () => {
        await expirationQueue.close();
    });

    it("processes a job and publishes an event", async () => {
        const orderId = "order123";

        const publishMock = jest.fn();
        (ExpirationCompletedPublisher as any).mockImplementation(() => ({
            publish: publishMock,
        }));

        const job = await expirationQueue.add({ orderId });
        expect(job.id).toBeDefined();

        // process job manually in mock
        await (expirationQueue as any).processJob(job);

        expect(publishMock).toHaveBeenCalledTimes(1);
        expect(publishMock).toHaveBeenCalledWith({ orderId });
    });

    it("marks job as completed", async () => {
        const job = await expirationQueue.add({ orderId: "xyz789" });
        expect(job.id).toBeDefined();

        await (expirationQueue as any).processJob(job);

        expect(await job.isCompleted()).toBe(true);
    });
});
