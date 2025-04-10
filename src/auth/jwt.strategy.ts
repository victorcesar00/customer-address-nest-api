import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

interface IPayloadFormat {
    sub: number
    username: string
    iat: number
    exp: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined on environment')
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        })
    }

    validate(payload: IPayloadFormat) {
        return { userId: payload.sub, username: payload.username }
    }
}
