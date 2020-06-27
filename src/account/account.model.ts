import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'

export interface Account extends mongoose.Document {
    name: string;
    appKey: string;
    appToken: string;
    userId: string;
}

export const AccountSchema = new mongoose.Schema<Account>({
    name: {
        type: String,
        required: true,
    },
    appKey: {
        type: String,
        required: true
    },
    appToken: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

AccountSchema.pre<Account>('save', async function (next: mongoose.HookNextFunction): Promise<mongoose.HookNextFunction> {
    const hash = await bcrypt.hash(this.appToken, 10);
    this.appToken = hash;
    return next();
});

