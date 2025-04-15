import 'reflect-metadata'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { UpdateCustomerRequestDto } from '@/customer/dtos/request/update-customer-request.dto'
import { GenderEnum } from '_/prisma/generated/client'

describe('UpdateCustomerRequestDto', () => {
    it('should pass with empty object', async () => {
        const data = {}
        const dto = plainToInstance(UpdateCustomerRequestDto, data)
        const errors = await validate(dto)
        expect(errors.length).toBe(0)
    })

    describe('field validation', () => {
        it('should accept valid name', async () => {
            const data = { name: 'Testeson Silva Atualizado' }
            const dto = plainToInstance(UpdateCustomerRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(0)
        })

        it('should fail when name is too short', async () => {
            const data = { name: 'Jo' }
            const dto = plainToInstance(UpdateCustomerRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('name')
            expect(errors[0].constraints).toHaveProperty('isLength')
        })

        it('should accept valid email', async () => {
            const data = { email: 'novo.email@example.com' }
            const dto = plainToInstance(UpdateCustomerRequestDto, data)
            const errors = await validate(dto)
            expect(errors.length).toBe(0)
        })

        it('should fail with invalid email format', async () => {
            const data = { email: 'email-invalido' }
            const dto = plainToInstance(UpdateCustomerRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('email')
            expect(errors[0].constraints).toHaveProperty('isEmail')
        })

        it('should accept valid phone number', async () => {
            const data = { phone: '31987654321' }
            const dto = plainToInstance(UpdateCustomerRequestDto, data)
            const errors = await validate(dto)
            expect(errors.length).toBe(0)
        })

        it('should fail when phone is too short', async () => {
            const data = { phone: '12345' }
            const dto = plainToInstance(UpdateCustomerRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('phone')
            expect(errors[0].constraints).toHaveProperty('isLength')
        })

        it('should accept valid gender', async () => {
            const data = { gender: GenderEnum.FEMALE }
            const dto = plainToInstance(UpdateCustomerRequestDto, data)
            const errors = await validate(dto)
            expect(errors.length).toBe(0)
        })

        it('should fail with invalid gender', async () => {
            const data = { gender: 'INVALID_GENDER' }
            const dto = plainToInstance(UpdateCustomerRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('gender')
            expect(errors[0].constraints).toHaveProperty('isEnum')
        })
    })

    it('should allow updating single fields', async () => {
        const testCases = [
            { name: 'Novo Nome' },
            { email: 'novo@email.com' },
            { phone: '31999999999' },
            { gender: GenderEnum.FEMALE },
            {} // Objeto vazio também deve ser válido
        ]

        for (const data of testCases) {
            const dto = plainToInstance(UpdateCustomerRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(0)
        }
    })

    it('should reject taxPayerId updates', async () => {
        const data = { taxPayerId: '98765432100' }
        const dto = plainToInstance(UpdateCustomerRequestDto, data)
        const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true }) // reflete o ValidationPipe no main.ts, removendo e proibindo campos nao listados no DTO

        expect(errors.length).toBe(1)
        expect(errors[0].property).toBe('taxPayerId')
        expect(errors[0].constraints).toHaveProperty('whitelistValidation')
    })

    describe('invalid data types', () => {
        it('should reject non-string name', async () => {
            const data = { name: 12345 }
            const dto = plainToInstance(UpdateCustomerRequestDto, data)
            const errors = await validate(dto)

            expect(dto.taxPayerId).toBeUndefined()
            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('name')
            expect(errors[0].constraints).toHaveProperty('isString')
        })

        it('should reject non-string phone', async () => {
            const data = { phone: 31987654321 }
            const dto = plainToInstance(UpdateCustomerRequestDto, data)
            const errors = await validate(dto)

            expect(errors.length).toBe(1)
            expect(errors[0].property).toBe('phone')
            expect(errors[0].constraints).toHaveProperty('isString')
        })
    })

    it('should inherit validation from base DTO', async () => {
        const data = { name: 'Jo' }
        const dto = plainToInstance(UpdateCustomerRequestDto, data)
        const errors = await validate(dto)

        expect(errors.length).toBe(1)
        expect(errors[0].property).toBe('name')
        expect(errors[0].constraints).toHaveProperty('isLength')
    })
})
