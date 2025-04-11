import { Injectable } from '@nestjs/common'
import { CustomerAbstractRepository } from '@/customer/repository/customer.abstract.repository'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'
import { CustomerAbstractService } from '@/customer/service/customer.abstract.service'
import { ICustomer } from '@/customer/customer.interface'

@Injectable()
export class CustomerService implements CustomerAbstractService {
    constructor(private readonly customerRepository: CustomerAbstractRepository) {}

    async create(data: CreateCustomerRequestDto): Promise<ICustomer> {
        return await this.customerRepository.create(data)
    }

    async findById(id: number): Promise<ICustomer | null> {
        return await this.customerRepository.findById(id)
    }

    async findByEmail(email: string): Promise<ICustomer | null> {
        return await this.customerRepository.findByEmail(email)
    }

    async findByPhone(phone: string): Promise<ICustomer | null> {
        return await this.customerRepository.findByPhone(phone)
    }

    async findByTaxPayerId(taxPayerId: string): Promise<ICustomer | null> {
        return await this.customerRepository.findByTaxPayerId(taxPayerId)
    }
}
