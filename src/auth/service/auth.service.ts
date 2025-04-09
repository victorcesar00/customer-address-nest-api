import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserAbstractService } from '@/user/service/user.abstract.service'
import { AuthAbstractService } from '@/auth/service/auth.abstract.service'
import { LoginRequestDto } from '@/auth/dtos/request/login-request.dto'
import { LoginResponseDto } from '@/auth/dtos/response/login-response.dto'

@Injectable()
export class AuthService implements AuthAbstractService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserAbstractService
    ) {}

    async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
        const user = await this.userService.validateUser(dto.username, dto.password)

        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const payload = { sub: user.id, username: user.username }

        const accessToken = await this.jwtService.signAsync(payload)

        return { accessToken }
    }
}
