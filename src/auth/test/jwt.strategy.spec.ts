import { JwtStrategy } from '@/auth/jwt.strategy'

describe('JwtStrategy', () => {
    const OLD_ENV = process.env

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...OLD_ENV, JWT_SECRET: 'test-secret' }
    })

    afterAll(() => {
        process.env = OLD_ENV
    })

    describe('constructor', () => {
        it('should initialize with valid config', () => {
            const strategy = new JwtStrategy()
            expect(strategy).toBeDefined()
        })

        it('should throw error when JWT_SECRET is missing', () => {
            delete process.env.JWT_SECRET
            expect(() => new JwtStrategy()).toThrow('JWT_SECRET is not defined on environment')
        })
    })

    describe('validate', () => {
        it('should return user payload', () => {
            const strategy = new JwtStrategy()
            const payload = {
                sub: 1,
                username: 'testeson',
                iat: 123456,
                exp: 654321
            }

            const result = strategy.validate(payload)
            expect(result).toEqual({
                userId: payload.sub,
                username: payload.username
            })
        })
    })
})
