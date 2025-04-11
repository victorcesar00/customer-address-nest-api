import { Test, TestingModule } from '@nestjs/testing'
import { CustomerRepository } from '@/customer/repository/customer.repository'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'
import { UpdateCustomerRequestDto } from '@/customer/dtos/request/update-customer-request.dto'
import { ICustomer } from '@/customer/interfaces/customer.interface'
import { ICustomerWithAddresses } from '@/customer/interfaces/customer-with-addresses.interface'

describe('CustomerRepository', () => {
    let repository: CustomerRepository
    let prismaMock: jest.Mocked<PrismaService>
    let createMock: jest.Mock
    let findUniqueMock: jest.Mock
    let updateMock: jest.Mock
    let deleteMock: jest.Mock

    beforeEach(async () => {
        createMock = jest.fn()
        findUniqueMock = jest.fn()
        updateMock = jest.fn()
        deleteMock = jest.fn()

        prismaMock = {
            customers: {
                create: createMock,
                findUnique: findUniqueMock,
                update: updateMock,
                delete: deleteMock
            }
        } as unknown as jest.Mocked<PrismaService>

        const module: TestingModule = await Test.createTestingModule({
            providers: [CustomerRepository, { provide: PrismaService, useValue: prismaMock }]
        }).compile()

        repository = module.get<CustomerRepository>(CustomerRepository)
    })

    it('should create customer with addresses', async () => {
        const dto = {
            name: 'João',
            email: 'joao@example.com',
            phone: '31999999999',
            gender: 'MALE',
            taxPayerId: '12345678900',
            addresses: [
                {
                    street: 'Rua A',
                    neighborhood: 'Centro',
                    city: 'Cidade',
                    state: 'Estado',
                    zipCode: '12345-678'
                }
            ]
        } as CreateCustomerRequestDto

        const created: ICustomerWithAddresses = {
            id: 1,
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            gender: dto.gender,
            taxPayerId: dto.taxPayerId,
            createdAt: new Date(),
            updatedAt: new Date(),
            addresses:
                dto.addresses?.map((a, i) => ({
                    id: i + 1,
                    street: a.street,
                    neighborhood: a.neighborhood,
                    city: a.city,
                    state: a.state,
                    zipCode: a.zipCode,
                    customerId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })) || []
        }

        createMock.mockResolvedValue(created)

        const result = await repository.create(dto)

        expect(result).toEqual(created)
        expect(createMock).toHaveBeenCalledWith({
            data: {
                ...dto,
                addresses: { create: dto.addresses }
            },
            include: { addresses: true }
        })
    })

    it('should find customer by id', async () => {
        const customer: ICustomer = {
            id: 1,
            name: 'Testeson',
            email: 'testeson@email.com',
            phone: '31999999999',
            gender: 'MALE',
            taxPayerId: '12345678900',
            createdAt: new Date(),
            updatedAt: new Date()
        }

        findUniqueMock.mockResolvedValue(customer)

        const result = await repository.findById(1)

        expect(result).toEqual(customer)
        expect(findUniqueMock).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it('should find customer by id with addresses', async () => {
        const customer: ICustomerWithAddresses = {
            id: 1,
            name: 'Testeson',
            email: 'testeson@email.com',
            phone: '31999999999',
            gender: 'MALE',
            taxPayerId: '12345678900',
            addresses: [],
            createdAt: new Date(),
            updatedAt: new Date()
        }

        findUniqueMock.mockResolvedValue(customer)

        const result = await repository.findByIdWithAddresses(1)

        expect(result).toEqual(customer)
        expect(findUniqueMock).toHaveBeenCalledWith({
            where: { id: 1 },
            include: { addresses: true }
        })
    })

    it('should find by email', async () => {
        const customer = { id: 1, email: 'x@example.com' } as ICustomer

        findUniqueMock.mockResolvedValue(customer)

        const result = await repository.findByEmail('x@example.com')

        expect(result).toEqual(customer)
        expect(findUniqueMock).toHaveBeenCalledWith({ where: { email: 'x@example.com' } })
    })

    it('should find by phone', async () => {
        const customer = { id: 1, phone: '999999999' } as ICustomer

        findUniqueMock.mockResolvedValue(customer)

        const result = await repository.findByPhone('999999999')

        expect(result).toEqual(customer)
        expect(findUniqueMock).toHaveBeenCalledWith({ where: { phone: '999999999' } })
    })

    it('should find by taxPayerId', async () => {
        const customer = { id: 1, taxPayerId: '12345678900' } as ICustomer

        findUniqueMock.mockResolvedValue(customer)

        const result = await repository.findByTaxPayerId('12345678900')

        expect(result).toEqual(customer)
        expect(findUniqueMock).toHaveBeenCalledWith({ where: { taxPayerId: '12345678900' } })
    })

    it('should update customer', async () => {
        const updated = { id: 1, name: 'Novo Nome' } as ICustomer
        const dto = { name: 'Novo Nome' } as UpdateCustomerRequestDto

        updateMock.mockResolvedValue(updated)

        const result = await repository.update(1, dto)

        expect(result).toEqual(updated)
        expect(updateMock).toHaveBeenCalledWith({
            where: { id: 1 },
            data: dto
        })
    })

    it('should delete customer', async () => {
        deleteMock.mockResolvedValue(undefined)

        await repository.delete(1)

        expect(deleteMock).toHaveBeenCalledWith({ where: { id: 1 } })
    })
})
