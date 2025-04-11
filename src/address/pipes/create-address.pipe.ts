import { Injectable, PipeTransform } from '@nestjs/common'
import { CustomerAbstractService } from '@/customer/service/customer.abstract.service'
import { CreateAddressRequestDto } from '@/address/dtos/request/create-address-request.dto'
import { CustomerIdExistsPipe } from '@/customer/pipes/customer-id-exists.pipe'

@Injectable()
export class CreateAddressPipe implements PipeTransform<CreateAddressRequestDto> {
    constructor(private readonly customerService: CustomerAbstractService) {}

    async transform(value: CreateAddressRequestDto): Promise<CreateAddressRequestDto> {
        return (await new CustomerIdExistsPipe(this.customerService).transform(value)) as CreateAddressRequestDto
    }
}
