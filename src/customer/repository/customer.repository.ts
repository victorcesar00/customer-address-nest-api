import { Injectable } from '@nestjs/common'
import { CustomerAbstractRepository } from '@/customer/repository/customer.abstract.repository'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'
import { ICustomer } from '@/customer/customer.interface'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class CustomerRepository implements CustomerAbstractRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateCustomerRequestDto): Promise<ICustomer> {
        return await this.prisma.customers.create({ data })
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
