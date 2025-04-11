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
import { AuthGuard } from '@nestjs/passport'
import { CreateCustomerPipe } from '@/customer/pipes/create-customer.pipe'
import { CustomerWithAddressesResponseDto } from '@/customer/dtos/response/customer-with-adddresses-response.dto'

@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerAbstractService) {}

    @Post()
    @UsePipes(CreateCustomerPipe) // transforma campos com mascara e valida se algum dos campos unicos ja existe no banco
    @SerializeOptions({ type: CustomerWithAddressesResponseDto })
    async create(@Body() dto: CreateCustomerRequestDto): Promise<CustomerWithAddressesResponseDto> {
        return await this.customerService.create(dto)
    }
}
