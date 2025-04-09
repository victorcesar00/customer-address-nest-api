import { Expose, Exclude } from 'class-transformer'

export class UserResponseDto {
    @Expose()
    id: number

    @Expose()
    username: string

    @Exclude()
    password: string

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date
}
