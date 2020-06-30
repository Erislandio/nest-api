import { AuthService } from './auth.service';
import { LoginUserDto } from './../user/dto/login-user.dto';
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@Controller('auth')
@ApiTags("auth")
export class AuthController {

    constructor(
        private authService: AuthService
    ) { }

    @Post()
    @ApiBody({
        schema: {
            description: "Login application",
            example: { email: "email@teste.com", password: "***********" },
        }
    })
    async login(@Body() login: LoginUserDto) {
        return await this.authService.validateUserByPassword(login)
    }

}
