import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { useContext } from "react";
import { GlobalStateContext } from "../providers/GlobalStateProvider";
import { useMutation, useQuery } from "react-query";
import { queryKeys } from "../react-query/queryKeys";
import { useParams } from "react-router-dom";
import { UserService } from "../apis/user.api";
import { toast } from "react-toastify";
import { UserBasicInformation } from "../components/user-basic-information";
import { UserEnrolledCourse } from "../components/user-enrolled-course";
import { UserOwnedCourse } from "../components/user-owned-courses";
import { Button } from "@nextui-org/react";

export default function UserDetail() {
    const { userId } = useParams();

    const user = useRecoilValue(userState);
    const { updateUserState } = useContext(GlobalStateContext);

    const userInfoQuery = useQuery({
        queryKey: [queryKeys.userInfo, userId],
        queryFn: async () => {
            try {
                const data = await UserService.fetchUserInfoDetails(userId, user, updateUserState);
                console.log(data?.["user"]);
                return data?.["user"];
            } catch (error) {
                toast.error(error.response?.data?.errorCode);
            }
        },
        enabled: userId !== null,
    });

    const enableUserMutation = useMutation({
        mutationFn: async (userId) => {
            await UserService.enableUser(userId, user, updateUserState);
            return userId;
        },
        onSuccess: async () => {
            toast.success("User enabled successfully");
            userInfoQuery.refetch();
        },
        onError: (error) => {
            console.error(error);
            toast.error(error?.response?.data?.errorCode);
        },
    });

    const disableUserMutation = useMutation({
        mutationFn: async (userId) => {
            await UserService.disableUser(userId, user, updateUserState);
            return userId;
        },
        onSuccess: async () => {
            toast.success("User disabled successfully");
            userInfoQuery.refetch();
        },
        onError: (error) => {
            console.error(error);
            toast.error(error?.response?.data?.errorCode);
        },
    });

    return (
        <div className="container mx-auto py-10 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <strong className="text-3xl">
                        {userInfoQuery.data?.["first name"]} {userInfoQuery.data?.["last name"]}
                    </strong>
                    <p>User ID: {userInfoQuery.data?.["user id"]}</p>
                </div>
                {userInfoQuery.data?.disabled ? (
                    <Button
                        radius="sm"
                        className="bg-blue-500 text-white"
                        onPress={() => enableUserMutation.mutate(userId)}
                        isLoading={enableUserMutation.isLoading}>
                        Enable user
                    </Button>
                ) : (
                    <Button
                        radius="sm"
                        className="bg-red-500 text-white"
                        onPress={() => disableUserMutation.mutate(userId)}
                        isLoading={disableUserMutation.isLoading}>
                        Disable user
                    </Button>
                )}
            </div>

            <UserBasicInformation userInfo={userInfoQuery.data} />

            <UserEnrolledCourse userId={userId} />

            <UserOwnedCourse userId={userId} />
        </div>
    );
}
