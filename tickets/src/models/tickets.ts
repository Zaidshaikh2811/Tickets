import mongoose from "mongoose";


interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
    orderId?: string;

}

export enum TicketStatus {
    Created = 'created',
    Reserved = 'reserved',
    Expired = 'expired',
    Completed = 'completed',
    Failed = 'failed',
}

interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    orderId?: string;
    createdAt: Date;
    updatedAt: Date;
    version: number;
    status: TicketStatus;
}


interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema<TicketDoc>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        userId: {
            type: String,
            required: true,
        },
        orderId: {
            type: String,
        },
        status: {
            type: String,
            enum: Object.values(TicketStatus),
            default: TicketStatus.Created,
        },
    },
    {
        timestamps: true,
        versionKey: "version",
        optimisticConcurrency: true,
        toJSON: {
            transform(doc: TicketDoc, ret: any) {
                ret.id = ret._id;
                delete (ret as any)._id;
            },

        },
    }
);


ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
    return Ticket.findOne({ _id: event.id, version: event.version - 1 });
};

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
