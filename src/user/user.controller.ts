import { User } from './user.model';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, HttpCode, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {

    constructor(private service: UserService) { }

    @Post('create')
    public create(@Body() user: User): Promise<User> {
        return this.service.create(user)
    }

    @Get('find')
    public findByEmail(@Query('email') email: string): Promise<User> {
        return this.service.findByEmail(email)
    }

    @Get('test')
    @UseGuards(AuthGuard())
    testAuthRoute() {
        return {
            message: 'You did it!'
        }
    }

}
