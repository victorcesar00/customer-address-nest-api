import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { IUser } from '@/user/user.interface'
import { UserAbstractRepository } from '@/user/repository/user.abstract.repository'
import { UserAbstractService } from '@/user/service/user.abstract.service'
import { CreateUserRequestDto } from '@/user/dtos/request/create-user-request.dto'

@Injectable()
export class UserService implements UserAbstractService {
    constructor(private readonly userRepository: UserAbstractRepository) {}

    async create(createUserDto: CreateUserRequestDto): Promise<IUser> {
        const passwordHash = await bcrypt.hash(createUserDto.password, 10)
        return await this.userRepository.create({ ...createUserDto, password: passwordHash } as IUser)
    }

    async findByUsername(username: string): Promise<IUser | null> {
        const user = await this.userRepository.findByUsername(username)

        if (!user) {
            return null
        }

        return user
    }

    async validateUser(username: string, password: string): Promise<IUser | null> {
        const user = await this.userRepository.findByUsername(username)

        if (!user) {
            return null
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return null
        }

        return user
    }
}
