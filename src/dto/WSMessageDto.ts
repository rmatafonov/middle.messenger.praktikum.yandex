import { WSMessageDtoJsonFields } from './json/WSMessageDtoJsonFields'

export default class WSMessageDto {
    id: number
    userId: number
    chatId: number
    type: string
    time: string
    content: string
    isRead: boolean
    file: string

    constructor(id: number, userId: number, chatId: number, type: string, time: string, content: string, isRead: boolean, file: string) {
        this.id = id
        this.userId = userId
        this.chatId = chatId
        this.type = type
        this.time = time
        this.content = content
        this.isRead = isRead
        this.file = file
    }

    static fromJson(json: WSMessageDtoJsonFields): WSMessageDto {
        return new WSMessageDto(json.id, json.user_id, json.chat_id, json.type, json.time, json.content, json.is_read, json.file)
    }
}
