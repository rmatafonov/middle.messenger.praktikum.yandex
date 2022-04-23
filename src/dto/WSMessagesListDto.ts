import WSMessageDto from './WSMessageDto'

export default class WSMessagesListDto {
    messages: Array<WSMessageDto>

    constructor(chats: Array<WSMessageDto>) {
        this.messages = chats
    }

    static fromJson(json: Array<WSMessageDto>): WSMessagesListDto {
        return new WSMessagesListDto(json.map(c => WSMessageDto.fromJson(c)))
    }
}
