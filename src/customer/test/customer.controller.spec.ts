import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { CustomerController } from '@/customer/customer.controller'
import { CustomerAbstractService } from '@/customer/service/customer.abstract.service'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'
import { UpdateCustomerRequestDto } from '@/customer/dtos/request/update-customer-request.dto'
import { CustomerResponseDto } from '@/customer/dtos/response/customer-response.dto'
import { CustomerWithAddressesResponseDto } from '@/customer/dtos/response/customer-with-adddresses-response.dto'
import { GenderEnum } from '_/prisma/generated/client'

describe('CustomerController', () => {
    let controller: CustomerController
    let serviceMock: {
        create: jest.Mock
        findById: jest.Mock
        findByIdWithAddresses: jest.Mock
        update: jest.Mock
        delete: jest.Mock
    }

    beforeEach(async () => {
        serviceMock = {
            create: jest.fn(),
            findById: jest.fn(),
            findByIdWithAddresses: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }

        const module: TestingModule = await Test.createTestingModule({
            controllers: [CustomerController],
            providers: [
                {
                    provide: CustomerAbstractService,
                    useValue: serviceMock
                }
            ]
        }).compile()

        controller = module.get<CustomerController>(CustomerController)
    })

    describe('create', () => {
        it('should create new customer', async () => {
            const dto = {} as CreateCustomerRequestDto
            const created = { id: 1 } as CustomerWithAddressesResponseDto

            serviceMock.create.mockResolvedValue(created)

            const result = await controller.create(dto)

            expect(result).toEqual(created)
            expect(serviceMock.create).toHaveBeenCalledWith(dto)
        })
    })

    describe('findOne', () => {
        it('should return customer by id', async () => {
            const customer = { id: 1 } as CustomerResponseDto
            serviceMock.findById.mockResolvedValue(customer)

            const result = await controller.findOne(1)

            expect(result).toEqual(customer)
            expect(serviceMock.findById).toHaveBeenCalledWith(1)
        })

        it('should throw 404 for non-existent customer', async () => {
            serviceMock.findById.mockRejectedValue(new NotFoundException())
            await expect(controller.findOne(999)).rejects.toThrow(NotFoundException)
        })
    })

    describe('findOneWithAddresses', () => {
        it('should return customer with addresses', async () => {
            const customer = {
                id: 1,
                name: 'Testeson',
                email: 'testeson@email.com',
                phone: '31999999999',
                gender: GenderEnum.MALE,
                taxPayerId: '123.456.789-00',
                createdAt: new Date(),
                updatedAt: new Date(),
                addresses: []
            } as CustomerWithAddressesResponseDto

            serviceMock.findByIdWithAddresses.mockResolvedValue(customer)

            const result = await controller.findOneWithAddresses(1)

            expect(result).toEqual(customer)
            expect(serviceMock.findByIdWithAddresses).toHaveBeenCalledWith(1)
        })
    })

    describe('update', () => {
        it('should update customer', async () => {
            const updated = { id: 1 } as CustomerResponseDto
            const dto = {} as UpdateCustomerRequestDto

            serviceMock.update.mockResolvedValue(updated)

            const result = await controller.update(1, dto)

            expect(result).toEqual(updated)
            expect(serviceMock.update).toHaveBeenCalledWith(1, dto)
        })
    })

    describe('delete', () => {
        it('should delete customer', async () => {
            serviceMock.delete.mockResolvedValue(undefined)
            await controller.delete(1)
            expect(serviceMock.delete).toHaveBeenCalledWith(1)
        })
    })
})
