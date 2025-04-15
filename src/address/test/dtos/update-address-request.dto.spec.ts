import 'reflect-metadata'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { UpdateAddressRequestDto } from '@/address/dtos/request/update-address-request.dto'

describe('UpdateAddressRequestDto', () => {
    it('should pass with empty object', async () => {
        const data = {}
        const dto = plainToInstance(UpdateAddressRequestDto, data)
        const errors = await validate(dto)
        expect(errors.length).toBe(0)
    })

    it('should pass with partial valid data', async () => {
        const data = {
            street: 'Rua Atualizada',
            zipCode: '01001000'
        }
        const dto = plainToInstance(UpdateAddressRequestDto, data)
        const errors = await validate(dto)
        expect(errors.length).toBe(0)
    })

    describe('max length validation', () => {
        it('should fail when street exceeds 85 chars', async () => {
            const data = { street: 'a'.repeat(86) }
            const dto = plainToInstance(UpdateAddressRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('street')
            expect(errors[0].constraints).toHaveProperty('maxLength')
        })

        it('should fail when neighborhood exceeds 85 chars', async () => {
            const data = { neighborhood: 'a'.repeat(86) }
            const dto = plainToInstance(UpdateAddressRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('neighborhood')
            expect(errors[0].constraints).toHaveProperty('maxLength')
        })

        it('should fail when city exceeds 85 chars', async () => {
            const data = { city: 'a'.repeat(86) }
            const dto = plainToInstance(UpdateAddressRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('city')
            expect(errors[0].constraints).toHaveProperty('maxLength')
        })

        it('should fail when state exceeds 170 chars', async () => {
            const data = { state: 'a'.repeat(171) }
            const dto = plainToInstance(UpdateAddressRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('state')
            expect(errors[0].constraints).toHaveProperty('maxLength')
        })

        it('should fail when zipCode exceeds 10 chars', async () => {
            const data = { zipCode: 'a'.repeat(11) }
            const dto = plainToInstance(UpdateAddressRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('zipCode')
            expect(errors[0].constraints).toHaveProperty('maxLength')
        })
    })

    describe('invalid data types', () => {
        it('should fail when street is not a string', async () => {
            const data = { street: 123 }
            const dto = plainToInstance(UpdateAddressRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('street')
            expect(errors[0].constraints).toHaveProperty('isString')
        })

        it('should fail when zipCode is not a string', async () => {
            const data = { zipCode: 123456 }
            const dto = plainToInstance(UpdateAddressRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('zipCode')
            expect(errors[0].constraints).toHaveProperty('isString')
        })
    })

    it('should inherit validation from CustomerAddressRequestDto', async () => {
        const data = { neighborhood: 12345 }
        const dto = plainToInstance(UpdateAddressRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(1)
        expect(errors[0].property).toBe('neighborhood')
        expect(errors[0].constraints).toHaveProperty('isString')
    })

    it('should allow partial updates', async () => {
        // eslint-disable-next-line prettier/prettier
        const testCases = [
            { street: 'Nova Rua' },
            { zipCode: '01001000' },
            { city: 'São Paulo', state: 'SP' },
            {}
        ]

        for (const testData of testCases) {
            const dto = plainToInstance(UpdateAddressRequestDto, testData)
            const errors = await validate(dto)
            expect(errors.length).toBe(0)
        }
    })
})
