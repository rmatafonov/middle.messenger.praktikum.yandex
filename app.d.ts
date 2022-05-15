import { ChatsListItemDto, LastMessageDto, UserDto, WSMessageDto } from './src/dto';

declare global {
    export type Nullable<T> = T | null

    export type Keys<T extends Record<string, unknown>> = keyof T
    export type Values<T extends Record<string, unknown>> = T[Keys<T>]
    export type Indexed<T = unknown> = { [key in any]: T }

    export interface ComponentConstructable<Props extends {} = {}> {
        new(props: Props): Component;
        componentName: string
    }

    export type ButtonProps = {
        text?: string
        image?: string
        className?: string
        onClick?: () => void
    }

    export type LinkProps = {
        text?: string
        href?: string
        onClick?: () => void
    }

    export type MessageBoxProps = {
        ref?: string
        isMy?: boolean
        text?: string
        time?: string
    }

    export type MessagesList = Array<MessageBoxProps>

    export type ChatsListItemProps = {
        ref?: string
        id?: number
        chat?: ChatsListItemDto
        user?: UserDto
        onClick?: (e: Event) => void
    }

    export type ChatsListProps = {
        scrollTop?: number
        search?: string
        chats?: []
        foundChats?: []
        foundUsers?: []
        onFoundUserSelected?: (chatRefName: string) => void
        onChatSelected?: (chat?: ChatsListItemDto) => void
    }

    export type ChatProps = {
        chatId?: number
        token?: string
        onFirstMessageSent?: () => void
    }

    export type MessagesContainerProps = {
        messages?: Array<WSMessageDto>
    }

    export type MessengerHeaderProps = {
        userName?: string
        onClick?: () => void
    }

    export type AuthUserData = {
        login: string
        password: string
    }

    export type SignUpUserData = {
        login: string,
        password: string,
        firstName: string,
        secondName: string,
        email: string,
        phone: string,
    }

    export type ProfileUserData = {
        login: string,
        firstName: string,
        secondName: string,
        email: string,
        phone: string,
    }

    export type GlobalStorageData = {
        user?: UserDto
    }
}

export { }
