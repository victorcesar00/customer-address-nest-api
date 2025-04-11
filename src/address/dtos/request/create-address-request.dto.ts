import { IsNotEmpty, IsInt } from 'class-validator'
import { CustomerAddressRequestDto } from '@/address/dtos/request/customer-address-request.dto'

export class CreateAddressRequestDto extends CustomerAddressRequestDto {
    @IsInt()
    @IsNotEmpty()
    customerId: number
}
