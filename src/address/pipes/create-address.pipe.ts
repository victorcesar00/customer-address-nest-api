import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { CustomerAbstractService } from '@/customer/service/customer.abstract.service'
import { CreateAddressRequestDto } from '@/address/dtos/request/create-address-request.dto'

@Injectable()
export class CreateAddressPipe implements PipeTransform {
    constructor(private readonly customerService: CustomerAbstractService) {}

    async transform(value: CreateAddressRequestDto) {
        const customer = await this.customerService.findById(value.customerId)

        if (!customer) {
            throw new BadRequestException(`Customer with ID ${value.customerId} does not exist.`)
        }

        return value
    }
}
