import { atom } from "recoil";

export const userState = atom({
    key: "userState",
    default: {
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
        isLogged: false || JSON.parse(localStorage.getItem("isLogged")),
    },
});
