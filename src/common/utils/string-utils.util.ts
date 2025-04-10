export function normalizeString(input: string): string {
    if (!input) return ''

    // Remove todos os caracteres que não são dígitos
    return input.replace(/[^0-9a-zA-Z]/g, '')
}

export function normalizePhone(input: string): string {
    if (!input) return ''

    const trimmed = input.trim()

    // Verifica se começa com '+'
    const startsWithPlus = trimmed.startsWith('+')

    // Remove todos os caracteres que não são dígitos
    const digitsOnly = trimmed.replace(/\D/g, '')

    return startsWithPlus ? `+${digitsOnly}` : digitsOnly
}
