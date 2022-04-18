import { User } from '../domain'

type UserDtoType = {
    id: number
    first_name: string
    second_name: string
    display_name?: string
    login: string
    avatar?: string
    email: string
    phone: string
}

export default class UserDto {
    id: number
    first_name: string
    second_name: string
    display_name?: string
    login: string
    avatar?: string
    email: string
    phone: string

    constructor(id: number, firstName: string, secondName: string, login: string, email: string, phone: string, displayName?: string, avatar?: string) {
        this.id = id
        this.first_name = firstName
        this.second_name = secondName
        this.login = login
        this.email = email
        this.phone = phone
        this.display_name = displayName,
            this.avatar = avatar
    }

    static fromJSON(json: UserDtoType): UserDto {
        return new UserDto(json.id, json.first_name, json.second_name, json.login, json.email, json.phone, json.display_name, json.avatar)
    }

    toUser = (): User => new User(
        this.id,
        this.first_name,
        this.second_name,
        this.login,
        this.email,
        this.phone,
        this.display_name,
        this.avatar
    )
}
