import { createHttpAuth, http } from "../configs/http";

class UserServiceClass {
    async fetchUserInfo(userState, updateUserState) {
        const httpAuth = createHttpAuth(userState, updateUserState);
        const res = await httpAuth.get("/user/me");
        return res.data;
    }

    async checkUsernameExists(username) {
        const res = await http.get(`/user/exists-username?username=${username}`);
        return res;
    }

    async fetchListUser(
        { li, np, sortBy = "", sortDirection = "", roleIdFilter = "", usernameFilter },
        userState,
        updateUserState
    ) {
        const httpAuth = createHttpAuth(userState, updateUserState);
        const res = await httpAuth.get(
            `/user/admin/list-users?li=${li}&np=${np}&sort-by=${sortBy}&sort-direction=${sortDirection}&role-id=${roleIdFilter}&username=${usernameFilter}`
        );
        return res.data;
    }

    async enableUser(userId, userState, updateUserState) {
        const httpAuth = createHttpAuth(userState, updateUserState);
        const res = await httpAuth.post(`/user/admin/enable-user`, { userId });
        return res.data;
    }

    async disableUser(userId, userState, updateUserState) {
        const httpAuth = createHttpAuth(userState, updateUserState);
        const res = await httpAuth.post(`/user/admin/disable-user`, { userId });
        return res.data;
    }

    async fetchUserInfoDetails(userId, userState, updateUserState) {
        const httpAuth = createHttpAuth(userState, updateUserState);
        const res = await httpAuth.get(`/user/admin/user-details/${userId}`);
        return res.data;
    }
}

const UserService = new UserServiceClass();

export { UserService };
