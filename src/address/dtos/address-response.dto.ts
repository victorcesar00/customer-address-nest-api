import { Expose } from 'class-transformer'

export class AddressResponseDto {
    @Expose()
    id: number

    @Expose()
    street: string

    @Expose()
    neighborhood: string

    @Expose()
    city: string

    @Expose()
    state: string

    @Expose()
    zipCode: string

    @Expose()
    customerId: number

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date
}
