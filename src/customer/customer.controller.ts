import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    UseInterceptors,
    ClassSerializerInterceptor,
    SerializeOptions,
    UseGuards,
    UsePipes,
    ParseIntPipe,
    HttpCode,
    NotFoundException
} from '@nestjs/common'
import { CustomerAbstractService } from '@/customer/service/customer.abstract.service'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'
import { AuthGuard } from '@nestjs/passport'
import { CreateCustomerPipe } from '@/customer/pipes/create-customer.pipe'
import { CustomerWithAddressesResponseDto } from '@/customer/dtos/response/customer-with-adddresses-response.dto'
import { UpdateCustomerRequestDto } from '@/customer/dtos/request/update-customer-request.dto'
import { CustomerResponseDto } from '@/customer/dtos/response/customer-response.dto'
import { CustomerIdExistsPipe } from '@/customer/pipes/customer-id-exists.pipe'
import { UpdateCustomerPipe } from '@/customer/pipes/update-customer.pipe'

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

    @Get(':id')
    @SerializeOptions({ type: CustomerResponseDto })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<CustomerResponseDto | null> {
        const customer = await this.customerService.findById(id)

        if (!customer) {
            throw new NotFoundException(`Customer with id ${id} doesn't exist`)
        }

        return customer
    }

    @Get('with-addresses/:id')
    @SerializeOptions({ type: CustomerWithAddressesResponseDto })
    async findOneWithAddresses(
        @Param('id', ParseIntPipe) id: number
    ): Promise<CustomerWithAddressesResponseDto | null> {
        const customer = await this.customerService.findByIdWithAddresses(id)

        if (!customer) {
            throw new NotFoundException(`Customer with id ${id} doesn't exist`)
        }

        return customer
    }

    @Patch(':id')
    @SerializeOptions({ type: CustomerResponseDto })
    async update(
        @Param('id', CustomerIdExistsPipe) id: number,
        @Body(UpdateCustomerPipe) dto: UpdateCustomerRequestDto // Como ha mais de um parametro eh necessario passar o pipe especificamente para o body, ou sera executado para id tambem
    ): Promise<CustomerResponseDto> {
        return await this.customerService.update(id, dto)
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id', CustomerIdExistsPipe) id: number): Promise<void> {
        await this.customerService.delete(id)
    }
}
