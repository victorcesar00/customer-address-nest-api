import { IsNotEmpty, IsInt } from 'class-validator'
import { CustomerAddressRequestDto } from '@/address/dtos/request/customer-address-request.dto'
import { Transform } from 'class-transformer'

export class CreateAddressRequestDto extends CustomerAddressRequestDto {
    @IsInt()
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value, 10)) // evitar over engineering de criar um pipe para uma unica transformacao
    customerId: number
}
