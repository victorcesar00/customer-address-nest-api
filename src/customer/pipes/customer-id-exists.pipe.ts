import { BadRequestException, Injectable, NotFoundException, ParseIntPipe, PipeTransform } from '@nestjs/common'
import { CustomerAbstractService } from '@/customer/service/customer.abstract.service'

@Injectable()
export class CustomerIdExistsPipe implements PipeTransform<object | number> {
    constructor(private readonly customerService: CustomerAbstractService) {}

    private async validateCustomerId(value: unknown): Promise<number> {
        if (!value || value === null) {
            throw new BadRequestException('Customer id not provided')
        }

        let id: unknown = value

        if (typeof value === 'object') {
            if (!('customerId' in value) || ('customerId' in value && value.customerId === null)) {
                throw new BadRequestException('Customer id not provided')
            }

            id = value.customerId
        }

        const parsedId = await new ParseIntPipe().transform(id as string, { type: 'param' })

        return parsedId
    }

    async transform(value: unknown): Promise<object | number> {
        const validatedId = await this.validateCustomerId(value)

        const customer = await this.customerService.findById(validatedId)

        if (!customer) {
            throw new NotFoundException(`Customer with ID ${validatedId} does not exist.`)
        }

        return typeof value === 'object' ? { ...value, customerId: validatedId } : validatedId
    }
}
