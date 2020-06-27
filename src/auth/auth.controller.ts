import { AuthService } from './auth.service';
import { LoginUserDto } from './../user/dto/login-user.dto';
import { Controller, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) { }

    @Post()
    async login(@Body() login: LoginUserDto) {
        return await this.authService.validateUserByPassword(login)
    }

}
