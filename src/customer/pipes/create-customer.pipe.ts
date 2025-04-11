import { BadRequestException, ConflictException, Injectable, PipeTransform } from '@nestjs/common'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'
import { normalizePhone, normalizeString } from '@/common/utils/string-utils.util'
import { CustomerAbstractService } from '@/customer/service/customer.abstract.service'

@Injectable()
export class CreateCustomerPipe implements PipeTransform<CreateCustomerRequestDto> {
    constructor(private readonly customerService: CustomerAbstractService) {}

    private normalizeFields(body: CreateCustomerRequestDto): CreateCustomerRequestDto {
        if (body.phone) {
            body.phone = normalizePhone(body.phone)
        }

        if (body.taxPayerId) {
            body.taxPayerId = normalizeString(body.taxPayerId)
        }

        return body
    }

    private async checkExistence(body: CreateCustomerRequestDto): Promise<void> {
        const errors = []

        const [emailExists, phoneExists, taxIdExists] = await Promise.all([
            this.customerService.findByEmail(body.email),
            this.customerService.findByPhone(body.phone),
            this.customerService.findByTaxPayerId(body.taxPayerId)
        ])

        if (emailExists) errors.push('Email already registered')
        if (phoneExists) errors.push('Phone already registered')
        if (taxIdExists) errors.push('Tax Payer ID already registered')

        if (errors.length !== 0) {
            throw new ConflictException(errors)
        }
    }

    async transform(body: CreateCustomerRequestDto): Promise<CreateCustomerRequestDto> {
        if (!body || typeof body !== 'object') {
            throw new BadRequestException('Customer data not provided')
        }

        body = this.normalizeFields(body)
        await this.checkExistence(body)

        return body
    }
}
