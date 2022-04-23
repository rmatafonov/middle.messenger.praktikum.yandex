import { UserDto } from '../../../dto';
import HTTPTransport from '../HTTPTransport';

export const authAPI = {
    signIn: async (user: AuthUserData): Promise<boolean> => {
        const res = await HTTPTransport.getInstance().post(
            '/auth/signin',
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

    signUp: async (user: UserDto): Promise<boolean> => {
        const res = await HTTPTransport.getInstance().post(
            '/auth/signup',
            {
                includeCredentials: true,
                headers: {
                    'content-type': 'application/json',
                },
                data: user.toJson(),
            }
        );
        if (res.status !== 200) {
            throw Error(JSON.parse(res.responseText).reason);
        }
        return true;
    },

    getUser: async () => {
        const res = await HTTPTransport.getInstance().get(
            '/auth/user',
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
        return UserDto.fromJson(JSON.parse(res.responseText))
    },

    logout: async () => {
        const res = await HTTPTransport.getInstance().post(
            '/auth/logout',
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
    },
}
