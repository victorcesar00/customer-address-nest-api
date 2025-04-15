import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { CreateUserRequestDto } from '@/user/dtos/request/create-user-request.dto'
import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'

describe('UserController (e2e)', () => {
    let app: INestApplication
    let prisma: PrismaService

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = moduleFixture.createNestApplication()
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true
            })
        )

        await app.init()
        prisma = app.get(PrismaService)

        //limpa banco de dados ao entrar
        await prisma.users.deleteMany()
    })

    afterAll(async () => {
        //limpa banco de dados ao sair
        await prisma.users.deleteMany()
        await app.close()
    })

    describe('POST /user', () => {
        const validUser: CreateUserRequestDto = {
            username: 'testuser',
            password: 'validPassword123'
        }

        it('should create a new user (201)', async () => {
            // eslint-disable-next-line prettier/prettier
            const response = await request(app.getHttpServer())
                .post('/user')
                .send(validUser)
                .expect(201)

            expect(response.body).toEqual({
                id: expect.any(Number) as number,
                username: validUser.username,
                createdAt: expect.any(String) as string,
                updatedAt: expect.any(String) as string
            })

            // Verifica se a senha foi hasheada
            const user = await prisma.users.findUnique({
                where: { username: validUser.username }
            })

            expect(user).toBeDefined()

            if (user) {
                expect(user.password).not.toBe(validUser.password)
                expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/) // Bcrypt pattern
            }
        })

        it('should return 409 for duplicate username', async () => {
            await request(app.getHttpServer())
                .post('/user')
                .send(validUser)
                .expect(409)
                .then((response) => {
                    expect(response.body).toHaveProperty('message')

                    if ('message' in response.body) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        expect(response.body.message).toBe('Username already exists')
                    }
                })
        })

        it('should return 400 for invalid data', async () => {
            const invalidUsers = [
                { username: 'usr', password: 'validPassword123' }, // username muito pequeno
                { username: 'testuser2', password: 'short' }, // password muito pequeno
                { username: '', password: 'validPassword123' }, // username vazio
                { password: 'validPassword123' }, // username faltando
                { username: 'testuser2' }, // password faltando
                { username: 'testuser2', password: 'validPassword123', extraField: 'invalid' } // campo extra
            ]

            for (const user of invalidUsers) {
                // eslint-disable-next-line prettier/prettier
                await request(app.getHttpServer())
                    .post('/user')
                    .send(user)
                    .expect(400)
            }
        })
    })

    describe('Authentication integration', () => {
        it('should allow login with created user', async () => {
            const loginData = {
                username: 'testuser',
                password: 'validPassword123'
            }

            await request(app.getHttpServer())
                .post('/auth/login')
                .send(loginData)
                .expect(201)
                .then((response) => {
                    expect(response.body).toHaveProperty('accessToken')

                    if ('accessToken' in response.body) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        expect(typeof response.body.accessToken).toBe('string')
                    }
                })
        })

        it('should reject invalid credentials', async () => {
            const invalidLoginData = [
                { username: 'testuser', password: 'wrongpassword' },
                { username: 'nonexistent', password: 'validPassword123' }
            ]

            for (const data of invalidLoginData) {
                // eslint-disable-next-line prettier/prettier
                await request(app.getHttpServer())
                    .post('/auth/login')
                    .send(data)
                    .expect(401)
            }
        })
    })
})
