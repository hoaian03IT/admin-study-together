import { BiSolidDashboard, BiUser } from "react-icons/bi";
import { RiPassPendingFill } from "react-icons/ri";
import { IoIosCard } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { pathname } from "../routes";
import clsx from "clsx";
import { Tooltip } from "@nextui-org/react";

const items = [
    { path: pathname.dashboard, icon: BiSolidDashboard, title: "Dashboard" },
    { path: pathname.users, icon: BiUser, title: "User management" },
    { path: pathname.courses, icon: RiPassPendingFill, title: "Courses management" },
    { path: pathname.courseApproval, icon: RiPassPendingFill, title: "Courses approval" },
    { path: pathname.revenues, icon: IoIosCard, title: "Revenues" },
];

export const Sidebar = () => {
    return (
        <div className="flex flex-col items-center shadow-md h-full">
            {items.map((item) => {
                const Icon = item.icon;
                return (
                    <Tooltip key={item.path} className="capitalize" content={item.title} radius="sm" placement="right">
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                clsx(
                                    "block p-6 border-l-4 hover:bg-blue-50 hover:text-blue-400 transition-all",
                                    isActive ? "border-blue-400 text-blue-500" : "text-gray-600 border-transparent"
                                )
                            }>
                            <Icon className="size-8" />
                        </NavLink>
                    </Tooltip>
                );
            })}
        </div>
    );
};
