import { Lock } from "./lock";

const lock = new Lock();
let counter = 0;

export const getCounter = () => counter;

export const incrementSafely = async () => {
    await lock.acquire();
    try {
        const current = counter;
        // simulate slow DB write
        await new Promise(res => setTimeout(res, 10));
        counter = current + 1;
    } finally {
        lock.release();
    }
};
