import { IUser } from '@/user/user.interface'

export abstract class UserAbstractRepository {
    abstract create(user: Omit<IUser, 'id'>): Promise<IUser>
    abstract findByUsername(username: string): Promise<IUser | null>
}
