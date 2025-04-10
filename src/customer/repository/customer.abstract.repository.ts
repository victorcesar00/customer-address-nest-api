import { ICustomer } from '@/customer/customer.interface'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'

export abstract class CustomerAbstractRepository {
    abstract create(data: CreateCustomerRequestDto): Promise<ICustomer>
    abstract findById(id: number): Promise<ICustomer | null>
    abstract findByEmail(email: string): Promise<ICustomer | null>
    abstract findByPhone(phone: string): Promise<ICustomer | null>
    abstract findByTaxPayerId(taxPayerId: string): Promise<ICustomer | null>
}
