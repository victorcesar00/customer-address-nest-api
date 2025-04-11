import { Controller, Post, Body, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common'
import { AuthAbstractService } from '@/auth/service/auth.abstract.service'
import { LoginRequestDto } from '@/auth/dtos/request/login-request.dto'
import { LoginResponseDto } from '@/auth/dtos/response/login-response.dto'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthAbstractService) {}

    @Post('login')
    @SerializeOptions({ type: LoginResponseDto })
    async login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
        return await this.authService.login(dto)
    }
}
