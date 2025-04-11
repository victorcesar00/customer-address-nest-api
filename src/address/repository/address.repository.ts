import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { AddressAbstractRepository } from '@/address/repository/address.abstract.repository'
import { IAddress } from '@/address/address.interface'
import { CreateAddressRequestDto } from '@/address/dtos/request/create-address-request.dto'
import { Prisma } from '_/prisma/generated/client'

@Injectable()
export class AddressRepository implements AddressAbstractRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateAddressRequestDto): Promise<IAddress> {
        return await this.prisma.addresses.create({ data })
    }

    async createMany(data: CreateAddressRequestDto[]): Promise<Prisma.BatchPayload> {
        return await this.prisma.addresses.createMany({ data, skipDuplicates: true })
    }

    async findById(id: number): Promise<IAddress | null> {
        return await this.prisma.addresses.findUnique({ where: { id } })
    }

    async findAllByCustomer(customerId: number): Promise<IAddress[]> {
        return await this.prisma.addresses.findMany({ where: { customerId } })
    }

    async update(id: number, data: Partial<CreateAddressRequestDto>): Promise<IAddress> {
        return await this.prisma.addresses.update({
            where: { id },
            data
        })
    }

    async delete(id: number): Promise<void> {
        await this.prisma.addresses.delete({ where: { id } })
    }
}
