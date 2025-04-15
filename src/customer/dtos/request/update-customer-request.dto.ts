import { OmitType, PartialType } from '@nestjs/swagger'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'

export class UpdateCustomerRequestDto extends PartialType(
    OmitType(CreateCustomerRequestDto, ['taxPayerId', 'addresses'] as const)
) {}
