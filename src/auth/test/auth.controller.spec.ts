import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException } from '@nestjs/common'
import { AuthController } from '@/auth/auth.controller'
import { AuthAbstractService } from '@/auth/service/auth.abstract.service'
import { LoginRequestDto } from '@/auth/dtos/request/login-request.dto'
import { LoginResponseDto } from '@/auth/dtos/response/login-response.dto'

describe('AuthController', () => {
    let controller: AuthController
    let authServiceMock: { login: jest.Mock }

    beforeEach(async () => {
        authServiceMock = {
            login: jest.fn()
        }

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthAbstractService,
                    useValue: authServiceMock
                }
            ]
        }).compile()

        controller = module.get<AuthController>(AuthController)
    })

    describe('login', () => {
        it('should return access token for valid credentials', async () => {
            const dto: LoginRequestDto = {
                username: 'testeson',
                password: '123456'
            }

            const mockResponse: LoginResponseDto = {
                accessToken: 'mock-token'
            }

            authServiceMock.login.mockResolvedValue(mockResponse)

            const result = await controller.login(dto)

            expect(result).toEqual(mockResponse)
            expect(authServiceMock.login).toHaveBeenCalledWith(dto)
        })

        it('should reject invalid DTO', async () => {
            const invalidDto = {} as LoginRequestDto
            authServiceMock.login.mockRejectedValue(new BadRequestException())
            await expect(controller.login(invalidDto)).rejects.toThrow(BadRequestException)
        })
    })
})
