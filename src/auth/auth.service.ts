import { User } from './../user/user.model';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './../user/dto/login-user.dto';
import { UserService } from './../user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload, JwtResponse } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private JwtService: JwtService
    ) { }

    public async validateUserByPassword(loginAttempt: LoginUserDto): Promise<any> {

        let user = await this.userService.findByLogin(loginAttempt);
        return new Promise((resolve) => {
            this.userService.checkPassword(loginAttempt, (err, isMatch) => {

                if (err) throw new UnauthorizedException();

                if (isMatch) {
                    resolve(this.createJwtPayload(user));

                } else {
                    throw new UnauthorizedException();
                }

            });
        })
    }

    public async validateUserByJwt(payload: JwtPayload): Promise<JwtResponse> {

        const { email } = payload

        let user = await this.userService.findByEmail(email);

        if (user) {
            return this.createJwtPayload(user);
        } else {
            throw new UnauthorizedException();
        }
    }

    private createJwtPayload(user: User): JwtResponse {

        let data: JwtPayload = {
            email: user.email
        }

        let jwt = this.JwtService.sign(data);

        return {
            expiresIn: '24h',
            token: jwt
        }
    }
}
