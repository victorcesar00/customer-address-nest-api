import { Test, TestingModule } from '@nestjs/testing'
import { AddressRepository } from '@/address/repository/address.repository'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateAddressRequestDto } from '@/address/dtos/request/create-address-request.dto'
import { UpdateAddressRequestDto } from '@/address/dtos/request/update-address-request.dto'
import { IAddress } from '@/address/address.interface'

describe('AddressRepository', () => {
    let repository: AddressRepository
    let prismaMock: {
        addresses: {
            create: jest.Mock
            createMany: jest.Mock
            findUnique: jest.Mock
            findMany: jest.Mock
            update: jest.Mock
            delete: jest.Mock
        }
    }

    beforeEach(async () => {
        prismaMock = {
            addresses: {
                create: jest.fn(),
                createMany: jest.fn(),
                findUnique: jest.fn(),
                findMany: jest.fn(),
                update: jest.fn(),
                delete: jest.fn()
            }
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [AddressRepository, { provide: PrismaService, useValue: prismaMock }]
        }).compile()

        repository = module.get<AddressRepository>(AddressRepository)
    })

    describe('create', () => {
        it('should create address', async () => {
            const dto: CreateAddressRequestDto = {
                street: 'Rua X',
                neighborhood: 'Centro',
                city: 'Cidade',
                state: 'Estado',
                zipCode: '00000-000',
                customerId: 1
            }

            const created: IAddress = {
                id: 1,
                ...dto,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            prismaMock.addresses.create.mockResolvedValue(created)

            const result = await repository.create(dto)

            expect(result).toEqual(created)
            expect(prismaMock.addresses.create).toHaveBeenCalledWith({ data: dto })
        })

        it('should throw when creating address fails', async () => {
            prismaMock.addresses.create.mockRejectedValue(new Error('DB error'))
            await expect(repository.create({} as CreateAddressRequestDto)).rejects.toThrow('DB error')
        })
    })

    describe('createMany', () => {
        it('should create multiple addresses', async () => {
            const addressesData = [
                {
                    street: 'Rua 1',
                    neighborhood: 'Bairro 1',
                    city: 'Cidade 1',
                    state: 'Estado 1',
                    zipCode: '11111-111',
                    customerId: 1
                }
            ]

            const expectedResult = { count: 1 }
            prismaMock.addresses.createMany.mockResolvedValue(expectedResult)

            const result = await repository.createMany(addressesData)

            expect(result).toEqual(expectedResult)
            expect(prismaMock.addresses.createMany).toHaveBeenCalledWith({
                data: addressesData,
                skipDuplicates: true
            })
        })
    })

    describe('findById', () => {
        it('should find address by id', async () => {
            const address: IAddress = {
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

            prismaMock.addresses.findUnique.mockResolvedValue(address)

            const result = await repository.findById(1)

            expect(result).toEqual(address)
            expect(prismaMock.addresses.findUnique).toHaveBeenCalledWith({
                where: { id: 1 }
            })
        })

        it('should return null when address not found', async () => {
            prismaMock.addresses.findUnique.mockResolvedValue(null)
            const result = await repository.findById(999)
            expect(result).toBeNull()
        })
    })

    describe('findAllByCustomer', () => {
        it('should find all addresses by customer ID', async () => {
            const addresses: IAddress[] = [
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

            prismaMock.addresses.findMany.mockResolvedValue(addresses)

            const result = await repository.findAllByCustomer(1)

            expect(result).toEqual(addresses)
            expect(prismaMock.addresses.findMany).toHaveBeenCalledWith({
                where: { customerId: 1 }
            })
        })
    })

    describe('update', () => {
        it('should update address', async () => {
            const updatedAddress: IAddress = {
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

            prismaMock.addresses.update.mockResolvedValue(updatedAddress)

            const result = await repository.update(1, dto)

            expect(result).toEqual(updatedAddress)
            expect(prismaMock.addresses.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: dto
            })
        })
    })

    describe('delete', () => {
        it('should delete address', async () => {
            const deletedAddress: IAddress = {
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

            prismaMock.addresses.delete.mockResolvedValue(deletedAddress)

            const result = await repository.delete(1)

            expect(result).toBeUndefined()
            expect(prismaMock.addresses.delete).toHaveBeenCalledWith({
                where: { id: 1 }
            })
        })
    })
})
