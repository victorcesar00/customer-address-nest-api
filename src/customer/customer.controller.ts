import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    ClassSerializerInterceptor,
    SerializeOptions,
    UseGuards,
    UsePipes
} from '@nestjs/common'
import { CustomerAbstractService } from '@/customer/service/customer.abstract.service'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'
import { CustomerResponseDto } from '@/customer/dtos/response/customer-response.dto'
import { AuthGuard } from '@nestjs/passport'
import { CreateCustomerPipe } from '@/customer/pipes/create-customer.pipe'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerAbstractService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(CreateCustomerPipe)
    @SerializeOptions({ type: CustomerResponseDto })
    async create(@Body() dto: CreateCustomerRequestDto): Promise<CustomerResponseDto> {
        return await this.customerService.create(dto)
    }
}
