import { Account } from './../account/account.model';
import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'

export interface User extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    accounts: Account[],
    account: Account
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
    isVerified: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: false,
    },
    accounts: [],
    account: {
        type: Object,
        default: {
            name: String,
            appKey: String,
            appToken: String
        }
    }

}, {
    timestamps: true
});

UserSchema.pre<User>("save", async function (next: mongoose.HookNextFunction): Promise<mongoose.HookNextFunction> {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    return next();
});

