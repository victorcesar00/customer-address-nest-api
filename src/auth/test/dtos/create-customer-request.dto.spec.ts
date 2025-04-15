import 'reflect-metadata'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'
import { GenderEnum } from '_/prisma/generated/client'

describe('CreateCustomerRequestDto', () => {
    it('should pass with valid data', async () => {
        const data = {
            name: 'Testeson Silva',
            email: 'testeson@example.com',
            phone: '31987654321',
            gender: GenderEnum.MALE,
            taxPayerId: '12345678901',
            addresses: [
                {
                    street: 'Rua A',
                    neighborhood: 'Centro',
                    city: 'São Paulo',
                    state: 'SP',
                    zipCode: '01001000'
                }
            ]
        }

        const dto = plainToInstance(CreateCustomerRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(0)
        expect(dto).toEqual(
            expect.objectContaining({
                name: 'Testeson Silva',
                email: 'testeson@example.com',
                phone: '31987654321',
                gender: GenderEnum.MALE,
                taxPayerId: '12345678901'
            })
        )
    })

    it('should fail when required fields are missing', async () => {
        const data = {}

        const dto = plainToInstance(CreateCustomerRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(5)
        // eslint-disable-next-line prettier/prettier
        expect(errors.map((e) => e.property)).toEqual([
            'name',
            'email',
            'phone',
            'gender',
            'taxPayerId'
        ])
    })

    it('should fail with invalid email format', async () => {
        const data = {
            name: 'Testeson Silva',
            email: 'invalid-email',
            phone: '31987654321',
            gender: GenderEnum.MALE,
            taxPayerId: '12345678901'
        }

        const dto = plainToInstance(CreateCustomerRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(1)
        expect(errors[0].property).toBe('email')
        expect(errors[0].constraints).toHaveProperty('isEmail')
    })

    it('should fail with invalid gender', async () => {
        const data = {
            name: 'Testeson Silva',
            email: 'testeson@example.com',
            phone: '31987654321',
            gender: 'INVALID_GENDER',
            taxPayerId: '12345678901'
        }

        const dto = plainToInstance(CreateCustomerRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(1)
        expect(errors[0].property).toBe('gender')
        expect(errors[0].constraints).toHaveProperty('isEnum')
    })

    it('should fail when name is too short', async () => {
        const data = {
            name: 'Jo',
            email: 'testeson@example.com',
            phone: '31987654321',
            gender: GenderEnum.MALE,
            taxPayerId: '12345678901'
        }

        const dto = plainToInstance(CreateCustomerRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(1)
        expect(errors[0].property).toBe('name')
        expect(errors[0].constraints).toHaveProperty('isLength')
    })

    it('should validate nested addresses', async () => {
        const data = {
            name: 'Testeson Silva',
            email: 'testeson@example.com',
            phone: '31987654321',
            gender: GenderEnum.MALE,
            taxPayerId: '12345678901',
            addresses: [
                {
                    street: '',
                    neighborhood: 'Centro',
                    city: 'São Paulo',
                    state: 'SP',
                    zipCode: '01001000'
                }
            ]
        }

        const dto = plainToInstance(CreateCustomerRequestDto, data)
        const errors = await validate(dto, { whitelist: true })

        expect(errors.length).toBe(1)
        expect(errors[0].property).toBe('addresses')

        const addressErrors = errors[0].children
        expect(addressErrors?.[0]?.children?.[0]?.property).toBe('street')
        expect(addressErrors?.[0]?.children?.[0]?.constraints?.isNotEmpty).toBeDefined()
    })

    it('should not transform string phone number', async () => {
        const data = {
            name: 'Testeson Silva',
            email: 'testeson@example.com',
            phone: '31987654321',
            gender: GenderEnum.MALE,
            taxPayerId: '12345678901'
        }

        const dto = plainToInstance(CreateCustomerRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(0)
        expect(typeof dto.phone).toBe('string')
        expect(dto.phone).toBe(data.phone)
    })
})
