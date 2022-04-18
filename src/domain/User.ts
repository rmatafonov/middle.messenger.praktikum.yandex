import UserDto from '../dto/UserDto'

export default class User {
    id: number
    firstName: string
    secondName: string
    displayName?: string
    login: string
    avatar?: string
    email: string
    phone: string

    constructor(id: number, firstName: string, secondName: string, login: string, email: string, phone: string, displayName?: string, avatar?: string) {
        this.id = id
        this.firstName = firstName
        this.secondName = secondName
        this.login = login
        this.email = email
        this.phone = phone
        this.displayName = displayName,
        this.avatar = avatar
    }

    toDto = (): UserDto => new UserDto(
        this.id,
        this.firstName,
        this.secondName,
        this.login,
        this.email,
        this.phone,
        this.displayName,
        this.avatar,
    )
}
