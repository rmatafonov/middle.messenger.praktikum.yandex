declare global {
    export type Nullable<T> = T | null;

    export type Keys<T extends Record<string, unknown>> = keyof T;
    export type Values<T extends Record<string, unknown>> = T[Keys<T>];

    export type MessageBoxProps = {
        ref?: string
        isMy: boolean
        text: string
        time: string
    }

    export type MessagesList = Array<MessageBoxProps>

    export type ChatsListItemProps = {
        ref?: string
        isSelected: boolean
        lastMessageHeaderPrefix: string
        lastMessageHeader: string
        lastMessageSender: string
        lastMessageText: string
        onClick: (e: Event) => void
    }

    export type ChatsList = Array<ChatsListItemProps>

    export type ChatsListProps = {
        chats: ChatsList
        onChatSelected: () => void
    }

    export type MessengerProps = {
        messages: MessagesList
    }
}

export { }
