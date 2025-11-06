export class Lock {
    private locked = false;
    private waiting: (() => void)[] = [];

    async acquire(): Promise<void> {
        if (!this.locked) {
            this.locked = true;
            return;
        }

        return new Promise(resolve => {
            this.waiting.push(() => {
                this.locked = true;
                resolve();
            });
        });
    }

    release(): void {
        if (this.waiting.length > 0) {
            const next = this.waiting.shift();
            next && next();
        } else {
            this.locked = false;
        }
    }
}
