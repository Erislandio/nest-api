import { AccountDto } from './dto/account.dto';
import { statusError } from 'src/utils/status';
import { AccountService } from './account.service';
import { Controller, Post, Body, Delete, UseGuards, HttpException, Get } from '@nestjs/common';
import { Account } from './account.model';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('account')
@ApiTags("account")
@ApiBearerAuth()
export class AccountController {

    constructor(private service: AccountService) { }

    @Post('create')
    @UseGuards(AuthGuard())
    public async create(@Body() account: AccountDto): Promise<Account> {

        const isValid = await this.service.isValidAccountName(account.userId, account.name);

        if (!isValid) {
            throw new HttpException({
                message: `Account: ${account.name} is already registered`,
                error: true,
                status: 200
            }, 200)
        }

        return this.service.create(account);
    }

    @Delete('remove')
    @UseGuards(AuthGuard())
    public remove(@Body('id') id: string): Promise<object> {

        return this.service.delete(id).then(res => {

            if (res) {
                return {
                    error: false,
                    message: `${res.name} account was successfully removed`,
                    removed: true
                }
            }

        }).catch(error => statusError(error))

    }

    @Get('index')
    @UseGuards(AuthGuard())
    public index(): Promise<AccountDto[]> {
        return this.service.index()
    }

}
