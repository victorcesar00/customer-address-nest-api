import { IUser } from '@/user/user.interface'
import { CreateUserRequestDto } from '@/user/dtos/request/create-user-request.dto'

export abstract class UserAbstractService {
    abstract create(createUserDto: CreateUserRequestDto): Promise<IUser>
    abstract findByUsername(username: string): Promise<IUser | null>
    abstract validateUser(username: string, password: string): Promise<IUser | null>
}
