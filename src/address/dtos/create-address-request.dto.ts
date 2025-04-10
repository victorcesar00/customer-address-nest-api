import { IsString, IsNotEmpty, MaxLength, IsInt } from 'class-validator'

export class CreateAddressRequestDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(85)
    street: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(85)
    neighborhood: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(85)
    city: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(170)
    state: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    zipCode: string

    @IsInt()
    @IsNotEmpty()
    customerId: number
}
