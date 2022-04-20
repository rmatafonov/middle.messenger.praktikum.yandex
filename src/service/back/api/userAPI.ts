import UsersListDto from '../../../dto/UsersListDto';
import HTTPTransport from '../HTTPTransport';

export const userAPI = {
    userSearch: async (login: string) => {
        const res = await HTTPTransport.getInstance().post(
            '/user/search',
            {
                includeCredentials: true,
                headers: {
                    'accept': 'application/json',
                },
                data: {
                    login: login
                }
            }
        );
        if (res.status !== 200) {
            throw Error(JSON.parse(res.responseText).reason);
        }
        return UsersListDto.fromJson(JSON.parse(res.responseText))
    }
}
