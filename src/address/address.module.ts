import { Module } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { AddressController } from '@/address/address.controller'
import { AddressService } from '@/address/service/address.service'
import { AddressAbstractService } from '@/address/service/address.abstract.service'
import { AddressRepository } from '@/address/repository/address.repository'
import { AddressAbstractRepository } from '@/address/repository/address.abstract.repository'
import { CustomerModule } from '@/customer/customer.module'

@Module({
    controllers: [AddressController],
    imports: [CustomerModule],
    providers: [
        PrismaService,
        {
            provide: AddressAbstractService,
            useClass: AddressService
        },
        {
            provide: AddressAbstractRepository,
            useClass: AddressRepository
        }
    ],
    exports: [AddressAbstractService]
})
export class AddressModule {}
