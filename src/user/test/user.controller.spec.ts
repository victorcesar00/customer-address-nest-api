import { Test, TestingModule } from '@nestjs/testing'
import { ConflictException } from '@nestjs/common'
import { UserController } from '@/user/user.controller'
import { UserAbstractService } from '@/user/service/user.abstract.service'
import { CreateUserRequestDto } from '@/user/dtos/request/create-user-request.dto'
import { UserResponseDto } from '@/user/dtos/response/user-response.dto'

describe('UserController', () => {
    let controller: UserController
    let userServiceMock: { create: jest.Mock }

    beforeEach(async () => {
        userServiceMock = {
            create: jest.fn()
        }

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserAbstractService,
                    useValue: userServiceMock
                }
            ]
        }).compile()

        controller = module.get<UserController>(UserController)
    })

    describe('create', () => {
        it('should create new user', async () => {
            const dto: CreateUserRequestDto = {
                username: 'testeson',
                password: '123456'
            }

            const mockUser: UserResponseDto = {
                id: 1,
                username: 'testeson',
                createdAt: new Date(),
                updatedAt: new Date()
            }

            userServiceMock.create.mockResolvedValue(mockUser)

            const result = await controller.create(dto)

            expect(result).toEqual(mockUser)
            expect(userServiceMock.create).toHaveBeenCalledWith(dto)
        })

        it('should reject duplicate username', async () => {
            const dto: CreateUserRequestDto = {
                username: 'duplicate',
                password: '123456'
            }

            userServiceMock.create.mockRejectedValue(new ConflictException())
            await expect(controller.create(dto)).rejects.toThrow(ConflictException)
        })
    })
})
