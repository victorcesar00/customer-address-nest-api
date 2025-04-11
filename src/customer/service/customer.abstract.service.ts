import { ICustomer } from '@/customer/interfaces/customer.interface'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'
import { ICustomerWithAddresses } from '@/customer/interfaces/customer-with-addresses.interface'

export abstract class CustomerAbstractService {
    abstract create(data: CreateCustomerRequestDto): Promise<ICustomerWithAddresses>
    abstract findById(id: number): Promise<ICustomer | null>
    abstract findByEmail(email: string): Promise<ICustomer | null>
    abstract findByPhone(phone: string): Promise<ICustomer | null>
    abstract findByTaxPayerId(taxPayerId: string): Promise<ICustomer | null>
}
