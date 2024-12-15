import { createHttpAuth } from "../configs/http";

class RoleService {
    static async getRoles(userState, updateUserState) {
        const httpAuth = createHttpAuth(userState, updateUserState);
        const res = await httpAuth.get("/role/all");
        return res.data;
    }
}

export { RoleService };
