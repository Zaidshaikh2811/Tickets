import nats, { Message } from "node-nats-streaming";



export abstract class Listener {
    protected client: nats.Stan;
    protected ackWait = 5 * 1000;


    abstract subject: string;
    abstract queueGroupName: string;
    abstract onMessage(data: any, msg: Message): void;

    constructor(client: nats.Stan) {
        this.client = client;

    }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on("message", (msg: Message) => {
            console.log(`📩 Received message [${msg.getSequence()}]: ${msg.getData()}`);
            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg)
            msg.ack();
        });
    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === "string"
            ? JSON.parse(data)
            : JSON.parse(data.toString("utf8"));
    }

}