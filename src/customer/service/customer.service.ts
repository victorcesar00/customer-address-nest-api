import { Injectable } from '@nestjs/common'
import { CustomerAbstractRepository } from '@/customer/repository/customer.abstract.repository'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'
import { CustomerAbstractService } from '@/customer/service/customer.abstract.service'
import { ICustomer } from '@/customer/customer.interface'

@Injectable()
export class CustomerService implements CustomerAbstractService {
    constructor(private readonly customerRepository: CustomerAbstractRepository) {}

    async create(data: CreateCustomerRequestDto): Promise<ICustomer> {
        return this.customerRepository.create(data)
    }

    async findByEmail(email: string): Promise<ICustomer | null> {
        return this.customerRepository.findByEmail(email)
    }

    async findByPhone(phone: string): Promise<ICustomer | null> {
        return this.customerRepository.findByPhone(phone)
    }

    async findByTaxPayerId(taxPayerId: string): Promise<ICustomer | null> {
        return this.customerRepository.findByTaxPayerId(taxPayerId)
    }
}
