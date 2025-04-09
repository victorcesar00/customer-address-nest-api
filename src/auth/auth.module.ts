import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from '@/auth/auth.controller'
import { AuthService } from '@/auth/service/auth.service'
import { AuthAbstractService } from '@/auth/service/auth.abstract.service'
import { UserModule } from '@/user/user.module'
import { JwtStrategy } from '@/auth/jwt.strategy'

@Module({
    controllers: [AuthController],
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' }
        }),
        UserModule
    ],
    providers: [
        {
            provide: AuthAbstractService,
            useClass: AuthService
        },
        JwtStrategy
    ],
    exports: [AuthAbstractService]
})
export class AuthModule {}
