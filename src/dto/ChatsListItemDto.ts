import { ChatsListItemDtoJsonFields } from './json/ChatsListItemDtoJsonFields'
import LastMessageDto from './LastMessageDto'

export default class ChatsListItemDto {
    id: number
    title: string
    avatar: string
    unreadCount: number
    lastMessage?: LastMessageDto
    ref?: string
    isSelected?: boolean

    constructor(id: number, title: string, avatar: string, unreadCount: number, lastMessage?: LastMessageDto) {
        this.id = id
        this.title = title
        this.avatar = avatar
        this.unreadCount = unreadCount
        this.lastMessage = lastMessage
    }

    static fromJSON(json: ChatsListItemDtoJsonFields): ChatsListItemDto {
        return new ChatsListItemDto(json.id, json.title, json.avatar, json.unread_count, LastMessageDto.fromJSON(json.last_message))
    }
}
