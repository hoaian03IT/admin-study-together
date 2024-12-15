import { BiSolidDashboard, BiUser } from "react-icons/bi";
import { RiPassPendingFill } from "react-icons/ri";
import { IoIosCard } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { pathname } from "../routes";
import clsx from "clsx";

const items = [
    { path: pathname.dashboard, icon: BiSolidDashboard },
    { path: pathname.users, icon: BiUser },
    { path: pathname.courses, icon: RiPassPendingFill },
    { path: pathname.revenues, icon: IoIosCard },
];

export const Sidebar = () => {
    return (
        <div className="flex flex-col items-center shadow-md h-screen">
            {items.map((item) => {
                const Icon = item.icon;
                return (
                    <NavLink
                        to={item.path}
                        key={item.path}
                        className={({ isActive }) =>
                            clsx(
                                "block text-black p-6 border-l-4 hover:bg-blue-50 transition-all",
                                isActive ? "border-blue-400 text-blue-500" : "border-transparent"
                            )
                        }>
                        <Icon className="size-8" />
                    </NavLink>
                );
            })}
        </div>
    );
};
