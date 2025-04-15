import { normalizeString, normalizePhone } from '@/common/utils/string-utils.util'

describe('String Utils', () => {
    describe('normalizeString', () => {
        it('should return empty string for null/undefined input', () => {
            // @ts-expect-error - Testando tipo inválido
            expect(normalizeString(null)).toBe('')
            // @ts-expect-error - Testando tipo inválido
            expect(normalizeString(undefined)).toBe('')
        })

        it('should return empty string for empty input', () => {
            expect(normalizeString('')).toBe('')
        })

        it('should remove all non-alphanumeric characters', () => {
            expect(normalizeString('A1b2-C3d4!@#')).toBe('A1b2C3d4')
        })

        it('should preserve numbers and letters', () => {
            expect(normalizeString('ABC123xyz456')).toBe('ABC123xyz456')
        })

        it('should handle special characters', () => {
            expect(normalizeString('a!b@c#d$e%f^g&h*i(j)')).toBe('abcdefghij')
        })

        it('should handle whitespace', () => {
            expect(normalizeString('  A B C 1 2 3  ')).toBe('ABC123')
        })
    })

    describe('normalizePhone', () => {
        it('should return empty string for null/undefined input', () => {
            // @ts-expect-error - Testando tipo inválido
            expect(normalizePhone(null)).toBe('')
            // @ts-expect-error - Testando tipo inválido
            expect(normalizePhone(undefined)).toBe('')
        })

        it('should return empty string for empty input', () => {
            expect(normalizePhone('')).toBe('')
        })

        it('should preserve leading + and remove non-digits', () => {
            expect(normalizePhone('+55 (31) 98765-4321')).toBe('+5531987654321')
        })

        it('should remove all non-digit characters for numbers without +', () => {
            expect(normalizePhone('(31) 9876-5432')).toBe('3198765432')
        })

        it('should handle phone with multiple spaces and dashes', () => {
            expect(normalizePhone('1 2-3 4-5 6-7 8')).toBe('12345678')
        })

        it('should preserve + only at start', () => {
            expect(normalizePhone('++55 31 9999 8888')).toBe('+553199998888')
        })

        it('should trim whitespace', () => {
            expect(normalizePhone('  31987654321  ')).toBe('31987654321')
        })

        it('should handle international format', () => {
            expect(normalizePhone('+1 (555) 123-4567')).toBe('+15551234567')
        })

        it('should handle phone with extension', () => {
            expect(normalizePhone('+55 (31) 1234-5678 ext. 123')).toBe('+553112345678')
            expect(normalizePhone('+55 (31) 1234-5678 ramal 123')).toBe('+553112345678')
        })
    })
})
