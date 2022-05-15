import { WSMessageDtoJsonFields } from './json/WSMessageDtoJsonFields'
import WSMessageDto from './WSMessageDto'

export default class WSMessagesListDto {
    messages: Array<WSMessageDto>

    constructor(chats: Array<WSMessageDto>) {
        this.messages = chats
    }

    static fromJson(json: Array<WSMessageDtoJsonFields>): WSMessagesListDto {
        return new WSMessagesListDto(json.map(c => WSMessageDto.fromJson(c)))
    }
}
