import { ICustomer } from '@/customer/interfaces/customer.interface'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'
import { ICustomerWithAddresses } from '@/customer/interfaces/customer-with-addresses.interface'
import { UpdateCustomerRequestDto } from '@/customer/dtos/request/update-customer-request.dto'

export abstract class CustomerAbstractService {
    abstract create(data: CreateCustomerRequestDto): Promise<ICustomerWithAddresses>
    abstract findById(id: number): Promise<ICustomer | null>
    abstract findByIdWithAddresses(id: number): Promise<ICustomerWithAddresses | null>
    abstract findByEmail(email: string): Promise<ICustomer | null>
    abstract findByPhone(phone: string): Promise<ICustomer | null>
    abstract findByTaxPayerId(taxPayerId: string): Promise<ICustomer | null>
    abstract update(id: number, data: UpdateCustomerRequestDto): Promise<ICustomer>
    abstract delete(id: number): Promise<void>
}
