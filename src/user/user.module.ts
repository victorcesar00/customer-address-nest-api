import { Module } from '@nestjs/common'
import { UserController } from '@/user/user.controller'
import { UserAbstractRepository } from '@/user/repository/user.abstract.repository'
import { UserRepository } from '@/user/repository/user.repository'
import { UserAbstractService } from '@/user/service/user.abstract.service'
import { UserService } from '@/user/service/user.service'
import { PrismaService } from '@/prisma/prisma.service'

@Module({
    controllers: [UserController],
    imports: [],
    providers: [
        {
            provide: UserAbstractRepository, //inversao de dependencia
            useClass: UserRepository
        },
        {
            provide: UserAbstractService, //inversao de dependencia
            useClass: UserService
        },
        PrismaService
    ],
    exports: [UserAbstractService]
})
export class UserModule {}
