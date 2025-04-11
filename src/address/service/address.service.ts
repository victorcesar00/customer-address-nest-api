import { Injectable } from '@nestjs/common'
import { AddressAbstractService } from '@/address/service/address.abstract.service'
import { AddressAbstractRepository } from '@/address/repository/address.abstract.repository'
import { IAddress } from '@/address/address.interface'
import { CreateAddressRequestDto } from '@/address/dtos/request/create-address-request.dto'
import { Prisma } from '_/prisma/generated/client'

@Injectable()
export class AddressService implements AddressAbstractService {
    constructor(private readonly addressRepository: AddressAbstractRepository) {}

    async create(data: CreateAddressRequestDto): Promise<IAddress> {
        return await this.addressRepository.create(data)
    }

    async createMany(data: CreateAddressRequestDto[]): Promise<Prisma.BatchPayload> {
        return await this.addressRepository.createMany(data)
    }

    async findById(id: number): Promise<IAddress | null> {
        return await this.addressRepository.findById(id)
    }

    async findAllByCustomer(customerId: number): Promise<IAddress[]> {
        return await this.addressRepository.findAllByCustomer(customerId)
    }

    async update(id: number, data: Partial<CreateAddressRequestDto>): Promise<IAddress> {
        return await this.addressRepository.update(id, data)
    }

    async delete(id: number): Promise<void> {
        await this.addressRepository.delete(id)
    }
}
