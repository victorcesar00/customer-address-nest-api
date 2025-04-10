import { Injectable } from '@nestjs/common'
import { AddressAbstractService } from '@/address/service/address.abstract.service'
import { AddressAbstractRepository } from '@/address/repository/address.abstract.repository'
import { IAddress } from '@/address/address.interface'
import { CreateAddressRequestDto } from '@/address/dtos/create-address-request.dto'

@Injectable()
export class AddressService implements AddressAbstractService {
    constructor(private readonly addressRepository: AddressAbstractRepository) {}

    async create(data: CreateAddressRequestDto): Promise<IAddress> {
        return this.addressRepository.create(data)
    }

    async findById(id: number): Promise<IAddress | null> {
        return this.addressRepository.findById(id)
    }

    async findAllByCustomer(customerId: number): Promise<IAddress[]> {
        return this.addressRepository.findAllByCustomer(customerId)
    }
}
