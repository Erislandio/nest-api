import { HttpStatus, HttpException } from '@nestjs/common';
export function statusError(error: any): any {
    throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message
    }, HttpStatus.INTERNAL_SERVER_ERROR)
}