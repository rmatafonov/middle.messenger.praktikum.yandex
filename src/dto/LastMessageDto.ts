import { LastMessageDtoJsonFields } from './json/LastMessageDtoJsonFields'
import UserDto from './UserDto'

export default class LastMessageDto {
    user: UserDto
    time: string
    content: string

    constructor(user: UserDto, time: string, content: string) {
        this.user = user
        this.time = time
        this.content = content
    }

    static fromJSON(json: LastMessageDtoJsonFields): LastMessageDto | undefined {
        if (!json) {
            return undefined
        }
        return new LastMessageDto(UserDto.fromJson(json.user), json.time, json.content)
    }
}
