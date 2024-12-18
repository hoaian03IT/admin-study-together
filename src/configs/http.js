import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "../apis/auth.api";

class Http {
    constructor() {
        this.instance = axios.create({
            baseURL: import.meta.env.VITE_SERVER_URL,
            timeout: 10000,
            headers: { "Content-Type": "application/json; charset=utf-8" },
        });
    }

    createHttpAuth(userState, updateUserState) {
        let axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_SERVER_URL,
            timeout: 10000,
            headers: { "Content-Type": "application/json; charset=utf-8" },
        });
        axiosInstance.interceptors.request.use(
            async function (req) {
                let currentToken = userState?.token;
                let isTokenExpired = true;

                if (currentToken) {
                    const decodedToken = jwtDecode(currentToken);
                    isTokenExpired = decodedToken.exp < new Date().getTime() / 1000; // kiem tra token het han
                }

                if (isTokenExpired && userState?.isLogged) {
                    try {
                        const data = await AuthService.refreshToken();
                        currentToken = data.token;
                        updateUserState({ ...userState, token: currentToken, isLogged: true });
                    } catch (error) {
                        updateUserState({
                            info: {
                                phone: null,
                                firstName: null,
                                lastName: null,
                                role: null,
                                avatar: null,
                                username: null,
                                email: null,
                            },
                            token: null,
                            isLogged: false,
                        });
                        // localStorage.setItem("isLogged", JSON.stringify(false));
                        console.warn("Token refresh failed:", error);
                        return Promise.reject(error);
                    }
                }
                req.headers.Authorization = `Bearer ${currentToken}`;
                return req;
            },
            function (error) {
                console.warn("Interceptor error:", error);
                return Promise.reject(error);
            }
        );

        return axiosInstance;
    }
}

const HttpObject = new Http();

const http = HttpObject.instance;
const createHttpAuth = HttpObject.createHttpAuth.bind(HttpObject);

export { http, createHttpAuth };
