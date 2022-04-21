import { UserDto } from './src/dto';

declare global {
    export type Nullable<T> = T | null

    export type Keys<T extends Record<string, unknown>> = keyof T
    export type Values<T extends Record<string, unknown>> = T[Keys<T>]

    export interface ComponentConstructable<Props extends {} = {}> {
        new(props: Props): Component;
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

    export type ChatsListProps = {
        scrollTop: number,
        chats: [],
        foundChats: [],
        foundUsers: [],
        onChatSelected: () => void
    }

    export type MessengerProps = {
        messages: MessagesList
    }

    export type AuthUserData = {
        login: string,
        password: string
    }

    export type SignUpUserData = {
        login: string,
        password: string,
        firstName: string,
        secondName: string,
        email: string,
        phone: string,
    };

    export type GlobalStorageData = {
        user?: UserDto
    }
}

export { }
