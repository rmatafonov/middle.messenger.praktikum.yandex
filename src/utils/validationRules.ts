interface ValidationRules {
    [key: string]: (v: string) => string
}

export const validationRules: ValidationRules = {
    login: (login: string) => {
        if (!login) {
            return 'Login is required';
        } else if (login.length < 4) {
            return 'Login should contain more than 3 chars';
        }
        return '';
    },
    password: (password: string) => {
        if (!password) {
            return 'Password is required';
        }
        return '';
    }
}
