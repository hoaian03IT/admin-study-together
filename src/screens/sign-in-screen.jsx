import { useState } from "react";
import { useMutation } from "react-query";
import { AuthService } from "../apis/auth.api";
import { Button, Form, Input } from "@nextui-org/react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { validationForm } from "../utils/validateForm";
import appLogo from "../assets/logo-no-background.png";
import { userState } from "../recoil/atoms/user.atom";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { pathname } from "../routes";
import { useRecoilState } from "recoil";

export default function SignIn() {
    const [user, setUser] = useRecoilState(userState);

    const [formValue, setFormValue] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [validForm, setValidForm] = useState({
        username: { error: null },
        password: { error: null },
    });

    const navigate = useNavigate();

    const mutationNormalSubmit = useMutation({
        mutationFn: AuthService.loginUserAccount,
        onSuccess: (res) => {
            handleUpdateUserState({ status: res.status, data: res.data });
            navigate(pathname.dashboard);
        },
        onError: async (error) => {
            toast.warn(error.response.data?.errorCode);
        },
    });

    const handleUpdateUserState = ({ status, data }) => {
        if (status === 200) {
            setUser({
                info: {
                    username: data.username,
                    phone: data.phone,
                    firstName: data?.["first name"],
                    lastName: data?.["last name"],
                    avatar: data?.["avatar image"],
                    email: data?.email,
                    role: data?.role,
                },
                token: data.token,
                isLogged: true,
            });

            localStorage.setItem("isLogged", JSON.stringify(true));
        }
    };

    const handleChange = (e) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let submittable = true;
        console.log("Submit");

        if (!validationForm.username(formValue.username)) {
            setValidForm((prev) => ({ ...prev, username: { error: "Username is invalid" } }));
            submittable = false;
        } else {
            setValidForm((prev) => ({ ...prev, username: { error: null } }));
        }

        if (!validationForm.password(formValue.password)) {
            setValidForm((prev) => ({ ...prev, password: { error: "Password is invalid" } }));
            submittable = false;
        } else {
            setValidForm((prev) => ({ ...prev, password: { error: null } }));
        }

        if (submittable) {
            mutationNormalSubmit.mutate({ usernameOrEmail: formValue.username, password: formValue.password });
        }
    };
    return user.isLogged ? (
        <Navigate to={pathname.dashboard} />
    ) : (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Form className="w-96 bg-[#f8f6f6] p-4 rounded-small shadow-md" onSubmit={handleSubmit}>
                <div className="w-full my-8 flex justify-center">
                    <img src={appLogo} alt="" />
                </div>
                <Input
                    variant="bordered"
                    isRequired
                    label="Username"
                    labelPlacement="outside"
                    name="username"
                    placeholder="Enter username"
                    value={formValue.username}
                    onChange={handleChange}
                    isInvalid={!!validForm.username.error}
                    errorMessage={validForm.username.error}
                    type="text"
                    radius="sm"
                    required
                />
                <Input
                    variant="bordered"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="*************"
                    value={formValue.password}
                    onChange={handleChange}
                    className="w-full"
                    radius="sm"
                    labelPlacement="outside"
                    label="Password"
                    isInvalid={!!validForm.password.error}
                    errorMessage={validForm.password.error}
                    required
                    isRequired
                    endContent={
                        <span
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                            {showPassword ? <BsEyeFill className="size-5" /> : <BsEyeSlashFill className="size-5" />}
                        </span>
                    }
                />
                <div className="w-full flex justify-end">
                    <Button type="submit" variant="solid" color="primary" radius="sm">
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    );
}
