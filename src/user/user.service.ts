import { LoginUserDto } from './dto/login-user.dto';
import { LoginInterface, SwitchAccount } from './../typings/global.d';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as  bcrypt from 'bcrypt'
import { User } from './user.model'
import { statusError } from 'src/utils/status';
import { Account } from 'src/account/account.model';

@Injectable()
export class UserService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Account') private readonly accountModel: Model<Account>
    ) { }

    public async create(doc: User): Promise<User> {

        const user = await this.findByEmail(doc.email);

        if (user) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: `email: ${doc.email} is already registered`
            }, HttpStatus.BAD_REQUEST);
        }

        const newUser = await new this.userModel(doc).save().catch((error) => {
            return statusError(error)
        })

        newUser.password = null;
        return newUser

    }

    public async findAll(): Promise<User[]> {

        try {

            const users = await this.userModel.find({}).exec();
            return users

        } catch (error) {
            statusError(error)
        }
    }

    public async findById(id: string | any): Promise<User> {

        try {
            const user = await this.userModel.findById(id).select('-password');
            const accounts = await this.accountModel.find().where('userId').in(id).select('-appToken');

            user.accounts = accounts

            return user
        } catch (error) {
            statusError(error)
        }

    }

    public async switchAccount(switchAccount: SwitchAccount): Promise<User> {

        try {

            const account = await this.accountModel.findById(switchAccount.accountId);

            return this.userModel.findByIdAndUpdate(switchAccount.userId, {
                account,
            }, { new: false }).then(res => {
                if (res) {

                    res.account = account
                    return res
                }

                return {}
            }).catch(error => statusError(error))

        } catch (error) {
            statusError(error)
        }

    }

    public async findByLogin(userLogin: LoginInterface): Promise<User> {
        const { password, email } = userLogin

        const user = await this.findByEmail(email);

        if (!user) {
            throw new HttpException('Invalid credentials - User not found', HttpStatus.UNAUTHORIZED);
        }

        if (await bcrypt.compare(password, user.password)) {
            return this.sanitizeUser(user)

        } else {
            throw new HttpException('Invalid credentials - UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
        }

    }

    public async findByEmail(email: string): Promise<User> {

        const user = await this.userModel.findOne({ email });
        return user

    }

    public async checkPassword(attempt: LoginUserDto, callback: Function): Promise<any> {

        const user = await this.findByEmail(attempt.email)

        bcrypt.compare(attempt.password, user.password, (err, isMatch) => {
            if (err) {
                return callback(err)
            }

            callback(null, callback)

        })
    }

    private sanitizeUser(user: User): User {
        const sanitized = user.toObject();
        delete sanitized['password'];
        return sanitized
    }
}
