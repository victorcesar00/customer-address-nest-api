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
    UsePipes
} from '@nestjs/common'
import { AddressAbstractService } from '@/address/service/address.abstract.service'
import { AddressResponseDto } from '@/address/dtos/response/address-response.dto'
import { CreateAddressRequestDto } from '@/address/dtos/request/create-address-request.dto'
import { AuthGuard } from '@nestjs/passport'
import { CustomerExistsPipe } from '@/address/pipes/customer-exists.pipe'

@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressAbstractService) {}

    @Post()
    @UsePipes(CustomerExistsPipe)
    @SerializeOptions({ type: AddressResponseDto })
    async create(@Body() dto: CreateAddressRequestDto): Promise<AddressResponseDto> {
        return await this.addressService.create(dto)
    }

    @Get('customer/:customerId')
    @SerializeOptions({ type: AddressResponseDto })
    async findAllByCustomer(@Param('customerId', ParseIntPipe) customerId: number): Promise<AddressResponseDto[]> {
        return await this.addressService.findAllByCustomer(customerId)
    }
}
