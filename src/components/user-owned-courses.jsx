/* eslint-disable react/prop-types */
import { Image, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import clsx from "clsx";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { useContext } from "react";
import { GlobalStateContext } from "../providers/GlobalStateProvider";
import { CourseService } from "../apis/course.api";
import { toast } from "react-toastify";
import { queryKeys } from "../react-query/queryKeys";
import { convertUTCToLocal } from "../utils/convert-UTC-to-local";

export const UserOwnedCourse = ({ userId }) => {
    const user = useRecoilValue(userState);
    const { updateUserState } = useContext(GlobalStateContext);

    const ownedCourseQuery = useQuery({
        queryKey: [queryKeys.ownedCourse, userId],
        queryFn: async ({ queryKey }) => {
            try {
                const data = await CourseService.fetchUserOwnedCourse(queryKey[1], user, updateUserState);
                return data?.["courses"];
            } catch (error) {
                toast.error(error.response?.data?.errorCode);
            }
        },
        enabled: !!userId && user.isLogged,
        staleTime: 60 * 1000,
    });

    return (
        <div className="space-y-2">
            <label className="font-semibold">Owned courses</label>
            <Table radius="sm">
                <TableHeader>
                    <TableColumn>Course id</TableColumn>
                    <TableColumn>Course Name</TableColumn>
                    <TableColumn>Tag</TableColumn>
                    <TableColumn>Image</TableColumn>
                    <TableColumn>Source language</TableColumn>
                    <TableColumn>Target language</TableColumn>
                    <TableColumn>Price($)</TableColumn>
                    <TableColumn>Discount</TableColumn>
                    <TableColumn>Created at</TableColumn>
                    <TableColumn>Updated at</TableColumn>
                    <TableColumn>Status</TableColumn>
                </TableHeader>
                <TableBody className="h-96 overflow-y-auto">
                    {ownedCourseQuery.data?.map((item) => {
                        const createdAt = convertUTCToLocal(item?.["created at"]);
                        const lastUpdatedAt = convertUTCToLocal(item?.["updated at"]);
                        return (
                            <TableRow key={item?.["course id"]}>
                                <TableCell>
                                    <p>ID: {item?.["course id"]}</p>
                                </TableCell>
                                <TableCell>
                                    <p>{item?.["name"]}</p>
                                </TableCell>
                                <TableCell>
                                    <p>{item?.["tag"]}</p>
                                </TableCell>
                                <TableCell>
                                    <Image src={item?.["image"]} className="size-14" />
                                </TableCell>
                                <TableCell>
                                    <p>{item?.["source language"]}</p>
                                </TableCell>
                                <TableCell>
                                    <p>{item?.["target language"]}</p>
                                </TableCell>
                                <TableCell>
                                    <p>{item?.price}</p>
                                </TableCell>
                                <TableCell>
                                    <p>{Number(item?.discount) * 100}%</p>
                                </TableCell>
                                <TableCell>
                                    <p>{createdAt.toLocaleDateString()}</p>
                                </TableCell>
                                <TableCell>
                                    <p>{lastUpdatedAt.toLocaleDateString()}</p>
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={clsx(
                                            "py-1 px-2 rounded-large",
                                            item?.["is private"]
                                                ? "text-red-500 bg-red-200"
                                                : "text-green-500 bg-green-200"
                                        )}>
                                        {item?.["is private"] ? "Private" : "Public"}
                                    </span>
                                    <span
                                        className={clsx(
                                            "py-1 px-2 rounded-large",
                                            item?.["is deleted"]
                                                ? "text-red-500 bg-red-200"
                                                : "text-blue-500 bg-blue-200"
                                        )}>
                                        {item?.["is deleted"] ? "Inactive" : "Active"}
                                    </span>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};
