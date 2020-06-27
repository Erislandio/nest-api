import { async } from 'rxjs/internal/scheduler/async';
import { statusError } from 'src/utils/status';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from './account.model';
import { Model } from 'mongoose';

@Injectable()
export class AccountService {
    constructor(
        @InjectModel('Account') private readonly accountModel: Model<Account>
    ) { }

    public async create(account: Account): Promise<Account> {

        try {

            const newAccount = await new this.accountModel(account).save();
            return newAccount

        } catch (error) {

            statusError(error)
        }
    }

    public async index(): Promise<Account[]> {
        try {
            return this.accountModel.find({}).exec()
        } catch (error) {
            statusError(error)
        }
    }

    public async isValidAccountName(id: string | any, newAccountName: string): Promise<boolean> {

        try {
            const accounts = await this.accountModel.find().where('userId').in(id);

            if (accounts.length) {
                const account = accounts.find((item) => item.name === newAccountName);
                console.log(account)
                if (account) {
                    return false
                }
            }

            return true

        } catch (error) {
            statusError(error)
        }

    }

    public async delete(accountId: string): Promise<Account> {

        try {

            return this.accountModel.findByIdAndDelete(accountId);

        } catch (error) {
            statusError(error)
        }
    }
}
