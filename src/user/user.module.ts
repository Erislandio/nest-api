import { AccountSchema } from './../account/account.model';
import { PassportModule } from '@nestjs/passport';
import { UserSchema } from './user.model';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema
      },
      {
        name: "Account",
        schema: AccountSchema
      }
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})


export class UserModule { }
