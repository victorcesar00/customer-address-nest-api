import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'
import { CustomerAddressRequestDto } from '@/address/dtos/request/customer-address-request.dto'
import { UpdateCustomerRequestDto } from '@/customer/dtos/request/update-customer-request.dto'

describe('CustomerController (e2e)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let authToken: string

    const mockAddress: CustomerAddressRequestDto = {
        street: 'Rua Principal',
        neighborhood: 'Centro',
        city: 'Testelandia',
        state: 'Testes Gerais',
        zipCode: '12345-678'
    }

    const validCustomer: CreateCustomerRequestDto = {
        name: 'Testeson Silva',
        email: 'testeson.silva@example.com',
        phone: '+5531999999999',
        gender: 'MALE',
        taxPayerId: '12345678901',
        addresses: [mockAddress]
    }

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
        await prisma.customers.deleteMany()
        await prisma.users.deleteMany()

        // Cria usuario de teste e pega o token
        await request(app.getHttpServer())
            .post('/user')
            .send({ username: 'usertokentest', password: 'validPassword123' })

        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ username: 'usertokentest', password: 'validPassword123' })

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (!('accessToken' in loginRes.body) || !loginRes.body.accessToken) {
            throw new Error('Failed to retrieve accessToken')
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        authToken = loginRes.body.accessToken as string
    })

    afterAll(async () => {
        //limpa banco de dados ao sair
        await prisma.customers.deleteMany()
        await prisma.addresses.deleteMany()
        await prisma.users.deleteMany()

        await app.close()
    })

    beforeEach(async () => {
        //limpa banco de dados antes de cada teste
        await prisma.customers.deleteMany()
        await prisma.addresses.deleteMany()
    })

    describe('POST /customer', () => {
        it('should create customer with addresses (201)', async () => {
            const response = await request(app.getHttpServer())
                .post('/customer')
                .set('Authorization', `Bearer ${authToken}`)
                .send(validCustomer)
                .expect(201)

            expect(response.body).toMatchObject({
                id: expect.any(Number) as number,
                name: validCustomer.name,
                email: validCustomer.email,
                addresses: expect.arrayContaining([expect.objectContaining(mockAddress)]) as CustomerAddressRequestDto[]
            })

            const customer = await prisma.customers.findUnique({
                where: { email: validCustomer.email }
            })
            expect(customer).toBeDefined()

            const addresses = await prisma.addresses.findMany()
            expect(addresses.length).toBe(1)
        })

        it('should normalize phone and taxPayerId (201)', async () => {
            const customerData = {
                ...validCustomer,
                phone: '+55 (031) 99999-9999',
                taxPayerId: '12.345.678/9012-34'
            }

            const response = await request(app.getHttpServer())
                .post('/customer')
                .set('Authorization', `Bearer ${authToken}`)
                .send(customerData)
                .expect(201)

            expect(response.body).toHaveProperty('phone')

            if ('phone' in response.body) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                expect(response.body.phone).toBe('+55031999999999')
            }

            expect(response.body).toHaveProperty('taxPayerId')

            if ('taxPayerId' in response.body) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                expect(response.body.taxPayerId).toBe('12345678901234')
            }
        })

        it('should return 409 for duplicate unique fields', async () => {
            await prisma.customers.create({
                data: { ...validCustomer, addresses: { create: validCustomer.addresses } }
            })

            const conflicts = [
                { ...validCustomer, email: 'new@example.com' }, // mesmo taxPayerId
                { ...validCustomer, taxPayerId: '09876543210987' }, // mesmo email
                { ...validCustomer, phone: '+5531888888888' } // mesmo taxPayerId
            ]

            for (const payload of conflicts) {
                const response = await request(app.getHttpServer())
                    .post('/customer')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(payload)
                    .expect(409)

                expect(response.body).toHaveProperty('message')

                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                expect(response.body.message).toEqual(
                    expect.arrayContaining([expect.stringMatching(/already registered/)])
                )
            }
        })

        it('should validate input data (400)', async () => {
            const invalidCustomers = [
                { ...validCustomer, name: 'A' }, // nome muito pequeno
                { ...validCustomer, email: 'invalid-email' }, // email invalido
                { ...validCustomer, phone: '123' }, // telefone invalido
                { ...validCustomer, gender: 'INVALID' }, // genero invalido
                { ...validCustomer, taxPayerId: 'short' }, // taxPayerId invalido
                { ...validCustomer, addresses: [{ ...mockAddress, street: '' }] }, // endereco invalido
                { ...validCustomer, extraField: 'invalid' } // campo inesperado
            ]

            for (const customer of invalidCustomers) {
                await request(app.getHttpServer())
                    .post('/customer')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(customer)
                    .expect(400)
            }
        })
    })

    describe('GET /customer/:id', () => {
        it('should retrieve customer by ID (200)', async () => {
            const created = await prisma.customers.create({
                data: { ...validCustomer, addresses: { create: validCustomer.addresses } }
            })

            const response = await request(app.getHttpServer())
                .get(`/customer/${created.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)

            expect(response.body).toMatchObject({
                id: created.id,
                name: validCustomer.name,
                email: validCustomer.email
            })
        })

        it('should return 404 for non-existent customer', async () => {
            await request(app.getHttpServer())
                .get('/customer/9999')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404)
        })
    })

    describe('GET /customer/with-addresses/:id', () => {
        it('should retrieve customer with addresses (200)', async () => {
            const created = await prisma.customers.create({
                data: {
                    ...validCustomer,
                    addresses: {
                        create: [mockAddress]
                    }
                },
                include: { addresses: true }
            })

            const response = await request(app.getHttpServer())
                .get(`/customer/with-addresses/${created.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)

            expect(response.body).toHaveProperty('addresses')

            if ('addresses' in response.body) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                expect(response.body.addresses.length).toBe(1)
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                expect(response.body.addresses[0]).toMatchObject(mockAddress)
            }
        })
    })

    describe('PATCH /customer/:id', () => {
        let customerId: number

        beforeEach(async () => {
            const customer = await prisma.customers.create({
                data: { ...validCustomer, addresses: { create: validCustomer.addresses } }
            })
            customerId = customer.id
        })

        it('should update customer data (200)', async () => {
            const updateData: UpdateCustomerRequestDto = {
                name: 'Updated Name',
                email: 'updated@example.com',
                phone: '+5531888888888'
            }

            const response = await request(app.getHttpServer())
                .patch(`/customer/${customerId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData)
                .expect(200)

            expect(response.body).toMatchObject(updateData)
        })

        it('should prevent updating taxPayerId (400)', async () => {
            const updateData = { taxPayerId: 'new-tax-id' }

            await request(app.getHttpServer())
                .patch(`/customer/${customerId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData)
                .expect(400)
        })

        it('should detect conflicts on update (409)', async () => {
            await prisma.customers.create({
                data: {
                    ...validCustomer,
                    email: 'other@example.com',
                    phone: '+351123456789',
                    taxPayerId: '09876543210987',
                    addresses: { create: validCustomer.addresses }
                }
            })

            // eslint-disable-next-line prettier/prettier
            const conflicts = [
                { email: validCustomer.email },
                { phone: validCustomer.phone }
            ]

            for (const data of conflicts) {
                await request(app.getHttpServer())
                    .patch(`/customer/${customerId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(data)
                    .expect(409)
            }
        })
    })

    describe('DELETE /customer/:id', () => {
        it('should delete customer and related addresses (204)', async () => {
            const customer = await prisma.customers.create({
                data: {
                    ...validCustomer,
                    addresses: { create: [mockAddress] }
                }
            })

            await request(app.getHttpServer())
                .delete(`/customer/${customer.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(204)

            const dbCustomer = await prisma.customers.findUnique({
                where: { id: customer.id }
            })
            expect(dbCustomer).toBeNull()

            const addresses = await prisma.addresses.findMany()
            expect(addresses.length).toBe(0)
        })

        it('should return 404 for non-existent customer', async () => {
            await request(app.getHttpServer())
                .delete('/customer/9999')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404)
        })
    })

    describe('Security tests', () => {
        it('should return 401 for unauthenticated requests', async () => {
            // eslint-disable-next-line prettier/prettier
            await request(app.getHttpServer())
                .post('/customer')
                .send(validCustomer)
                .expect(401)
        })

        it('should prevent access with invalid token (401)', async () => {
            await request(app.getHttpServer())
                .get('/customer/1')
                .set('Authorization', 'Bearer invalid.token.here')
                .expect(401)
        })
    })
})
