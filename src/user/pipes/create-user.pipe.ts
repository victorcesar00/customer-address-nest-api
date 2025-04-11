import { Injectable, PipeTransform, ConflictException, BadRequestException } from '@nestjs/common'
import { CreateUserRequestDto } from '@/user/dtos/request/create-user-request.dto'
import { UserAbstractService } from '@/user/service/user.abstract.service'

@Injectable()
export class CreateUserPipe implements PipeTransform<string | CreateUserRequestDto> {
    constructor(private readonly userService: UserAbstractService) {}

    async transform(value: string | CreateUserRequestDto) {
        if (!value) {
            throw new BadRequestException('Username not provided')
        }

        const username = typeof value === 'string' ? value : value.username // valida se foi usado a nivel de rota ou de parametro

        const userExists = await this.userService.findByUsername(username)

        if (userExists) {
            throw new ConflictException('Username already exists')
        }

        return value
    }
}
