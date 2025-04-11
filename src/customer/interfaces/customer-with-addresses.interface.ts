import { ICustomer } from '@/customer/interfaces/customer.interface'
import { IAddress } from '@/address/address.interface'

export interface ICustomerWithAddresses extends ICustomer {
    addresses: IAddress[]
}
