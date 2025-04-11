import { Injectable } from '@nestjs/common'
import { CustomerAbstractRepository } from '@/customer/repository/customer.abstract.repository'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'
import { ICustomer } from '@/customer/interfaces/customer.interface'
import { PrismaService } from '@/prisma/prisma.service'
import { ICustomerWithAddresses } from '@/customer/interfaces/customer-with-addresses.interface'

@Injectable()
export class CustomerRepository implements CustomerAbstractRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateCustomerRequestDto): Promise<ICustomerWithAddresses> {
        const prismaData = {
            ...data,
            addresses: data.addresses ? { create: data.addresses } : undefined
        }

        return await this.prisma.customers.create({ data: prismaData, include: { addresses: true } })
    }

    async findById(id: number): Promise<ICustomer | null> {
        return await this.prisma.customers.findUnique({ where: { id } })
    }

    async findByEmail(email: string): Promise<ICustomer | null> {
        return await this.prisma.customers.findUnique({ where: { email } })
    }

    async findByPhone(phone: string): Promise<ICustomer | null> {
        return await this.prisma.customers.findUnique({ where: { phone } })
    }

    async findByTaxPayerId(taxPayerId: string): Promise<ICustomer | null> {
        return await this.prisma.customers.findUnique({ where: { taxPayerId } })
    }
}
