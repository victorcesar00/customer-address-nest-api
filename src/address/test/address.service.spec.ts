import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { AddressService } from '@/address/service/address.service'
import { AddressAbstractRepository } from '@/address/repository/address.abstract.repository'
import { CreateAddressRequestDto } from '@/address/dtos/request/create-address-request.dto'
import { UpdateAddressRequestDto } from '@/address/dtos/request/update-address-request.dto'
import { IAddress } from '@/address/address.interface'
import { Prisma } from '_/prisma/generated/client'

describe('AddressService', () => {
    let service: AddressService
    let repoMock: {
        create: jest.Mock
        createMany: jest.Mock
        findById: jest.Mock
        findAllByCustomer: jest.Mock
        update: jest.Mock
        delete: jest.Mock
    }

    beforeEach(async () => {
        repoMock = {
            create: jest.fn(),
            createMany: jest.fn(),
            findById: jest.fn(),
            findAllByCustomer: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [AddressService, { provide: AddressAbstractRepository, useValue: repoMock }]
        }).compile()

        service = module.get<AddressService>(AddressService)
    })

    describe('create', () => {
        it('should create address', async () => {
            const dto: CreateAddressRequestDto = {
                street: 'Rua A',
                neighborhood: 'Bairro B',
                city: 'Cidade C',
                state: 'Estado D',
                zipCode: '12345-678',
                customerId: 1
            }

            const mockResult: IAddress = {
                id: 1,
                ...dto,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            repoMock.create.mockResolvedValue(mockResult)

            const result = await service.create(dto)

            expect(result).toEqual(mockResult)
            expect(repoMock.create).toHaveBeenCalledWith(dto)
        })

        it('should propagate repository errors', async () => {
            repoMock.create.mockRejectedValue(new Error('DB error'))
            await expect(service.create({} as CreateAddressRequestDto)).rejects.toThrow('DB error')
        })
    })

    describe('createMany', () => {
        it('should create multiple addresses', async () => {
            const dtoList: CreateAddressRequestDto[] = [
                {
                    street: 'Rua 1',
                    neighborhood: 'Bairro 1',
                    city: 'Cidade 1',
                    state: 'Estado 1',
                    zipCode: '11111-111',
                    customerId: 1
                }
            ]

            const mockPayload: Prisma.BatchPayload = { count: 1 }
            repoMock.createMany.mockResolvedValue(mockPayload)

            const result = await service.createMany(dtoList)

            expect(result).toEqual(mockPayload)
            expect(repoMock.createMany).toHaveBeenCalledWith(dtoList)
        })
    })

    describe('findById', () => {
        it('should find address by id', async () => {
            const mockAddress: IAddress = {
                id: 1,
                street: 'Rua X',
                neighborhood: 'Centro',
                city: 'Cidade',
                state: 'Estado',
                zipCode: '00000-000',
                customerId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            repoMock.findById.mockResolvedValue(mockAddress)

            const result = await service.findById(1)

            expect(result).toEqual(mockAddress)
            expect(repoMock.findById).toHaveBeenCalledWith(1)
        })

        it('should return null for non-existent address', async () => {
            repoMock.findById.mockResolvedValue(null)
            const result = await service.findById(999)
            expect(result).toBeNull()
        })
    })

    describe('findAllByCustomer', () => {
        it('should find all addresses by customer id', async () => {
            const mockList: IAddress[] = [
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

            repoMock.findAllByCustomer.mockResolvedValue(mockList)

            const result = await service.findAllByCustomer(1)

            expect(result).toEqual(mockList)
            expect(repoMock.findAllByCustomer).toHaveBeenCalledWith(1)
        })

        it('should return empty array for customer with no addresses', async () => {
            repoMock.findAllByCustomer.mockResolvedValue([])
            const result = await service.findAllByCustomer(999)
            expect(result).toEqual([])
        })
    })

    describe('update', () => {
        it('should update address', async () => {
            const updated: IAddress = {
                id: 1,
                street: 'Nova Rua',
                neighborhood: 'Centro',
                city: 'Cidade',
                state: 'Estado',
                zipCode: '00000-000',
                customerId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const dto: UpdateAddressRequestDto = {
                street: 'Nova Rua'
            }

            repoMock.update.mockResolvedValue(updated)

            const result = await service.update(1, dto)

            expect(result).toEqual(updated)
            expect(repoMock.update).toHaveBeenCalledWith(1, dto)
        })

        it('should throw when updating non-existent address', async () => {
            repoMock.update.mockResolvedValue(null)
            repoMock.update.mockRejectedValue(new NotFoundException('Address not found'))
            await expect(service.update(999, {})).rejects.toThrow(NotFoundException)
        })
    })

    describe('delete', () => {
        it('should delete address', async () => {
            repoMock.delete.mockResolvedValue(undefined)
            await service.delete(1)
            expect(repoMock.delete).toHaveBeenCalledWith(1)
        })

        it('should throw when deleting non-existent address', async () => {
            repoMock.delete.mockRejectedValue(new NotFoundException())
            await expect(service.delete(999)).rejects.toThrow(NotFoundException)
        })
    })
})
