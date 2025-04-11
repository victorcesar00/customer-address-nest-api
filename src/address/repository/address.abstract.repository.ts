import { IAddress } from '@/address/address.interface'
import { CreateAddressRequestDto } from '@/address/dtos/request/create-address-request.dto'
import { Prisma } from '_/prisma/generated/client'

export abstract class AddressAbstractRepository {
    abstract create(data: CreateAddressRequestDto): Promise<IAddress>
    abstract createMany(data: CreateAddressRequestDto[]): Promise<Prisma.BatchPayload>
    abstract findById(id: number): Promise<IAddress | null>
    abstract findAllByCustomer(customerId: number): Promise<IAddress[]>
    abstract update(id: number, data: Partial<CreateAddressRequestDto>): Promise<IAddress>
    abstract delete(id: number): Promise<void>
}
