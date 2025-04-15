import { Test, TestingModule } from '@nestjs/testing'
import { UpdateCustomerPipe } from '@/customer/pipes/update-customer.pipe'
import { CustomerAbstractService } from '@/customer/service/customer.abstract.service'
import { UpdateCustomerRequestDto } from '@/customer/dtos/request/update-customer-request.dto'
import { BadRequestException, ConflictException } from '@nestjs/common'

describe('UpdateCustomerPipe', () => {
    let pipe: UpdateCustomerPipe
    let customerServiceMock: {
        findByEmail: jest.Mock
        findByPhone: jest.Mock
    }

    beforeEach(async () => {
        customerServiceMock = {
            findByEmail: jest.fn(),
            findByPhone: jest.fn()
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UpdateCustomerPipe,
                {
                    provide: CustomerAbstractService,
                    useValue: customerServiceMock
                }
            ]
        }).compile()

        pipe = module.get<UpdateCustomerPipe>(UpdateCustomerPipe)
    })

    it('should pass if update data is valid and fields are unique', async () => {
        const dto: UpdateCustomerRequestDto = {
            name: 'testeson',
            phone: '31987654321'
        }

        customerServiceMock.findByPhone.mockResolvedValue(null)

        const result = await pipe.transform(dto)

        expect(result).toEqual({
            name: 'testeson',
            phone: '31987654321'
        })
        expect(customerServiceMock.findByPhone).toHaveBeenCalledWith('31987654321')
    })

    it('should normalize phone number', async () => {
        const dto: UpdateCustomerRequestDto = {
            phone: '+55 (31) 98765-4321'
        }

        customerServiceMock.findByPhone.mockResolvedValue(null)

        const result = await pipe.transform(dto)

        expect(result.phone).toBe('+5531987654321')
    })

    it('should not check email if not provided', async () => {
        const dto: UpdateCustomerRequestDto = {
            name: 'testeson'
        }

        const result = await pipe.transform(dto)

        expect(result).toEqual(dto)
        expect(customerServiceMock.findByEmail).not.toHaveBeenCalled()
        expect(customerServiceMock.findByPhone).not.toHaveBeenCalled()
    })

    it('should throw ConflictException if email already exists', async () => {
        const dto: UpdateCustomerRequestDto = {
            email: 'existente@example.com'
        }

        customerServiceMock.findByEmail.mockResolvedValue({ id: 1, email: dto.email })

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
        const dto: UpdateCustomerRequestDto = {
            phone: '31987654321'
        }

        customerServiceMock.findByPhone.mockResolvedValue({ id: 1, phone: dto.phone })

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

    it('should throw ConflictException with multiple errors if multiple fields exist', async () => {
        const dto: UpdateCustomerRequestDto = {
            email: 'existente@example.com',
            phone: '31987654321'
        }

        customerServiceMock.findByEmail.mockResolvedValue({ id: 1, email: dto.email })
        customerServiceMock.findByPhone.mockResolvedValue({ id: 1, phone: dto.phone })

        await expect(pipe.transform(dto)).rejects.toThrow(ConflictException)

        try {
            await pipe.transform(dto)
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(ConflictException)

            if (error instanceof ConflictException) {
                expect(error.getResponse()).toMatchObject({
                    message: expect.arrayContaining([
                        'Email already registered',
                        'Phone already registered'
                    ]) as string[]
                })
            }
        }
    })

    it('should throw BadRequestException if customer data is not provided', async () => {
        // @ts-expect-error - Testando tipo inválido
        await expect(pipe.transform(null)).rejects.toThrow(BadRequestException)
        // @ts-expect-error - Testando tipo inválido
        await expect(pipe.transform(null)).rejects.toThrow('Customer data not provided')
    })

    it('should throw BadRequestException if customer data is not an object', async () => {
        // @ts-expect-error - Testando tipo inválido
        await expect(pipe.transform('invalid')).rejects.toThrow(BadRequestException)
        // @ts-expect-error - Testando tipo inválido
        await expect(pipe.transform('invalid')).rejects.toThrow('Customer data not provided')
    })

    it('should pass if only name is being updated', async () => {
        const dto: UpdateCustomerRequestDto = {
            name: 'testeson atualizado'
        }

        const result = await pipe.transform(dto)

        expect(result).toEqual(dto)
        expect(customerServiceMock.findByEmail).not.toHaveBeenCalled()
        expect(customerServiceMock.findByPhone).not.toHaveBeenCalled()
    })
})
