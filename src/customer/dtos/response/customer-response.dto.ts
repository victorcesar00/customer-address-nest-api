import { Exclude, Expose } from 'class-transformer'
import { GenderEnum } from '_/prisma/generated/client'

export class CustomerResponseDto {
    @Expose()
    id: number

    @Expose()
    name: string

    @Expose()
    email: string

    @Expose()
    phone: string

    @Expose()
    gender: GenderEnum

    @Expose()
    taxPayerId: string

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date

    @Exclude()
    deletedAt?: Date | null
}
