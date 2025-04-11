import { Test, TestingModule } from '@nestjs/testing'
import { CustomerService } from '@/customer/service/customer.service'
import { CustomerAbstractRepository } from '@/customer/repository/customer.abstract.repository'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'
import { UpdateCustomerRequestDto } from '@/customer/dtos/request/update-customer-request.dto'
import { ICustomer } from '@/customer/interfaces/customer.interface'
import { ICustomerWithAddresses } from '@/customer/interfaces/customer-with-addresses.interface'

describe('CustomerService', () => {
    let service: CustomerService
    let repoMock: {
        create: jest.Mock
        findById: jest.Mock
        findByIdWithAddresses: jest.Mock
        findByEmail: jest.Mock
        findByPhone: jest.Mock
        findByTaxPayerId: jest.Mock
        update: jest.Mock
        delete: jest.Mock
    }

    beforeEach(async () => {
        repoMock = {
            create: jest.fn(),
            findById: jest.fn(),
            findByIdWithAddresses: jest.fn(),
            findByEmail: jest.fn(),
            findByPhone: jest.fn(),
            findByTaxPayerId: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [CustomerService, { provide: CustomerAbstractRepository, useValue: repoMock }]
        }).compile()

        service = module.get<CustomerService>(CustomerService)
    })

    describe('create', () => {
        it('should create customer with addresses', async () => {
            const dto = {
                name: 'John',
                addresses: [{ street: 'Main St' }]
            } as CreateCustomerRequestDto

            const created = {
                id: 1,
                ...dto,
                addresses: [{ id: 1, street: 'Main St' }]
            } as ICustomerWithAddresses

            repoMock.create.mockResolvedValue(created)

            const result = await service.create(dto)

            expect(result).toEqual(created)
            expect(repoMock.create).toHaveBeenCalledWith(dto)
        })
    })

    describe('findById', () => {
        it('should return customer by id', async () => {
            const customer = { id: 1 } as ICustomer
            repoMock.findById.mockResolvedValue(customer)

            const result = await service.findById(1)

            expect(result).toEqual(customer)
            expect(repoMock.findById).toHaveBeenCalledWith(1)
        })
    })

    describe('findByIdWithAddresses', () => {
        it('should return customer with addresses', async () => {
            const customer = {
                id: 1,
                name: 'Testeson',
                email: 'testeson@email.com',
                phone: '31999999999',
                gender: 'MALE',
                taxPayerId: '12345678900',
                addresses: [],
                createdAt: new Date(),
                updatedAt: new Date()
            } as ICustomerWithAddresses

            repoMock.findByIdWithAddresses.mockResolvedValue(customer)
            const result = await service.findByIdWithAddresses(1)

            expect(result).toEqual(customer)
            expect(repoMock.findByIdWithAddresses).toHaveBeenCalledWith(1)
        })
    })

    describe('update', () => {
        it('should update customer', async () => {
            const updated = { id: 1 } as ICustomer
            const dto = { name: 'Updated' } as UpdateCustomerRequestDto

            repoMock.update.mockResolvedValue(updated)

            const result = await service.update(1, dto)

            expect(result).toEqual(updated)
            expect(repoMock.update).toHaveBeenCalledWith(1, dto)
        })
    })
})
