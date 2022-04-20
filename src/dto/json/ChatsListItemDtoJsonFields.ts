import { LastMessageDtoJsonFields } from './LastMessageDtoJsonFields'

export type ChatsListItemDtoJsonFields = {
    id: number
    title: string,
    avatar: string,
    unread_count: number,
    last_message: LastMessageDtoJsonFields
}
