import { LoginUserDto } from './dto/login-user.dto';
import { LoginInterface } from './../typings/global.d';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as  bcrypt from 'bcrypt'
import { User } from './user.model'

@Injectable()
export class UserService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
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
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.message
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        })

        newUser.password = null;
        return newUser

    }

    public async findAll(): Promise<User[]> {

        try {

            const users = await this.userModel.find({}).exec();
            return users

        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.message
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async findById(id: number): Promise<User> {

        const user = await this.userModel.findById(id).select('-password')
        return user

    }

    public async findByLogin(userLogin: LoginInterface): Promise<User> {
        const { password, email } = userLogin

        const user = await this.findByEmail(email);

        console.log(user)

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
