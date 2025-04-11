import { PartialType } from '@nestjs/swagger'
import { CustomerAddressRequestDto } from '@/address/dtos/request/customer-address-request.dto'

export class UpdateAddressRequestDto extends PartialType(CustomerAddressRequestDto) {}
