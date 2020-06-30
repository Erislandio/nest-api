import { SwitchAccountDto } from './dto/switch-account.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { statusError } from 'src/utils/status';
import { Account } from './../account/account.model';
import { User } from './user.model';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, HttpCode, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags("user")
@Controller('user')
export class UserController {

    constructor(private service: UserService) { }

    @Post('create')
    @ApiTags("user")
    @ApiBody({
        schema: {
            description: "Create a new user",
            example: { email: "email@teste.com", password: "***********" },
        }
    })
    public create(@Body() user: CreateUserDto): Promise<User> {
        return this.service.create(user)
    }

    @Get('find')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    public findByEmail(@Query('email') email: string): Promise<User> {
        return this.service.findByEmail(email)
    }

    @Get('index')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    public index(@Query('id') id: string): Promise<User> {
        return this.service.findById(id)
    }

    @Post('logout')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @ApiBody({
        schema: {
            description: "Logout application",
            example: { userId: "STRING"},
        }
    })
    public logout(@Body('userId') userId: string): Promise<any> {
        return this.service.logout(userId)
    }


    @Post('switch')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    public async switch(@Body() switchAccount: SwitchAccountDto): Promise<User | object> {

        try {
            const { accounts, account }: { accounts: Account[], account: Account } = await this.service.findById(switchAccount.userId);

            if (!accounts) {
                return {
                    error: true,
                    message: "Account not registred",
                }
            }

            const findAccount = accounts.find((item) => item.id === switchAccount.accountId);

            if (!findAccount) {
                return {
                    error: true,
                    message: "Account not found",
                }
            }

            if (account !== null && account._id == switchAccount.accountId) {
                return {
                    error: true,
                    message:
                        "Account is already in use, try using another account with the --use command",
                }
            }

            return this.service.switchAccount(switchAccount).then((res) => {
                if (res) {
                    return {
                        error: false,
                        message: `Your account has been changed to ${res?.account?.name}`
                    }
                }
            }).catch(error => {
                return statusError(error)
            })

        } catch (error) {
            return statusError(error)
        }

    }
}
