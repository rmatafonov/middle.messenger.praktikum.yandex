import { UserDtoJsonFields } from './json/UserDtoJsonFields'
import UserDto from './UserDto'

export default class UsersListDto {
    users: Array<UserDto>

    constructor(chats: Array<UserDto>) {
        this.users = chats
    }

    static fromJson(json: Array<UserDtoJsonFields>): UsersListDto {
        return new UsersListDto(json.map(c => UserDto.fromJson(c)))
    }
}
