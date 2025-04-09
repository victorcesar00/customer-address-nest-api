import { LoginRequestDto } from '@/auth/dtos/request/login-request.dto'
import { LoginResponseDto } from '@/auth/dtos/response/login-response.dto'

export abstract class AuthAbstractService {
    abstract login(dto: LoginRequestDto): Promise<LoginResponseDto>
}
