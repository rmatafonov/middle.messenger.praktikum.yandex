import ChatsDto from '../../../dto/ChatsListDto';
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
    }
}
