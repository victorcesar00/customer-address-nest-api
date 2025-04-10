import { IAddress } from '@/address/address.interface'
import { CreateAddressRequestDto } from '@/address/dtos/create-address-request.dto'

export abstract class AddressAbstractService {
    abstract create(data: CreateAddressRequestDto): Promise<IAddress>
    abstract findById(id: number): Promise<IAddress | null>
    abstract findAllByCustomer(customerId: number): Promise<IAddress[]>
}
