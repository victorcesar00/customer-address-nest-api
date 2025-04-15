import 'reflect-metadata'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CustomerAddressRequestDto } from '@/address/dtos/request/customer-address-request.dto'

describe('CustomerAddressRequestDto', () => {
    it('should pass with valid data', async () => {
        const data = {
            street: 'Rua Principal',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01001000'
        }
        const dto = plainToInstance(CustomerAddressRequestDto, data)
        const errors = await validate(dto)
        expect(errors.length).toBe(0)
    })

    describe('required fields', () => {
        it('should fail when street is empty', async () => {
            const data = {
                street: '',
                neighborhood: 'Centro',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01001000'
            }
            const dto = plainToInstance(CustomerAddressRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('street')
            expect(errors[0].constraints).toHaveProperty('isNotEmpty')
        })

        it('should fail when city is empty', async () => {
            const data = {
                street: 'Rua Principal',
                neighborhood: 'Centro',
                city: '',
                state: 'SP',
                zipCode: '01001000'
            }
            const dto = plainToInstance(CustomerAddressRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('city')
            expect(errors[0].constraints).toHaveProperty('isNotEmpty')
        })
    })

    describe('max length validation', () => {
        it('should fail when street exceeds 85 chars', async () => {
            const data = {
                street: 'a'.repeat(86),
                neighborhood: 'Centro',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01001000'
            }
            const dto = plainToInstance(CustomerAddressRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('street')
            expect(errors[0].constraints).toHaveProperty('maxLength')
        })

        it('should fail when state exceeds 170 chars', async () => {
            const data = {
                street: 'Rua Principal',
                neighborhood: 'Centro',
                city: 'São Paulo',
                state: 'a'.repeat(171),
                zipCode: '01001000'
            }
            const dto = plainToInstance(CustomerAddressRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('state')
            expect(errors[0].constraints).toHaveProperty('maxLength')
        })
    })

    describe('invalid data types', () => {
        it('should fail when street is not a string', async () => {
            const data = {
                street: 123,
                neighborhood: 'Centro',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01001000'
            }
            const dto = plainToInstance(CustomerAddressRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('street')
            expect(errors[0].constraints).toHaveProperty('isString')
        })

        it('should fail when zipCode is not a string', async () => {
            const data = {
                street: 'Rua Principal',
                neighborhood: 'Centro',
                city: 'São Paulo',
                state: 'SP',
                zipCode: 123456
            }
            const dto = plainToInstance(CustomerAddressRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('zipCode')
            expect(errors[0].constraints).toHaveProperty('isString')
        })
    })

    it('should return multiple errors for invalid data', async () => {
        const data = {
            street: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: ''
        }
        const dto = plainToInstance(CustomerAddressRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(5)
        // eslint-disable-next-line prettier/prettier
        expect(errors.map((e) => e.property)).toEqual([
            'street',
            'neighborhood',
            'city',
            'state',
            'zipCode'
        ])
    })
})
