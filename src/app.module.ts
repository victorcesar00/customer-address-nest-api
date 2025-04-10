import { Module } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { UserModule } from '@/user/user.module'
import { AuthModule } from '@/auth/auth.module'
import { CustomerModule } from '@/customer/customer.module'

@Module({
    imports: [UserModule, AuthModule, CustomerModule],
    providers: [PrismaService]
})
export class AppModule {}
