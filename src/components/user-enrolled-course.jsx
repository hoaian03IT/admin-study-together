import { useQuery } from "react-query";
import { queryKeys } from "../react-query/queryKeys";
import { CourseService } from "../apis/course.api";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { useContext } from "react";
import { GlobalStateContext } from "../providers/GlobalStateProvider";
import { toast } from "react-toastify";
import { Button, Image, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { convertUTCToLocal } from "../utils/convert-UTC-to-local";
import clsx from "clsx";

export const UserEnrolledCourse = ({ userId }) => {
    const user = useRecoilValue(userState);
    const { updateUserState } = useContext(GlobalStateContext);

    const enrolledCourseQuery = useQuery({
        queryKey: [queryKeys.enrolledCourse, userId],
        queryFn: async ({ queryKey }) => {
            try {
                const data = await CourseService.fetchUserEnrolledCourse(queryKey[1], user, updateUserState);
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
            <label className="font-semibold">Enrollments</label>
            <Table radius="sm">
                <TableHeader>
                    <TableColumn>Enrollment id</TableColumn>
                    <TableColumn>Enrollment id</TableColumn>
                    <TableColumn>Joined at</TableColumn>
                    <TableColumn>Last updated at</TableColumn>
                    <TableColumn>Expired at</TableColumn>
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Course</TableColumn>
                    <TableColumn>Course image</TableColumn>
                    <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody className="h-96 overflow-y-auto">
                    {enrolledCourseQuery.data?.map((item) => {
                        const joinedAt = convertUTCToLocal(item?.["created at"]);
                        const lastUpdatedAt = convertUTCToLocal(item?.["updated at"]);
                        const expiredAt = convertUTCToLocal(item?.["expired at"]);
                        return (
                            <TableRow key={item?.["enrollment id"]}>
                                <TableCell>
                                    <p>ID: {item?.["enrollment id"]}</p>
                                </TableCell>
                                <TableCell>
                                    <p>{item?.["points"]}</p>
                                </TableCell>
                                <TableCell>
                                    <p>{joinedAt.toLocaleDateString()}</p>
                                </TableCell>
                                <TableCell>
                                    <p>{lastUpdatedAt.toLocaleDateString()}</p>
                                </TableCell>
                                <TableCell>
                                    <p>{expiredAt.toLocaleDateString()}</p>
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={clsx(
                                            "py-1 px-2 rounded-large",
                                            item?.["is stopped"]
                                                ? "text-red-500 bg-red-2200"
                                                : "text-blue-500 bg-blue-200"
                                        )}>
                                        {item?.["is stopped"] ? "Stopped" : "Not stopped"}
                                    </span>
                                </TableCell>

                                <TableCell>
                                    <h6 className="font-semibold line-clamp-1">
                                        ({item?.["course id"]}) {item?.["name"]}
                                    </h6>
                                </TableCell>
                                <TableCell>
                                    <Image src={item?.["image"]} className="size-14" />
                                </TableCell>
                                <TableCell>
                                    {item?.["is disable"] ? (
                                        <Button radius="sm" size="sm" className="text-white bg-red-400">
                                            Disable enrollment
                                        </Button>
                                    ) : (
                                        <Button radius="sm" size="sm" className="text-white bg-green-400">
                                            Enable enrollment
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};
