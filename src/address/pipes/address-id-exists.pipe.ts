import { BadRequestException, Injectable, NotFoundException, ParseIntPipe, PipeTransform } from '@nestjs/common'
import { AddressAbstractService } from '@/address/service/address.abstract.service'

@Injectable()
export class AddressIdExistsPipe implements PipeTransform<number> {
    constructor(private readonly addressService: AddressAbstractService) {}

    private async validateAddressId(value: unknown): Promise<number> {
        if (!value || value === null) {
            throw new BadRequestException('Address id not provided')
        }

        const parsedId = await new ParseIntPipe().transform(value as string, { type: 'param' })

        return parsedId
    }

    async transform(value: string | number): Promise<number> {
        const validatedId = await this.validateAddressId(value)

        const address = await this.addressService.findById(validatedId)

        if (!address || value === null) {
            throw new NotFoundException(`Address with ID ${validatedId} does not exist.`)
        }

        return validatedId
    }
}
