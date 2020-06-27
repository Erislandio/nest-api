import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    AccountModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.mailtrap.io',
        port: 2525,
        secure: false,
        auth: {
          user: process.env.USERNAME,
          pass: process.env.MAILER_PASSWORD,
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
  exports: [
    UserModule,
    AuthModule,
    AccountModule
  ]
})
export class AppModule { }
