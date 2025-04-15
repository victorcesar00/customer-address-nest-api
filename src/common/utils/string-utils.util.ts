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

    // Remove tudo após 'ext.' ou 'ramal' (incluindo essas palavras)
    const withoutExtension = trimmed
        .split(/(ext\.|ramal)/i)[0] // Pega a parte antes de "ext." ou "ramal"
        .trim()

    // Remove todos os caracteres que não são dígitos
    const digitsOnly = withoutExtension.replace(/\D/g, '')

    return startsWithPlus ? `+${digitsOnly}` : digitsOnly
}
