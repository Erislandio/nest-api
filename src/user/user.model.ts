import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'

export interface User extends mongoose.Document {
    name: string;
    email: string;
    password: string;
}

export const UserSchema = new mongoose.Schema<User>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: false,
    },
});

UserSchema.pre<User>("save", async function (next: mongoose.HookNextFunction): Promise<mongoose.HookNextFunction> {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    return next();
});

