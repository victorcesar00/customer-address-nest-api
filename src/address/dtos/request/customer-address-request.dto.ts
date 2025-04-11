import { IsString, IsNotEmpty, MaxLength } from 'class-validator'

export class CustomerAddressRequestDto {
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
}
