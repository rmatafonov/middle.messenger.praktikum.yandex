interface ValidationRules {
    [key: string]: (v: string) => string
}

type ValidationChain = Array < { check: (v: string) => boolean, message: string } >

const checks: { [key: string]: (v: string) => boolean } = {
    isNull: (v) => !v,
    isLessThan4Chars: (v) => v.length < 4,
    isLessThan8Chars: (v) => v.length < 8,
    isMoreThan20Chars: (v) => v.length > 20,
    isMoreThan40Chars: (v) => v.length > 40,
    isDigitsOnly: (v) => v.search(/^\d+$/) !== -1,
    isAllowedSymbolsOnly: (v) => v.search(/^[a-zA-Z0-9\-\_]*$/) !== 0,
    isAtLeastOneCapitalLetter: (v) => v.search(/[A-Z]/) === -1,
    isAtLeastOneDigit: (v) => v.search(/\d/) === -1,
}

const validationRules: ValidationRules = {
    login: (login: string) => {
        const validationChain: ValidationChain = [
            { check: checks.isNull, message: 'Login is required' },
            { check: checks.isLessThan4Chars, message: 'Login length should be between 3 and 20 chars' },
            { check: checks.isMoreThan20Chars, message: 'Login length should be between 3 and 20 chars' },
            { check: checks.isDigitsOnly, message: 'Login should not consist of digits only' },
            { check: checks.isAllowedSymbolsOnly, message: 'Allowed Login symbols: Latin letters, dash (-) or underline (_)' },
        ]

        return validationChain.find(link => link.check(login))?.message || ''
    },
    password: (password: string) => {
        const validationChain: ValidationChain = [
            { check: checks.isNull, message: 'Password is required' },
            { check: checks.isLessThan8Chars, message: 'Password length should be between 8 and 40 chars' },
            { check: checks.isMoreThan40Chars, message: 'Password length should be between 8 and 40 chars' },
            { check: checks.isAtLeastOneCapitalLetter, message: 'Password should contain at least one capital letter' },
            { check: checks.isAtLeastOneDigit, message: 'Password should contain at least one digit' },
        ]

        return validationChain.find(link => link.check(password))?.message || ''
    }
}

export function validate(key: string, value: string) {
    return validationRules[key](value)
}
