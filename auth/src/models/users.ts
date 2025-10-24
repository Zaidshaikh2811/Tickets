import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

interface UserAttrs {
    name: string;
    email: string;
    password: string;
}

interface UserDoc extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}


interface UserModel extends Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema<UserDoc>({
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    toJSON: {
        transform(doc, ret) {
            const r: any = ret;
            r.id = r._id;
            delete r._id;
            delete r.__v;
            delete r.password;
            delete r.createdAt;
            delete r.updatedAt;
        }
    }
});




userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    next();
});

// 🔹 Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
