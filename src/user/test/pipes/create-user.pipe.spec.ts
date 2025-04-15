import { Test, TestingModule } from '@nestjs/testing'
import { CreateUserPipe } from '@/user/pipes/create-user.pipe'
import { UserAbstractService } from '@/user/service/user.abstract.service'
import { CreateUserRequestDto } from '@/user/dtos/request/create-user-request.dto'
import { BadRequestException, ConflictException } from '@nestjs/common'

describe('CreateUserPipe', () => {
    let pipe: CreateUserPipe
    let userServiceMock: {
        findByUsername: jest.Mock
    }

    beforeEach(async () => {
        userServiceMock = {
            findByUsername: jest.fn()
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [CreateUserPipe, { provide: UserAbstractService, useValue: userServiceMock }]
        }).compile()

        pipe = module.get<CreateUserPipe>(CreateUserPipe)
    })

    it('should pass if object username does not exist', async () => {
        const dto: CreateUserRequestDto = {
            username: 'novousuario',
            password: '123456'
        }

        userServiceMock.findByUsername.mockResolvedValue(null)

        const result = await pipe.transform(dto)

        expect(result).toEqual(dto)
        expect(userServiceMock.findByUsername).toHaveBeenCalledWith('novousuario')
    })

    it('should pass if string username does not exist', async () => {
        const dto = 'testeson'

        userServiceMock.findByUsername.mockResolvedValue(null)

        const result = await pipe.transform(dto)

        expect(result).toEqual(dto)
        expect(userServiceMock.findByUsername).toHaveBeenCalledWith('testeson')
    })

    it('should throw ConflictException if username already exists', async () => {
        const dto: CreateUserRequestDto = {
            username: 'usuarioexistente',
            password: '123456'
        }

        userServiceMock.findByUsername.mockResolvedValue({ id: 1, username: dto.username })

        await expect(pipe.transform(dto)).rejects.toThrow(ConflictException)

        try {
            await pipe.transform(dto)
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(ConflictException)

            if (error instanceof ConflictException) {
                expect(error.message).toBe('Username already exists')
            }
        }
    })

    it('should throw BadRequestException if username is not provided', async () => {
        const invalidValue = ''

        await expect(pipe.transform(invalidValue)).rejects.toThrow(BadRequestException)

        try {
            await pipe.transform(invalidValue)
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException)

            if (error instanceof ConflictException) {
                expect(error.message).toBe('Username not provided')
            }
        }
    })
})
