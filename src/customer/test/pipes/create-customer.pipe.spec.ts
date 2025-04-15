import { Test, TestingModule } from '@nestjs/testing'
import { CreateCustomerPipe } from '@/customer/pipes/create-customer.pipe'
import { CustomerAbstractService } from '@/customer/service/customer.abstract.service'
import { CreateCustomerRequestDto } from '@/customer/dtos/request/create-customer-request.dto'
import { BadRequestException, ConflictException } from '@nestjs/common'
import { GenderEnum } from '_/prisma/generated/client'

describe('CreateCustomerPipe', () => {
    let pipe: CreateCustomerPipe
    let customerServiceMock: {
        findByEmail: jest.Mock
        findByPhone: jest.Mock
        findByTaxPayerId: jest.Mock
    }

    beforeEach(async () => {
        customerServiceMock = {
            findByEmail: jest.fn(),
            findByPhone: jest.fn(),
            findByTaxPayerId: jest.fn()
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateCustomerPipe,
                {
                    provide: CustomerAbstractService,
                    useValue: customerServiceMock
                }
            ]
        }).compile()

        pipe = module.get<CreateCustomerPipe>(CreateCustomerPipe)
    })

    it('should pass if customer data is valid and unique', async () => {
        const dto: CreateCustomerRequestDto = {
            name: 'testeson',
            email: 'testeson@example.com',
            phone: '31987654321',
            gender: GenderEnum.MALE,
            taxPayerId: '12345678901'
        }

        customerServiceMock.findByEmail.mockResolvedValue(null)
        customerServiceMock.findByPhone.mockResolvedValue(null)
        customerServiceMock.findByTaxPayerId.mockResolvedValue(null)

        const result = await pipe.transform(dto)

        expect(result).toEqual({
            ...dto,
            phone: '31987654321',
            taxPayerId: '12345678901'
        })
        expect(customerServiceMock.findByEmail).toHaveBeenCalledWith('testeson@example.com')
        expect(customerServiceMock.findByPhone).toHaveBeenCalledWith('31987654321')
        expect(customerServiceMock.findByTaxPayerId).toHaveBeenCalledWith('12345678901')
    })

    it('should normalize phone and taxPayerId', async () => {
        const dto: CreateCustomerRequestDto = {
            name: 'testeson',
            email: 'testeson@example.com',
            phone: '+31 (987) 654-321',
            gender: GenderEnum.MALE,
            taxPayerId: '12.345.678/901'
        }

        customerServiceMock.findByEmail.mockResolvedValue(null)
        customerServiceMock.findByPhone.mockResolvedValue(null)
        customerServiceMock.findByTaxPayerId.mockResolvedValue(null)

        const result = await pipe.transform(dto)

        expect(result.phone).toBe('+31987654321')
        expect(result.taxPayerId).toBe('12345678901')
    })

    it('should throw ConflictException if email already exists', async () => {
        const dto: CreateCustomerRequestDto = {
            name: 'testeson',
            email: 'existente@example.com',
            phone: '31987654321',
            gender: GenderEnum.MALE,
            taxPayerId: '12345678901'
        }

        customerServiceMock.findByEmail.mockResolvedValue({ id: 1, email: dto.email })
        customerServiceMock.findByPhone.mockResolvedValue(null)
        customerServiceMock.findByTaxPayerId.mockResolvedValue(null)

        await expect(pipe.transform(dto)).rejects.toThrow(ConflictException)

        try {
            await pipe.transform(dto)
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(ConflictException)

            if (error instanceof ConflictException) {
                expect(error.getResponse()).toMatchObject({
                    message: expect.arrayContaining(['Email already registered']) as string[]
                })
            }
        }
    })

    it('should throw ConflictException if phone already exists', async () => {
        const dto: CreateCustomerRequestDto = {
            name: 'testeson',
            email: 'testeson@example.com',
            phone: '31987654321',
            gender: GenderEnum.MALE,
            taxPayerId: '12345678901'
        }

        customerServiceMock.findByEmail.mockResolvedValue(null)
        customerServiceMock.findByPhone.mockResolvedValue({ id: 1, phone: dto.phone })
        customerServiceMock.findByTaxPayerId.mockResolvedValue(null)

        await expect(pipe.transform(dto)).rejects.toThrow(ConflictException)

        try {
            await pipe.transform(dto)
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(ConflictException)

            if (error instanceof ConflictException) {
                expect(error.getResponse()).toMatchObject({
                    message: expect.arrayContaining(['Phone already registered']) as string[]
                })
            }
        }
    })

    it('should throw ConflictException if taxPayerId already exists', async () => {
        const dto: CreateCustomerRequestDto = {
            name: 'testeson',
            email: 'testeson@example.com',
            phone: '31987654321',
            gender: GenderEnum.MALE,
            taxPayerId: '12345678901'
        }

        customerServiceMock.findByEmail.mockResolvedValue(null)
        customerServiceMock.findByPhone.mockResolvedValue(null)
        customerServiceMock.findByTaxPayerId.mockResolvedValue({ id: 1, taxPayerId: dto.taxPayerId })

        await expect(pipe.transform(dto)).rejects.toThrow(ConflictException)

        try {
            await pipe.transform(dto)
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(ConflictException)

            if (error instanceof ConflictException) {
                expect(error.getResponse()).toMatchObject({
                    message: expect.arrayContaining(['Tax Payer ID already registered']) as string[]
                })
            }
        }
    })

    it('should throw ConflictException with multiple errors if multiple fields exist', async () => {
        const dto: CreateCustomerRequestDto = {
            name: 'testeson',
            email: 'existente@example.com',
            phone: '31987654321',
            gender: GenderEnum.MALE,
            taxPayerId: 'existente123'
        }

        customerServiceMock.findByEmail.mockResolvedValue({ id: 1, email: dto.email })
        customerServiceMock.findByPhone.mockResolvedValue({ id: 1, phone: dto.phone })
        customerServiceMock.findByTaxPayerId.mockResolvedValue({ id: 1, taxPayerId: dto.taxPayerId })

        await expect(pipe.transform(dto)).rejects.toThrow(ConflictException)

        try {
            await pipe.transform(dto)
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(ConflictException)

            if (error instanceof ConflictException) {
                expect(error.getResponse()).toMatchObject({
                    message: expect.arrayContaining([
                        'Email already registered',
                        'Phone already registered',
                        'Tax Payer ID already registered'
                    ]) as string[]
                })
            }
        }
    })

    it('should throw BadRequestException if customer data is not provided', async () => {
        // @ts-expect-error - Testando tipo inválido
        await expect(pipe.transform(undefined)).rejects.toThrow(BadRequestException)
        // @ts-expect-error - Testando tipo inválido
        await expect(pipe.transform(null)).rejects.toThrow('Customer data not provided')
    })

    it('should throw BadRequestException if customer data is not an object', async () => {
        // @ts-expect-error - Testando tipo inválido
        await expect(pipe.transform('invalid')).rejects.toThrow(BadRequestException)
        // @ts-expect-error - Testando tipo inválido
        await expect(pipe.transform('invalid')).rejects.toThrow('Customer data not provided')
    })
})
