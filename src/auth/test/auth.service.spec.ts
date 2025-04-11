import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { AuthService } from '@/auth/service/auth.service'
import { JwtService } from '@nestjs/jwt'
import { UserAbstractService } from '@/user/service/user.abstract.service'
import { LoginRequestDto } from '@/auth/dtos/request/login-request.dto'
import * as bcrypt from 'bcrypt'

describe('AuthService', () => {
    let service: AuthService
    let jwtService: JwtService
    let userService: UserAbstractService

    const mockUser = {
        id: 1,
        username: 'testeson',
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date()
    }

    beforeEach(async () => {
        jest.spyOn(bcrypt, 'compare').mockImplementation((plain) => {
            return plain === 'correct'
        })

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn().mockResolvedValue('mocked.jwt.token')
                    }
                },
                {
                    provide: UserAbstractService,
                    useValue: {
                        validateUser: jest.fn().mockImplementation((username, password) => {
                            if (username === 'testeson' && password === 'correct') {
                                return mockUser
                            }
                            return null
                        })
                    }
                }
            ]
        }).compile()

        service = module.get<AuthService>(AuthService)
        jwtService = module.get<JwtService>(JwtService)
        userService = module.get<UserAbstractService>(UserAbstractService)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('login', () => {
        it('should return access token for valid credentials', async () => {
            const dto: LoginRequestDto = {
                username: 'testeson',
                password: 'correct'
            }

            const result = await service.login(dto)

            expect(result).toEqual({ accessToken: 'mocked.jwt.token' })
            expect(userService.validateUser).toHaveBeenCalledWith(dto.username, dto.password)
            expect(jwtService.signAsync).toHaveBeenCalledWith({
                sub: mockUser.id,
                username: mockUser.username
            })
        })

        it('should throw UnauthorizedException for invalid credentials', async () => {
            const dto: LoginRequestDto = {
                username: 'invalid',
                password: 'wrong'
            }

            await expect(service.login(dto)).rejects.toThrow(UnauthorizedException)
        })

        it('should throw for empty username', async () => {
            const dto: LoginRequestDto = {
                username: '',
                password: 'password'
            }

            await expect(service.login(dto)).rejects.toThrow(UnauthorizedException)
        })
    })
})
