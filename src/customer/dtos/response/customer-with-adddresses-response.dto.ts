import { Expose } from 'class-transformer'
import { CustomerResponseDto } from '@/customer/dtos/response/customer-response.dto'
import { AddressResponseDto } from '@/address/dtos/response/address-response.dto'

export class CustomerWithAddressesResponseDto extends CustomerResponseDto {
    @Expose()
    addresses: AddressResponseDto[]
}
