/* eslint-disable react/prop-types */
import { Card, CardBody, Image, Tooltip } from "@nextui-org/react";
import { CiMail, CiPhone, CiClock2, CiUser, CiCalendarDate } from "react-icons/ci";
import {
    PiStudentLight,
    PiShieldCheckeredLight,
    PiChalkboardTeacherLight,
    PiCheckCircleLight,
    PiProhibitLight,
} from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { convertUTCToLocal } from "../utils/convert-UTC-to-local";

export const UserBasicInformation = ({ userInfo }) => {
    return (
        <Card radius="sm">
            <CardBody>
                <div className="space-y-8 p-4">
                    <label className="font-semibold text-lg pb-4">Basic information</label>
                    <div className="flex items-start gap-20">
                        <Tooltip content="Avatar" placement="bottom-start" radius="sm">
                            <Image
                                draggable={false}
                                src={userInfo?.["avatar image"]}
                                className="size-48"
                                radius="full"
                            />
                        </Tooltip>
                        <div className="space-y-4">
                            <Tooltip content="Username" placement="bottom-start" radius="sm">
                                <div className="flex items-center gap-4">
                                    <CiUser className="size-8" />
                                    <p>{userInfo?.["username"]}</p>
                                </div>
                            </Tooltip>
                            <Tooltip content="Email" placement="bottom-start" radius="sm">
                                <div className="flex items-center gap-4">
                                    <CiMail className="size-8" />
                                    <p>{userInfo?.["email"] ? userInfo?.["email"] : "------"}</p>
                                </div>
                            </Tooltip>
                            <Tooltip content="Phone number" placement="bottom-start" radius="sm">
                                <div className="flex items-center gap-4">
                                    <CiPhone className="size-8" />
                                    <p>{userInfo?.["phone"] ? userInfo?.["phone"] : "------"}</p>
                                </div>
                            </Tooltip>
                            <Tooltip content="Created time" placement="bottom-start" radius="sm">
                                <div className="flex items-center gap-4">
                                    <CiClock2 className="size-8" />
                                    <p>{convertUTCToLocal(userInfo?.["created at"]).toDateString()}</p>
                                </div>
                            </Tooltip>
                        </div>
                        <div className="space-y-4">
                            <Tooltip content="Google id" placement="bottom-start" radius="sm">
                                <div className="flex items-center gap-4">
                                    <FcGoogle className="size-8" />
                                    <p>{userInfo?.["google id"] ? userInfo?.["google id"] : "------"}</p>
                                </div>
                            </Tooltip>
                            <Tooltip content="Facebook id" placement="bottom-start" radius="sm">
                                <div className="flex items-center gap-4">
                                    <FaFacebook className="size-8 text-blue-500" />
                                    <p>{userInfo?.["facebook id"] ? userInfo?.["facebook id"] : "------"}</p>
                                </div>
                            </Tooltip>
                            <Tooltip content="Role name" placement="bottom-start" radius="sm">
                                <div className="flex items-center gap-4">
                                    {userInfo?.["role name"]?.toLowerCase() === "teacher" ? (
                                        <PiChalkboardTeacherLight className="size-8" />
                                    ) : userInfo?.["role name"]?.toLowerCase() === "admin" ? (
                                        <PiShieldCheckeredLight className="size-8" />
                                    ) : (
                                        <PiStudentLight className="size-8" />
                                    )}
                                    <p>{userInfo?.["role name"]}</p>
                                </div>
                            </Tooltip>
                            <Tooltip content="User status" placement="bottom-start" radius="sm">
                                <div className="flex items-center gap-4">
                                    {userInfo?.["disabled"] ? (
                                        <PiProhibitLight className="size-8 text-red-500" />
                                    ) : (
                                        <PiCheckCircleLight className="size-8 text-green-500" />
                                    )}
                                    <p className={userInfo?.["disabled"] ? "text-red-500" : "text-green-500"}>
                                        {userInfo?.["disabled"] ? "Disabled" : "Enabled"}
                                    </p>
                                </div>
                            </Tooltip>
                        </div>
                        <div className="space-y-4">
                            <Tooltip content="Current streak" placement="bottom-start" radius="sm">
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">🔥</span>
                                    <p>{userInfo?.["current streak"]}</p>
                                </div>
                            </Tooltip>
                            <Tooltip content="Max streak" placement="bottom-start" radius="sm">
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">❤️‍🔥</span>
                                    <p>{userInfo?.["max streak"]}</p>
                                </div>
                            </Tooltip>
                            <Tooltip content="Last completed date" placement="bottom-start" radius="sm">
                                <div className="flex items-center gap-4">
                                    <CiCalendarDate className="size-8" />
                                    <p>{new Date(userInfo?.["last completed date"]).toDateString()}</p>
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
