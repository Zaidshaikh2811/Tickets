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
    processed: boolean;
    processedAt?: Date;
    lockedBy?: string | null;
    lockedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

interface OutboxEventModel extends mongoose.Model<OutboxEventDoc> {
    build(attrs: OutboxEventAttrs): OutboxEventDoc;
}

const outboxSchema = new mongoose.Schema(
    {
        eventType: { type: String, required: true },
        data: { type: Object, required: true },
        processed: { type: Boolean, default: false, index: true },
        lockedBy: { type: String, default: null },
        lockedAt: { type: Date, default: null },
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
