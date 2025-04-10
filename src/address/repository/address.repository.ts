import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { AddressAbstractRepository } from '@/address/repository/address.abstract.repository'
import { IAddress } from '@/address/address.interface'
import { CreateAddressRequestDto } from '@/address/dtos/create-address-request.dto'

@Injectable()
export class AddressRepository implements AddressAbstractRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateAddressRequestDto): Promise<IAddress> {
        return this.prisma.addresses.create({ data })
    }

    async findById(id: number): Promise<IAddress | null> {
        return this.prisma.addresses.findUnique({ where: { id } })
    }

    async findAllByCustomer(customerId: number): Promise<IAddress[]> {
        return this.prisma.addresses.findMany({ where: { customerId } })
    }
}
