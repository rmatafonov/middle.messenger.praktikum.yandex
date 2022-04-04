interface ValidationRules {
    [key: string]: (v: string) => string
}

type ValidationChain = Array<{ check: (v: string) => boolean, message: string }>

const CHECKS: { [key: string]: (v: string) => boolean } = {
    isNull: (v) => !v,
    isLessThan4Chars: (v) => v.length < 4,
    isLessThan8Chars: (v) => v.length < 8,
    isMoreThan20Chars: (v) => v.length > 20,
    isMoreThan40Chars: (v) => v.length > 40,
    isDigitsOnly: (v) => v.search(/^\d+$/) !== -1,
    isProhibitedLoginSymbols: (v) => v.search(/^[a-z0-9\-\_]+$/ig) !== 0,
    isProhibitedNameSymbols: (v) => v.search(/^[A-Z\u0410-\u042f][\u0430-\u044fa-z0-9\-]+$/ig) !== 0,
    isInvalidEmail: (v) => v.search(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) !== 0,
    isInvalidPhone: (v) => v.search(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g) !== 0,
    isFirstCapital: (v) => v.search(/^[A-Z\u0410-\u042f]/) !== 0,
    isAtLeastOneCapitalLetter: (v) => v.search(/[A-Z]/) === -1,
    isAtLeastOneDigit: (v) => v.search(/\d/) === -1,
}

function nameValidationChain(whichName: string): ValidationChain {
    return [
        { check: CHECKS.isNull, message: `${whichName} is required` },
        { check: CHECKS.isProhibitedNameSymbols, message: `Allowed ${whichName} symbols: Latin/Cyrillic letters and dash (-)` },
        { check: CHECKS.isFirstCapital, message: `First letter should be Capital` },
    ]
}

const validationRules: ValidationRules = {
    login: (login: string) => {
        const validationChain: ValidationChain = [
            { check: CHECKS.isNull, message: 'Login is required' },
            { check: CHECKS.isLessThan4Chars, message: 'Login length should be between 3 and 20 chars' },
            { check: CHECKS.isMoreThan20Chars, message: 'Login length should be between 3 and 20 chars' },
            { check: CHECKS.isDigitsOnly, message: 'Login should not consist of digits only' },
            { check: CHECKS.isProhibitedLoginSymbols, message: 'Allowed Login symbols: Latin letters, dash (-) and underline (_)' },
        ]

        return validationChain.find(link => link.check(login))?.message || ''
    },
    password: (password: string) => {
        const validationChain: ValidationChain = [
            { check: CHECKS.isNull, message: 'Password is required' },
            { check: CHECKS.isLessThan8Chars, message: 'Password length should be between 8 and 40 chars' },
            { check: CHECKS.isMoreThan40Chars, message: 'Password length should be between 8 and 40 chars' },
            { check: CHECKS.isAtLeastOneCapitalLetter, message: 'Password should contain at least one capital letter' },
            { check: CHECKS.isAtLeastOneDigit, message: 'Password should contain at least one digit' },
        ]

        return validationChain.find(link => link.check(password))?.message || ''
    },
    first_name: (firstName: string) => {
        return nameValidationChain("First Name").find(link => link.check(firstName))?.message || ''
    },
    second_name: (secondName: string) => {
        return nameValidationChain("Second Name").find(link => link.check(secondName))?.message || ''
    },
    email: (email: string) => {
        const validationChain: ValidationChain = [
            { check: CHECKS.isNull, message: 'Email is required' },
            { check: CHECKS.isInvalidEmail, message: 'Invalid Email' },
        ]

        return validationChain.find(link => link.check(email))?.message || ''
    },
    phone: (email: string) => {
        const validationChain: ValidationChain = [
            { check: CHECKS.isNull, message: 'Phone is required' },
            { check: CHECKS.isInvalidPhone, message: 'Invalid Phone' },
        ]

        return validationChain.find(link => link.check(email))?.message || ''
    },
}

export function validate(key: string, value: string) {
    return validationRules[key](value)
}
