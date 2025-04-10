import { Module } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { CustomerController } from '@/customer/customer.controller'
import { CustomerAbstractRepository } from '@/customer/repository/customer.abstract.repository'
import { CustomerRepository } from '@/customer/repository/customer.repository'
import { CustomerAbstractService } from '@/customer/service/customer.abstract.service'
import { CustomerService } from '@/customer/service/customer.service'

@Module({
    controllers: [CustomerController],
    providers: [
        PrismaService,
        {
            provide: CustomerAbstractRepository, // Inversao de dependencia
            useClass: CustomerRepository
        },
        {
            provide: CustomerAbstractService, // Inversao de dependencia
            useClass: CustomerService
        }
    ],
    exports: [CustomerAbstractService]
})
export class CustomerModule {}
