import { createContext, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { UserService } from "../apis/user.api.js";
import { AuthService } from "../apis/auth.api.js";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { pathname } from "../routes/index.js";
import { queryKeys } from "../react-query/queryKeys.js";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

const GlobalStateContext = createContext({
    updateUserState: () => {},
});

function GlobalStateProvider({ children }) {
    const [user, setUser] = useRecoilState(userState);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const navigate = useNavigate();

    const updateUserState = (userState) => {
        if (userState === null) {
            localStorage.setItem("isLogged", JSON.stringify(false));

            setUser({
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
                // isLogged: false,
            });
        } else {
            setUser({ ...userState });
        }
    };

    const logoutMutation = useMutation({
        mutationFn: async () => {
            // logout & reset user state
            updateUserState(null);
            await AuthService.logout(user, updateUserState);
        },
        onSuccess: () => {
            setShowLogoutModal(false);
            navigate(pathname.signin); // redirect to home page after logout
        },
        onError: (error) => {
            console.error(error);
            toast.error("Oops! Something went wrong!");
        },
    });

    const handleShowLogoutModal = () => {
        setShowLogoutModal(true);
    };

    const handleLogout = () => {
        if (user?.isLogged) {
            logoutMutation.mutate();
        } else {
            toast.warn("Bạn chưa đăng nhập trước đó");
        }
    };

    useQuery({
        queryKey: [queryKeys.userState],
        queryFn: async () => {
            try {
                if (user?.isLogged) {
                    const data = await UserService.fetchUserInfo(user, updateUserState);
                    if (data) {
                        setUser((prev) => ({
                            ...prev,
                            info: {
                                username: data?.username,
                                phone: data?.phone,
                                firstName: data?.["first name"],
                                lastName: data?.["last name"],
                                avatar: data?.["avatar image"],
                                email: data?.email,
                                role: data?.["role name"],
                            },
                        }));
                        return data;
                    }
                }
                return {};
            } catch (error) {
                return Promise.reject(error);
            }
        },
    });

    return (
        <GlobalStateContext.Provider value={{ updateUserState, handleShowLogoutModal }}>
            {children}
            <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Logout</ModalHeader>
                            <ModalBody>Are you sure you want to logout?</ModalBody>
                            <ModalFooter>
                                <Button color="default" onClick={onClose} radius="sm">
                                    Cancel
                                </Button>
                                <Button color="primary" radius="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </GlobalStateContext.Provider>
    );
}

export { GlobalStateContext, GlobalStateProvider };
