import { Injectable } from '@nestjs/common'
import { CustomerAbstractRepository } from '@/customer/repository/customer.abstract.repository'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'
import { CustomerAbstractService } from '@/customer/service/customer.abstract.service'
import { ICustomer } from '@/customer/interfaces/customer.interface'
import { ICustomerWithAddresses } from '@/customer/interfaces/customer-with-addresses.interface'
import { UpdateCustomerRequestDto } from '@/customer/dtos/request/update-customer-request.dto'

@Injectable()
export class CustomerService implements CustomerAbstractService {
    constructor(private readonly customerRepository: CustomerAbstractRepository) {}

    async create(data: CreateCustomerRequestDto): Promise<ICustomerWithAddresses> {
        return await this.customerRepository.create(data)
    }

    async findById(id: number): Promise<ICustomer | null> {
        return await this.customerRepository.findById(id)
    }

    async findByIdWithAddresses(id: number): Promise<ICustomerWithAddresses | null> {
        return await this.customerRepository.findByIdWithAddresses(id)
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

    async update(id: number, data: UpdateCustomerRequestDto): Promise<ICustomer> {
        return await this.customerRepository.update(id, data)
    }

    async delete(id: number): Promise<void> {
        await this.customerRepository.delete(id)
    }
}
