import { UserDto } from '../../../dto';
import HTTPTransport from '../HTTPTransport';

export const authAPI = {
    singIn: async (user: AuthUserData): Promise<boolean> => {
        const res = await HTTPTransport.getInstance().post(
            'auth/signin',
            {
                includeCredentials: true,
                headers: {
                    'content-type': 'application/json',
                },
                data: user,
            }
        );
        if (res.status !== 200) {
            throw Error(JSON.parse(res.responseText).reason);
        }
        return true;
    },

    getUser: async () => {
        const res = await HTTPTransport.getInstance().get(
            'auth/user',
            {
                includeCredentials: true,
                headers: {
                    'accept': 'application/json',
                }
            }
        );
        return UserDto.fromJSON(JSON.parse(res.responseText)).toUser()
    }
}
