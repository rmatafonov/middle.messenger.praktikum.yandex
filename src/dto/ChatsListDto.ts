import ChatsListItemDto from './ChatsListItemDto'
import { ChatsListItemDtoJsonFields } from './json/ChatsListItemDtoJsonFields'

export default class ChatsDto {
    chats: Array<ChatsListItemDto>

    constructor(chats: Array<ChatsListItemDto>) {
        this.chats = chats
    }

    static fromJSON(json: Array<ChatsListItemDtoJsonFields>): ChatsDto {
        return new ChatsDto(json.map(c => ChatsListItemDto.fromJSON(c)))
    }
}
