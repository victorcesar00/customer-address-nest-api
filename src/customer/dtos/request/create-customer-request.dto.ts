import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, ValidateNested } from 'class-validator'
import { GenderEnum } from '_/prisma/generated/client'
import { Type } from 'class-transformer'
import { CustomerAddressRequestDto } from '@/address/dtos/request/customer-address-request.dto'

export class CreateCustomerRequestDto {
    @IsString()
    @IsNotEmpty()
    @Length(5, 150)
    name: string

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    @Length(8, 20)
    phone: string

    @IsNotEmpty()
    @IsEnum(GenderEnum)
    gender: GenderEnum

    @IsString()
    @IsNotEmpty()
    @Length(9, 20)
    taxPayerId: string

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CustomerAddressRequestDto)
    addresses?: CustomerAddressRequestDto[]
}
