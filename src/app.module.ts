import { Module } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { UserModule } from '@/user/user.module'
import { AuthModule } from '@/auth/auth.module'
import { CustomerModule } from '@/customer/customer.module'
import { AddressModule } from '@/address/address.module'

@Module({
    imports: [UserModule, AuthModule, CustomerModule, AddressModule],
    providers: [PrismaService]
})
export class AppModule {}
