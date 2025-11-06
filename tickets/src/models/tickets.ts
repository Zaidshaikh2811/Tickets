import mongoose from "mongoose";


interface TicketAttrs {
    title: string;
    price: number;
    userId: string;

}


interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    version: number;
}


interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
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




ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
