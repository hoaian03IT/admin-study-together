import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoIosArrowDropdown } from "react-icons/io";
import { Avatar, Badge, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { Fragment, useContext } from "react";
import { GlobalStateContext } from "../providers/GlobalStateProvider";
import { IoMdLogOut } from "react-icons/io";
import { pathname } from "../routes";

export const Header = () => {
    const user = useRecoilValue(userState);
    const { handleShowLogoutModal } = useContext(GlobalStateContext);
    return (
        <nav className="py-2 h-full">
            <div className="flex items-center justify-end gap-8 ml-auto">
                {user.isLogged ? (
                    <Fragment>
                        <div>
                            <Link to="/notification">
                                <Badge content={5} color="danger">
                                    <FaBell className="size-8 text-blue-500" />
                                </Badge>
                            </Link>
                        </div>
                        <Dropdown radius="sm">
                            <DropdownTrigger>
                                <div className="flex items-center gap-4 justify-end cursor-pointer">
                                    <Avatar size="md" src={user.info.avatar} />
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {user?.info?.firstName} {user?.info?.lastName}
                                        </p>
                                        <span className="text-[12px] font-semibold text-gray-500">
                                            {user?.info?.role}
                                        </span>
                                    </div>
                                    <div>
                                        <IoIosArrowDropdown className="size-6" />
                                    </div>
                                </div>
                            </DropdownTrigger>
                            <DropdownMenu radius="sm">
                                <DropdownItem
                                    key="sign-out"
                                    radius="sm"
                                    onPress={handleShowLogoutModal}
                                    startContent={<IoMdLogOut className="size-5" />}>
                                    Sign out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Fragment>
                ) : (
                    <Link
                        to={pathname.signin}
                        radius="sm"
                        className="bg-primary py-2 px-4 rounded-small text-white text-small">
                        Sign in
                    </Link>
                )}
            </div>
        </nav>
    );
};
