import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
    SerializeOptions,
    UsePipes,
    Patch,
    Delete,
    HttpCode
} from '@nestjs/common'
import { AddressAbstractService } from '@/address/service/address.abstract.service'
import { AddressResponseDto } from '@/address/dtos/response/address-response.dto'
import { CreateAddressRequestDto } from '@/address/dtos/request/create-address-request.dto'
import { AuthGuard } from '@nestjs/passport'
import { AddressIdExistsPipe } from '@/address/pipes/address-id-exists.pipe'
import { UpdateAddressRequestDto } from '@/address/dtos/request/update-address-request.dto'
import { CustomerIdExistsPipe } from '@/customer/pipes/customer-id-exists.pipe'

@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressAbstractService) {}

    @Post()
    @UsePipes(CustomerIdExistsPipe) // Valida se o customerId passado existe
    @SerializeOptions({ type: AddressResponseDto })
    async create(@Body() dto: CreateAddressRequestDto): Promise<AddressResponseDto> {
        return await this.addressService.create(dto)
    }

    @Get('customer/:customerId')
    @SerializeOptions({ type: AddressResponseDto })
    async findAllByCustomer(@Param('customerId', ParseIntPipe) customerId: number): Promise<AddressResponseDto[]> {
        return await this.addressService.findAllByCustomer(customerId)
    }

    @Patch(':id')
    @SerializeOptions({ type: AddressResponseDto })
    async update(
        @Param('id', AddressIdExistsPipe) id: number,
        @Body() dto: UpdateAddressRequestDto
    ): Promise<AddressResponseDto> {
        return await this.addressService.update(id, dto)
    }

    @Delete(':id')
    @HttpCode(204)
    @UsePipes(AddressIdExistsPipe)
    async delete(@Param('id') id: number): Promise<void> {
        await this.addressService.delete(id)
    }
}
