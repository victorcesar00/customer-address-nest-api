import { Test, TestingModule } from '@nestjs/testing'
import { AddressIdExistsPipe } from '@/address/pipes/address-id-exists.pipe'
import { AddressAbstractService } from '@/address/service/address.abstract.service'
import { BadRequestException, NotFoundException } from '@nestjs/common'

describe('AddressIdExistsPipe', () => {
    let pipe: AddressIdExistsPipe
    let addressServiceMock: {
        findById: jest.Mock
    }

    beforeEach(async () => {
        addressServiceMock = {
            findById: jest.fn()
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AddressIdExistsPipe,
                {
                    provide: AddressAbstractService,
                    useValue: addressServiceMock
                }
            ]
        }).compile()

        pipe = module.get<AddressIdExistsPipe>(AddressIdExistsPipe)
    })

    it('should pass when address exists (number input)', async () => {
        const addressId = 1
        addressServiceMock.findById.mockResolvedValue({
            id: addressId,
            street: 'Rua Teste',
            customerId: 1
        })

        const result = await pipe.transform(addressId)
        expect(result).toBe(addressId)
        expect(addressServiceMock.findById).toHaveBeenCalledWith(addressId)
    })

    it('should pass when address exists (string input)', async () => {
        const addressId = '123'
        addressServiceMock.findById.mockResolvedValue({
            id: 123,
            street: 'Rua Teste',
            customerId: 1
        })

        const result = await pipe.transform(addressId)
        expect(result).toBe(123)
        expect(addressServiceMock.findById).toHaveBeenCalledWith(123)
    })

    it('should throw NotFoundException when address does not exist', async () => {
        const addressId = 999
        addressServiceMock.findById.mockResolvedValue(null)

        await expect(pipe.transform(addressId)).rejects.toThrow(NotFoundException)
        await expect(pipe.transform(addressId)).rejects.toThrow(`Address with ID ${addressId} does not exist.`)
    })

    it('should throw BadRequestException when addressId is not provided (null)', async () => {
        // @ts-expect-error - Testando tipo inválido
        await expect(pipe.transform(null)).rejects.toThrow(BadRequestException)
        // @ts-expect-error - Testando tipo inválido
        await expect(pipe.transform(null)).rejects.toThrow('Address id not provided')
    })

    it('should throw BadRequestException when addressId is not provided (empty string)', async () => {
        await expect(pipe.transform('')).rejects.toThrow(BadRequestException)
        await expect(pipe.transform('')).rejects.toThrow('Address id not provided')
    })

    it('should parse string addressId to number', async () => {
        const addressId = '456'
        addressServiceMock.findById.mockResolvedValue({
            id: 456,
            street: 'Rua Teste',
            customerId: 1
        })

        const result = await pipe.transform(addressId)
        expect(result).toBe(456)
        expect(addressServiceMock.findById).toHaveBeenCalledWith(456)
    })

    it('should handle invalid number string', async () => {
        const addressId = 'abc'
        await expect(pipe.transform(addressId)).rejects.toThrow(BadRequestException)
        await expect(pipe.transform(addressId)).rejects.toThrow('Validation failed (numeric string is expected)')
    })

    it('should handle negative numbers', async () => {
        const addressId = -1
        addressServiceMock.findById.mockResolvedValue(null)

        await expect(pipe.transform(addressId)).rejects.toThrow(BadRequestException)
        await expect(pipe.transform(addressId)).rejects.toThrow('Invalid id provided')
    })

    it('should handle zero as ID', async () => {
        const addressId = 0
        addressServiceMock.findById.mockResolvedValue(null)

        await expect(pipe.transform(addressId)).rejects.toThrow(BadRequestException)
        await expect(pipe.transform(addressId)).rejects.toThrow('Invalid id provided')
    })
})
