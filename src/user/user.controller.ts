import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    ClassSerializerInterceptor,
    SerializeOptions,
    UsePipes
} from '@nestjs/common'
import { CreateUserRequestDto } from '@/user/dtos/request/create-user-request.dto'
import { UserResponseDto } from '@/user/dtos/response/user-response.dto'
import { UserAbstractService } from '@/user/service/user.abstract.service'
import { CreateUserPipe } from '@/user/pipes/create-user.pipe'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserAbstractService) {}

    @Post()
    @SerializeOptions({ type: UserResponseDto })
    @UsePipes(CreateUserPipe) // verifica se o usuario ja existe antes de mandar pro handler
    async create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
        return await this.userService.create(dto)
    }
}
