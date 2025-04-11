import { BadRequestException, ConflictException, Injectable, PipeTransform } from '@nestjs/common'
import { normalizePhone } from '@/common/utils/string-utils.util'
import { CustomerAbstractService } from '@/customer/service/customer.abstract.service'
import { UpdateCustomerRequestDto } from '@/customer/dtos/request/update-customer-request.dto'

@Injectable()
export class UpdateCustomerPipe implements PipeTransform<UpdateCustomerRequestDto> {
    constructor(private readonly customerService: CustomerAbstractService) {}

    private normalizePhone(body: UpdateCustomerRequestDto): UpdateCustomerRequestDto {
        if (body.phone) {
            body.phone = normalizePhone(body.phone)
        }

        return body
    }

    private async checkExistence(body: UpdateCustomerRequestDto): Promise<void> {
        const errors = []

        if (body.email) {
            const emailExists = await this.customerService.findByEmail(body.email)

            if (emailExists) errors.push('Email already registered')
        }

        if (body.phone) {
            const phoneExists = await this.customerService.findByPhone(body.phone)

            if (phoneExists) errors.push('Phone already registered')
        }

        if (errors.length !== 0) {
            throw new ConflictException(errors)
        }
    }

    async transform(body: UpdateCustomerRequestDto): Promise<UpdateCustomerRequestDto> {
        if (!body || typeof body !== 'object') {
            throw new BadRequestException('Customer data not provided')
        }

        body = this.normalizePhone(body)
        await this.checkExistence(body)

        return body
    }
}
