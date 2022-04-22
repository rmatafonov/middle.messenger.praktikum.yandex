import ChatsDto from '../../../dto/ChatsListDto';
import UsersListDto from '../../../dto/UsersListDto';
import HTTPTransport from '../HTTPTransport';

export const chatsAPI = {
    getChats: async () => {
        const res = await HTTPTransport.getInstance().get(
            '/chats',
            {
                includeCredentials: true,
                headers: {
                    'accept': 'application/json',
                }
            }
        );
        if (res.status !== 200) {
            throw Error(JSON.parse(res.responseText).reason);
        }
        return ChatsDto.fromJSON(JSON.parse(res.responseText))
    },
    
    getChatUsers: async (chatId: number) => {
        const res = await HTTPTransport.getInstance().get(
            `/chats/${chatId}/users`,
            {
                includeCredentials: true,
                headers: {
                    'accept': 'application/json',
                }
            }
        );
        if (res.status !== 200) {
            throw Error(JSON.parse(res.responseText).reason);
        }
        return UsersListDto.fromJson(JSON.parse(res.responseText))
    },

    createChat: async (title: string): Promise<number> => {
        const res = await HTTPTransport.getInstance().post(
            '/chats',
            {
                includeCredentials: true,
                headers: {
                    'accept': 'application/json',
                },
                data: {
                    title: title
                }
            }
        );
        if (res.status !== 200) {
            throw Error(JSON.parse(res.responseText).reason);
        }
        return JSON.parse(res.responseText).id
    },

    addUserToChat: async (userId: number, chatId: number) => {
        const res = await HTTPTransport.getInstance().put(
            '/chats/users',
            {
                includeCredentials: true,
                headers: {
                    'accept': 'application/json',
                },
                data: {
                    users: [userId],
                    chatId: chatId
                }
            }
        );
        if (res.status !== 200) {
            throw Error(JSON.parse(res.responseText).reason);
        }
    },

    getToken: async (chatId: number): Promise<string> => {
        const res = await HTTPTransport.getInstance().post(
            `/chats/token/${chatId}`,
            {
                includeCredentials: true,
                headers: {
                    'accept': 'application/json',
                }
            }
        );
        if (res.status !== 200) {
            throw Error(JSON.parse(res.responseText).reason);
        }
        return JSON.parse(res.responseText).token
    }
}
