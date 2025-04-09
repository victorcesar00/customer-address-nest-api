import { Injectable } from '@nestjs/common'
import { IUser } from '@/user/user.interface'
import { UserAbstractRepository } from '@/user/repository/user.abstract.repository'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class UserRepository implements UserAbstractRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Omit<IUser, 'id'>): Promise<IUser> {
        return await this.prisma.users.create({ data })
    }

    async findByUsername(username: string): Promise<IUser | null> {
        return await this.prisma.users.findUnique({ where: { username } })
    }
}
