import { AccountController } from './account.controller';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AccountSchema } from './account.model';
import { AccountService } from './account.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Account',
                schema: AccountSchema
            }
        ]),
        PassportModule.register({
            defaultStrategy: 'jwt',
            session: false
        }),
    ],
    providers: [
        AccountService
    ],
    controllers: [
        AccountController
    ],
    exports: [
        AccountService
    ]
})
export class AccountModule { }
