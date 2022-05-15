import { UserDto } from '../../../dto';
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
    },

    update: async (user: UserDto): Promise<boolean> => {
        const res = await HTTPTransport.getInstance().put(
            '/user/profile',
            {
                includeCredentials: true,
                headers: {
                    'content-type': 'application/json',
                },
                data: user.toJsonForProfileUpdate(),
            }
        );
        if (res.status !== 200) {
            throw Error(JSON.parse(res.responseText).reason);
        }
        return true;
    },

    changePassword: async (changePasswordData: { oldPassword: string, newPassword: string }): Promise<boolean> => {
        const res = await HTTPTransport.getInstance().put(
            '/user/password',
            {
                includeCredentials: true,
                headers: {
                    'content-type': 'application/json',
                },
                data: changePasswordData,
            }
        );
        if (res.status !== 200) {
            throw Error(JSON.parse(res.responseText).reason);
        }
        return true;
    },
}
