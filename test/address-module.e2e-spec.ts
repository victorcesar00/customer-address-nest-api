import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'
import { CreateAddressRequestDto } from '@/address/dtos/request/create-address-request.dto'
import { UpdateAddressRequestDto } from '@/address/dtos/request/update-address-request.dto'

describe('AddressController (e2e)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let authToken: string
    let customerId: number

    const mockCustomer: CreateCustomerRequestDto = {
        name: 'Customer for Address Tests',
        email: 'customer.address@test.com',
        phone: '+5531999999999',
        gender: 'MALE',
        taxPayerId: '12345678901'
    }

    const validAddress: CreateAddressRequestDto = {
        street: 'Rua dos Testes',
        neighborhood: 'Bairro Teste',
        city: 'Cidade Teste',
        state: 'Estado Teste',
        zipCode: '12345-678',
        customerId: 0 // Will be set dynamically
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

        // Clear database
        await prisma.addresses.deleteMany()
        await prisma.customers.deleteMany()
        await prisma.users.deleteMany()

        // Create test user and get token
        await request(app.getHttpServer())
            .post('/user')
            .send({ username: 'addresstestuser', password: 'validPassword123' })

        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ username: 'addresstestuser', password: 'validPassword123' })

        expect(loginRes.body).toHaveProperty('accessToken')

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (!('accessToken' in loginRes.body) || !loginRes.body.accessToken) {
            throw new Error('Error retrieving access token')
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        authToken = loginRes.body.accessToken as string

        // Create a customer for address tests
        const customerRes = await request(app.getHttpServer())
            .post('/customer')
            .set('Authorization', `Bearer ${authToken}`)
            .send(mockCustomer)

        expect(customerRes.body).toHaveProperty('id')

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (!('id' in customerRes.body) || !customerRes.body.id) {
            throw new Error('Error retrieving customer Id')
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        customerId = customerRes.body.id as number
        validAddress.customerId = customerId // Set the dynamic customerId
    })

    afterAll(async () => {
        await prisma.addresses.deleteMany()
        await prisma.customers.deleteMany()
        await prisma.users.deleteMany()

        await app.close()
    })

    beforeEach(async () => {
        await prisma.addresses.deleteMany()
    })

    describe('POST /address', () => {
        it('should create address for customer (201)', async () => {
            const response = await request(app.getHttpServer())
                .post('/address')
                .set('Authorization', `Bearer ${authToken}`)
                .send(validAddress)
                .expect(201)

            expect(response.body).toMatchObject({
                id: expect.any(Number) as number,
                street: validAddress.street,
                customerId: customerId
            })

            const dbAddress = await prisma.addresses.findFirst()
            expect(dbAddress).toBeDefined()
            expect(dbAddress?.customerId).toBe(customerId)
        })

        it('should validate input data (400)', async () => {
            const invalidAddresses = [
                { ...validAddress, street: '' }, // empty street
                { ...validAddress, customerId: 99999 }, // non-existent customer
                { ...validAddress, extraField: 'invalid' } // unexpected field
            ]

            for (const address of invalidAddresses) {
                await request(app.getHttpServer())
                    .post('/address')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(address)
                    .expect(address.customerId === 99999 ? 404 : 400)
            }
        })

        it('should return 404 for non-existent customer', async () => {
            const invalidAddress = {
                ...validAddress,
                customerId: 999999 // non-existent customer
            }

            await request(app.getHttpServer())
                .post('/address')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidAddress)
                .expect(404)
        })
    })

    describe('GET /address/customer/:customerId', () => {
        it('should retrieve all addresses for customer (200)', async () => {
            // Create multiple addresses for the customer
            await prisma.addresses.createMany({
                data: [
                    { ...validAddress, street: 'Address 1' },
                    { ...validAddress, street: 'Address 2' }
                ]
            })

            const response = await request(app.getHttpServer())
                .get(`/address/customer/${customerId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)

            expect(response.body).toHaveLength(2)

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if ('length' in response.body && response.body.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                expect(response.body[0]).toMatchObject({
                    street: expect.any(String) as string,
                    customerId: customerId
                })
            }
        })

        it('should return empty array for customer with no addresses', async () => {
            const response = await request(app.getHttpServer())
                .get(`/address/customer/${customerId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)

            expect(response.body).toHaveLength(0)
        })

        it('should return 404 for non-existent customer', async () => {
            await request(app.getHttpServer())
                .get('/address/customer/999999')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404)
        })
    })

    describe('PATCH /address/:id', () => {
        let addressId: number

        beforeEach(async () => {
            const address = await prisma.addresses.create({
                data: validAddress
            })
            addressId = address.id
        })

        it('should update address (200)', async () => {
            const updateData: UpdateAddressRequestDto = {
                street: 'Updated Street',
                city: 'Updated City'
            }

            const response = await request(app.getHttpServer())
                .patch(`/address/${addressId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData)
                .expect(200)

            expect(response.body).toMatchObject(updateData)

            const dbAddress = await prisma.addresses.findUnique({
                where: { id: addressId }
            })
            expect(dbAddress?.street).toBe(updateData.street)
        })

        it('should prevent updating customerId (400)', async () => {
            const updateData = { customerId: 99999 }

            await request(app.getHttpServer())
                .patch(`/address/${addressId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData)
                .expect(400)
        })

        it('should return 404 for non-existent address', async () => {
            await request(app.getHttpServer())
                .patch('/address/999999')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ street: 'Updated' })
                .expect(404)
        })
    })

    describe('DELETE /address/:id', () => {
        it('should delete address (204)', async () => {
            const address = await prisma.addresses.create({
                data: validAddress
            })

            await request(app.getHttpServer())
                .delete(`/address/${address.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(204)

            const dbAddress = await prisma.addresses.findUnique({
                where: { id: address.id }
            })
            expect(dbAddress).toBeNull()
        })

        it('should return 404 for non-existent address', async () => {
            await request(app.getHttpServer())
                .delete('/address/999999')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404)
        })
    })

    describe('Security tests', () => {
        it('should return 401 for unauthenticated requests', async () => {
            // eslint-disable-next-line prettier/prettier
            await request(app.getHttpServer())
                .post('/address')
                .send(validAddress)
                .expect(401)
        })

        it('should prevent access with invalid token (401)', async () => {
            await request(app.getHttpServer())
                .get(`/address/customer/${customerId}`)
                .set('Authorization', 'Bearer invalid.token.here')
                .expect(401)
        })
    })
})
