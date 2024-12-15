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
}

const UserService = new UserServiceClass();

export { UserService };
