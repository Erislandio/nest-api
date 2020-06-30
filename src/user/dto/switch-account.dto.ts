import { IsString } from 'class-validator';
export class SwitchAccountDto {
    @IsString()
    userId: string;
    @IsString()
    accountId: string;
}