import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '@/user/service/user.service'
import { UserAbstractRepository } from '@/user/repository/user.abstract.repository'
import * as bcrypt from 'bcrypt'
import { IUser } from '@/user/user.interface'

describe('UserService', () => {
    let service: UserService
    let userRepositoryMock: {
        create: jest.Mock
        findByUsername: jest.Mock
    }

    beforeEach(async () => {
        userRepositoryMock = {
            create: jest.fn(),
            findByUsername: jest.fn()
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, { provide: UserAbstractRepository, useValue: userRepositoryMock }]
        }).compile()

        service = module.get<UserService>(UserService)
    })

    it('should hash password and create user', async () => {
        const dto = { username: 'testeson', password: '123456' }
        const hashedPassword = await bcrypt.hash(dto.password, 10)
        const createdUser: IUser = {
            id: 1,
            username: dto.username,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        userRepositoryMock.create.mockResolvedValue(createdUser)

        const result = await service.create(dto)

        expect(userRepositoryMock.create).toHaveBeenCalled()
        expect(result).toMatchObject({ username: dto.username })
        expect(bcrypt.compareSync(dto.password, result.password)).toBe(true)
    })

    it('should return user by username', async () => {
        const user = { id: 1, username: 'testeson', password: 'hashed', createdAt: new Date(), updatedAt: new Date() }
        userRepositoryMock.findByUsername.mockResolvedValue(user)

        const result = await service.findByUsername('testeson')

        expect(result).toEqual(user)
        expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith('testeson')
    })

    it('should return null if user is not found', async () => {
        userRepositoryMock.findByUsername.mockResolvedValue(null)

        const result = await service.findByUsername('ghost')

        expect(result).toBeNull()
    })

    it('should validate user credentials (valid)', async () => {
        const password = 'secret'
        const hash = await bcrypt.hash(password, 10)

        const user = {
            id: 1,
            username: 'user1',
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        userRepositoryMock.findByUsername.mockResolvedValue(user)

        const result = await service.validateUser('user1', password)

        expect(result).toEqual(user)
    })

    it('should return null if password does not match', async () => {
        const user = {
            id: 1,
            username: 'user2',
            password: await bcrypt.hash('realpass', 10),
            createdAt: new Date(),
            updatedAt: new Date()
        }

        userRepositoryMock.findByUsername.mockResolvedValue(user)

        const result = await service.validateUser('user2', 'wrongpass')

        expect(result).toBeNull()
    })

    it('should return null if user not found during validation', async () => {
        userRepositoryMock.findByUsername.mockResolvedValue(null)

        const result = await service.validateUser('notfound', 'irrelevant')

        expect(result).toBeNull()
    })
})
