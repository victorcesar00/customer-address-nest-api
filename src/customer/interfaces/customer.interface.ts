import { GenderEnum } from '_/prisma/generated/client'

export interface ICustomer {
    id: number
    name: string
    email: string
    phone: string
    gender: GenderEnum
    taxPayerId: string
    createdAt: Date
    updatedAt: Date
}
