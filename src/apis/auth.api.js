import { createHttpAuth, http } from "../configs/http";

class AuthServiceClass {
    async loginUserAccount({ usernameOrEmail, password }) {
        const res = await http.post("/auth/login", { usernameOrEmail, password }, { withCredentials: true });
        return res;
    }

    async refreshToken() {
        const res = await http.get("/auth/refresh-token", {
            withCredentials: true,
        });
        return res.data;
    }

    async forgotPassword(email) {
        const res = await http.post("/auth/forgot-password", { email: email });
        return res.data;
    }

    async logout(userState, updateUserState) {
        const httpAuth = createHttpAuth(userState, updateUserState);
        const res = await httpAuth.post("/auth/logout", {}, { withCredentials: true });
        return res.data;
    }

    async changePassword({ currentPassword, newPassword }, userState, updateUserState) {
        const httpAuth = createHttpAuth(userState, updateUserState);
        const res = await httpAuth.post(
            "/auth/change-password",
            {
                currentPassword,
                newPassword,
            },
            { withCredentials: true }
        );
        return res.data;
    }
}

const AuthService = new AuthServiceClass();

export { AuthService };
