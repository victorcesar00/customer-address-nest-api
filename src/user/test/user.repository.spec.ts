import { Test, TestingModule } from '@nestjs/testing'
import { UserRepository } from '@/user/repository/user.repository'
import { PrismaService } from '@/prisma/prisma.service'
import { IUser } from '@/user/user.interface'

describe('UserRepository', () => {
    let repository: UserRepository
    let prismaMock: {
        users: {
            create: jest.Mock
            findUnique: jest.Mock
        }
    }

    beforeEach(async () => {
        prismaMock = {
            users: {
                create: jest.fn(),
                findUnique: jest.fn()
            }
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserRepository,
                {
                    provide: PrismaService,
                    useValue: prismaMock
                }
            ]
        }).compile()

        repository = module.get<UserRepository>(UserRepository)
    })

    it('should create a user', async () => {
        const userInput = {
            username: 'testeson',
            password: 'hashedpass',
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const createdUser: IUser = {
            id: 1,
            ...userInput
        }

        prismaMock.users.create.mockResolvedValue(createdUser)

        const result = await repository.create(userInput)

        expect(result).toEqual(createdUser)
        expect(prismaMock.users.create).toHaveBeenCalledWith({ data: userInput })
    })

    it('should find user by username', async () => {
        const foundUser: IUser = {
            id: 1,
            username: 'testeson',
            password: 'hashedpass',
            createdAt: new Date(),
            updatedAt: new Date()
        }

        prismaMock.users.findUnique.mockResolvedValue(foundUser)

        const result = await repository.findByUsername('testeson')

        expect(result).toEqual(foundUser)
        expect(prismaMock.users.findUnique).toHaveBeenCalledWith({ where: { username: 'testeson' } })
    })

    it('should return null if user not found', async () => {
        prismaMock.users.findUnique.mockResolvedValue(null)

        const result = await repository.findByUsername('notfound')

        expect(result).toBeNull()
    })
})
