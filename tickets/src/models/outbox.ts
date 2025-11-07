import mongoose from "mongoose";

export enum OutboxStatus {
    Pending = "pending",
    Sent = "sent",
}

interface OutboxEventAttrs {
    eventType: string;
    data: any;
    status?: OutboxStatus;
}

interface OutboxEventDoc extends mongoose.Document {
    eventType: string;
    data: any;
    status: OutboxStatus;
    createdAt: Date;
    updatedAt: Date;
}

interface OutboxEventModel extends mongoose.Model<OutboxEventDoc> {
    build(attrs: OutboxEventAttrs): OutboxEventDoc;
}

const outboxSchema = new mongoose.Schema(
    {
        eventType: { type: String, required: true, index: true },
        data: { type: Object, required: true },
        status: {
            type: String,
            enum: Object.values(OutboxStatus),
            default: OutboxStatus.Pending,
            index: true,
        },
    },
    { timestamps: true }
);

outboxSchema.statics.build = (attrs: OutboxEventAttrs) => {
    return new OutboxEvent(attrs);
};

export const OutboxEvent = mongoose.model<OutboxEventDoc, OutboxEventModel>(
    "OutboxEvent",
    outboxSchema
);
