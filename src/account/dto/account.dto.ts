import { IsString } from 'class-validator';
import { isString } from "util";

export class AccountDto {
    @IsString()
    name: string;
    @IsString()
    appKey: string;
    @IsString()
    appToken: string;
    @IsString()
    userId: string;
}