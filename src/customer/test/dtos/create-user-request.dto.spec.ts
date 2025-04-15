import 'reflect-metadata'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreateUserRequestDto } from '@/user/dtos/request/create-user-request.dto'

describe('CreateUserRequestDto', () => {
    it('should pass with valid data', async () => {
        const data = {
            username: 'validUser',
            password: 'validPassword123'
        }
        const dto = plainToInstance(CreateUserRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(0)
    })

    it('should fail when username is empty', async () => {
        const data = {
            username: '',
            password: 'validPassword123'
        }
        const dto = plainToInstance(CreateUserRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(1)
        expect(errors[0].constraints).toHaveProperty('isNotEmpty')
    })

    it('should fail when username is too short', async () => {
        const data = {
            username: 'abc',
            password: 'validPassword123'
        }
        const dto = plainToInstance(CreateUserRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(1)
        expect(errors[0].constraints).toHaveProperty('isLength')
    })

    it('should fail when username is too long', async () => {
        const data = {
            username: 'a'.repeat(31),
            password: 'validPassword123'
        }
        const dto = plainToInstance(CreateUserRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(1)
        expect(errors[0].constraints).toHaveProperty('isLength')
    })

    it('should fail when password is empty', async () => {
        const data = {
            username: 'validUser',
            password: ''
        }
        const dto = plainToInstance(CreateUserRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(1)
        expect(errors[0].constraints).toHaveProperty('isNotEmpty')
    })

    it('should fail when password is too short', async () => {
        const data = {
            username: 'validUser',
            password: 'abc12'
        }
        const dto = plainToInstance(CreateUserRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(1)
        expect(errors[0].constraints).toHaveProperty('isLength')
    })

    it('should fail when password is too long', async () => {
        const data = {
            username: 'validUser',
            password: 'a'.repeat(31)
        }
        const dto = plainToInstance(CreateUserRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(1)
        expect(errors[0].constraints).toHaveProperty('isLength')
    })

    it('should fail when both fields are missing', async () => {
        const data = {
            username: '',
            password: ''
        }
        const dto = plainToInstance(CreateUserRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(2)
        expect(errors[0].constraints).toHaveProperty('isNotEmpty')
        expect(errors[1].constraints).toHaveProperty('isNotEmpty')
    })

    it('should fail when username is not a string', async () => {
        const data = {
            username: 123,
            password: 'validPassword123'
        }
        const dto = plainToInstance(CreateUserRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(1)
        expect(errors[0].constraints).toHaveProperty('isString')
    })

    it('should fail when password is not a string', async () => {
        const data = {
            username: 'validUser',
            password: 123456
        }
        const dto = plainToInstance(CreateUserRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(1)
        expect(errors[0].constraints).toHaveProperty('isString')
    })
})
