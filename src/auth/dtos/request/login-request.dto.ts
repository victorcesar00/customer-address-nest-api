import { IsString, Length, IsNotEmpty } from 'class-validator'

export class LoginRequestDto {
    @IsString()
    @IsNotEmpty()
    @Length(4, 30)
    username: string

    @IsString()
    @IsNotEmpty()
    @Length(6, 30)
    password: string
}
