import { UserDtoJsonFields } from './json/UserDtoJsonFields'

export default class UserDto {
    id?: number
    firstName: string
    secondName: string
    displayName?: string
    login: string
    password?: string
    avatar?: string
    email: string
    phone: string
    ref?: string

    constructor(
        firstName: string,
        secondName: string,
        login: string,
        email: string,
        phone: string,
        id?: number,
        password?: string,
        displayName?: string,
        avatar?: string
    ) {
        this.id = id
        this.firstName = firstName
        this.secondName = secondName
        this.login = login
        this.password = password
        this.email = email
        this.phone = phone
        if (displayName) {
            this.displayName = displayName
        } else {
            this.displayName = `${firstName} ${secondName}`
        }
        this.avatar = avatar

        if (id) {
            this.ref = `${id}`
        }
    }


    static fromSignUpUserData(user: SignUpUserData) {
        return new UserDto(user.firstName, user.secondName, user.login, user.email, user.phone, undefined, user.password)
    }

    static fromJson(json: UserDtoJsonFields): UserDto {
        return new UserDto(json.first_name, json.second_name, json.login, json.email, json.phone, json.id, json.display_name, json.avatar)
    }

    toJson(): UserDtoJsonFields {
        return {
            first_name: this.firstName,
            second_name: this.secondName,
            login: this.login,
            email: this.email,
            phone: this.phone,
            password: this.password
        }
    }
}
