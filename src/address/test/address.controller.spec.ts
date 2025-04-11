import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { AddressController } from '@/address/address.controller'
import { AddressAbstractService } from '@/address/service/address.abstract.service'
import { CreateAddressRequestDto } from '@/address/dtos/request/create-address-request.dto'
import { UpdateAddressRequestDto } from '@/address/dtos/request/update-address-request.dto'
import { AddressResponseDto } from '@/address/dtos/response/address-response.dto'
import { CustomerIdExistsPipe } from '@/customer/pipes/customer-id-exists.pipe'
import { AddressIdExistsPipe } from '@/address/pipes/address-id-exists.pipe'

describe('AddressController', () => {
    let controller: AddressController
    let serviceMock: {
        create: jest.Mock
        findAllByCustomer: jest.Mock
        update: jest.Mock
        delete: jest.Mock
    }

    beforeEach(async () => {
        serviceMock = {
            create: jest.fn(),
            findAllByCustomer: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AddressController],
            providers: [
                {
                    provide: AddressAbstractService,
                    useValue: serviceMock
                }
            ]
        })
            .overridePipe(CustomerIdExistsPipe)
            .useValue({ transform: jest.fn((v) => v) })
            .overridePipe(AddressIdExistsPipe)
            .useValue({ transform: jest.fn((v) => v) })
            .compile()

        controller = module.get<AddressController>(AddressController)
    })

    describe('create', () => {
        it('should create an address', async () => {
            const dto: CreateAddressRequestDto = {
                street: 'Rua A',
                neighborhood: 'Bairro B',
                city: 'Cidade C',
                state: 'Estado D',
                zipCode: '12345-678',
                customerId: 1
            }

            const address: AddressResponseDto = {
                id: 1,
                street: dto.street,
                neighborhood: dto.neighborhood,
                city: dto.city,
                state: dto.state,
                zipCode: dto.zipCode,
                customerId: dto.customerId,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            serviceMock.create.mockResolvedValue(address)

            const result = await controller.create(dto)

            expect(result).toEqual(address)
            expect(serviceMock.create).toHaveBeenCalledWith(dto)
        })

        it('should reject invalid DTO', async () => {
            const invalidDto = {} as CreateAddressRequestDto
            serviceMock.create.mockRejectedValue(new BadRequestException())
            await expect(controller.create(invalidDto)).rejects.toThrow(BadRequestException)
        })
    })

    describe('findAllByCustomer', () => {
        it('should return all addresses by customer ID', async () => {
            const addressList: AddressResponseDto[] = [
                {
                    id: 1,
                    street: 'Rua 1',
                    neighborhood: 'Bairro 1',
                    city: 'Cidade 1',
                    state: 'Estado 1',
                    zipCode: '11111-111',
                    customerId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]

            serviceMock.findAllByCustomer.mockResolvedValue(addressList)

            const result = await controller.findAllByCustomer(1)

            expect(result).toEqual(addressList)
            expect(serviceMock.findAllByCustomer).toHaveBeenCalledWith(1)
        })

        it('should return empty array if no addresses found', async () => {
            serviceMock.findAllByCustomer.mockResolvedValue([])
            const result = await controller.findAllByCustomer(999)
            expect(result).toEqual([])
        })
    })

    describe('update', () => {
        it('should update an address', async () => {
            const dto: UpdateAddressRequestDto = {
                street: 'Nova Rua'
            }

            const updatedAddress: AddressResponseDto = {
                id: 1,
                street: 'Nova Rua',
                neighborhood: 'Bairro',
                city: 'Cidade',
                state: 'Estado',
                zipCode: '00000-000',
                customerId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            serviceMock.update.mockResolvedValue(updatedAddress)

            const result = await controller.update(1, dto)

            expect(result).toEqual(updatedAddress)
            expect(serviceMock.update).toHaveBeenCalledWith(1, dto)
        })

        it('should throw 404 when address does not exist', async () => {
            serviceMock.update.mockRejectedValue(new NotFoundException())
            await expect(controller.update(999, {} as UpdateAddressRequestDto)).rejects.toThrow(NotFoundException)
        })
    })

    describe('delete', () => {
        it('should delete an address', async () => {
            serviceMock.delete.mockResolvedValue(undefined)
            await controller.delete(1)
            expect(serviceMock.delete).toHaveBeenCalledWith(1)
        })

        it('should throw 404 when address does not exist', async () => {
            serviceMock.delete.mockRejectedValue(new NotFoundException())
            await expect(controller.delete(999)).rejects.toThrow(NotFoundException)
        })
    })
})
