import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator'
import { GenderEnum } from '_/prisma/generated/client'

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
    @Length(8, 15)
    phone: string

    @IsNotEmpty()
    @IsEnum(GenderEnum)
    gender: GenderEnum

    @IsString()
    @IsNotEmpty()
    @Length(9, 18)
    taxPayerId: string
}
