import { Test, TestingModule } from '@nestjs/testing'
import { CustomerIdExistsPipe } from '@/customer/pipes/customer-id-exists.pipe'
import { CustomerAbstractService } from '@/customer/service/customer.abstract.service'
import { BadRequestException, NotFoundException } from '@nestjs/common'

describe('CustomerIdExistsPipe', () => {
    let pipe: CustomerIdExistsPipe
    let customerServiceMock: {
        findById: jest.Mock
    }

    beforeEach(async () => {
        customerServiceMock = {
            findById: jest.fn()
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CustomerIdExistsPipe,
                {
                    provide: CustomerAbstractService,
                    useValue: customerServiceMock
                }
            ]
        }).compile()

        pipe = module.get<CustomerIdExistsPipe>(CustomerIdExistsPipe)
    })

    it('should pass when customer exists (number input)', async () => {
        const customerId = 1
        customerServiceMock.findById.mockResolvedValue({ id: customerId, name: 'testeson' })

        const result = await pipe.transform(customerId)
        expect(result).toBe(customerId)
        expect(customerServiceMock.findById).toHaveBeenCalledWith(customerId)
    })

    it('should pass when customer exists (object input)', async () => {
        const input = { customerId: '1', otherData: 'test' }
        customerServiceMock.findById.mockResolvedValue({ id: 1, name: 'testeson' })

        const result = await pipe.transform(input)
        expect(result).toEqual({ customerId: 1, otherData: 'test' })
        expect(customerServiceMock.findById).toHaveBeenCalledWith(1)
    })

    it('should throw NotFoundException when customer does not exist', async () => {
        const customerId = 999
        customerServiceMock.findById.mockResolvedValue(null)

        await expect(pipe.transform(customerId)).rejects.toThrow(NotFoundException)

        try {
            await pipe.transform(customerId)
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(NotFoundException)

            if (error instanceof NotFoundException) {
                expect(error.getResponse()).toMatchObject({
                    message: expect.stringMatching(`Customer with ID ${customerId} does not exist`) as string
                })
            }
        }
    })

    it('should throw BadRequestException when customerId is not provided (null)', async () => {
        await expect(pipe.transform(null)).rejects.toThrow(BadRequestException)

        try {
            await pipe.transform(null)
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(BadRequestException)

            if (error instanceof BadRequestException) {
                expect(error.getResponse()).toMatchObject({
                    message: expect.stringMatching('Customer id not provided') as string
                })
            }
        }
    })

    it('should throw BadRequestException when customerId is not provided (empty string)', async () => {
        await expect(pipe.transform('')).rejects.toThrow(BadRequestException)

        try {
            await pipe.transform('')
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(BadRequestException)

            if (error instanceof BadRequestException) {
                expect(error.getResponse()).toMatchObject({
                    message: expect.stringMatching('Customer id not provided') as string
                })
            }
        }
    })

    it('should throw BadRequestException when customerId is not provided in object', async () => {
        const input = { otherData: 'test' }
        await expect(pipe.transform(input)).rejects.toThrow(BadRequestException)

        try {
            await pipe.transform(input)
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(BadRequestException)

            if (error instanceof BadRequestException) {
                expect(error.getResponse()).toMatchObject({
                    message: expect.stringMatching('Customer id not provided') as string
                })
            }
        }
    })

    it('should throw BadRequestException when customerId is null in object', async () => {
        const input = { customerId: null, otherData: 'test' }
        await expect(pipe.transform(input)).rejects.toThrow(BadRequestException)

        try {
            await pipe.transform(input)
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(BadRequestException)

            if (error instanceof BadRequestException) {
                expect(error.getResponse()).toMatchObject({
                    message: expect.stringMatching('Customer id not provided') as string
                })
            }
        }
    })

    it('should parse string customerId to number', async () => {
        const customerId = '1'
        customerServiceMock.findById.mockResolvedValue({ id: 1, name: 'testeson' })

        const result = await pipe.transform(customerId)
        expect(result).toBe(1)
        expect(customerServiceMock.findById).toHaveBeenCalledWith(1)
    })

    it('should parse string customerId in object to number', async () => {
        const input = { customerId: '1', phone: '31987654321' }
        customerServiceMock.findById.mockResolvedValue({ id: 1, name: 'testeson' })

        const result = await pipe.transform(input)
        expect(result).toEqual({ customerId: 1, phone: '31987654321' })
        expect(customerServiceMock.findById).toHaveBeenCalledWith(1)
    })

    it('should handle negative numbers', async () => {
        const customerId = -1
        customerServiceMock.findById.mockResolvedValue(null)

        await expect(pipe.transform(customerId)).rejects.toThrow(BadRequestException)
        await expect(pipe.transform(customerId)).rejects.toThrow('Invalid id provided')
    })

    it('should handle negative numbers on object', async () => {
        const input = { customerId: '-1', phone: '31987654321' }
        customerServiceMock.findById.mockResolvedValue(null)

        await expect(pipe.transform(input)).rejects.toThrow(BadRequestException)
        await expect(pipe.transform(input)).rejects.toThrow('Invalid id provided')
    })

    it('should handle zero as ID', async () => {
        const customerId = 0
        customerServiceMock.findById.mockResolvedValue(null)

        await expect(pipe.transform(customerId)).rejects.toThrow(BadRequestException)
        await expect(pipe.transform(customerId)).rejects.toThrow('Invalid id provided')
    })

    it('should handle zero on object', async () => {
        const input = { customerId: '0', phone: '31987654321' }
        customerServiceMock.findById.mockResolvedValue(null)

        await expect(pipe.transform(input)).rejects.toThrow(BadRequestException)
        await expect(pipe.transform(input)).rejects.toThrow('Invalid id provided')
    })
})
