import { useMutation, useQuery } from "react-query";
import { queryKeys } from "../react-query/queryKeys";
import { useContext, useState } from "react";
import { UserService } from "../apis/user.api";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { GlobalStateContext } from "../providers/GlobalStateProvider";
import {
    Avatar,
    Button,
    Input,
    Select,
    SelectItem,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
} from "@nextui-org/react";
import { CiFilter } from "react-icons/ci";
import { RiResetLeftLine } from "react-icons/ri";
import { RoleService } from "../apis/role.api";
import { useDebounce } from "../hooks/useDebounce";
import { UserListTable } from "../components/user-list-table";
import { RejectionModal } from "./rejection-modal";

const sortBys = [
    { label: "Spent", key: "spent" },
    { label: "Owned courses", key: "created_course" },
    { label: "Number enrollment", key: "number_enrollment" },
];

const sortDirections = [
    {
        label: "Ascending",
        key: "ASC",
    },
    {
        label: "Descending",
        key: "DESC",
    },
];

const initFilters = {
    roleId: "",
    username: "",
    sortBy: "",
    sortDirection: "",
};

export default function UserManagement() {
    const user = useRecoilValue(userState);
    const { updateUserState } = useContext(GlobalStateContext);

    const [filter, setFilter] = useState(initFilters);
    const [page, setPage] = useState({
        currentPage: 1,
        limit: 20,
    });

    const searchDebounce = useDebounce(filter.username, 800);

    const roleListQuery = useQuery({
        queryKey: [queryKeys.roles],
        queryFn: async () => {
            try {
                const data = await RoleService.getRoles(user, updateUserState);
                return data?.["roles"];
            } catch (error) {
                console.error(error);
                toast.error(error?.response?.data?.errorCode);
            }
        },
        staleTime: 60 * 1000 * 60 * 24, // 1 day
        cacheTime: 60 * 1000 * 60 * 24, // 1 day
    });

    const listUsersQuery = useQuery({
        queryKey: [
            queryKeys.listUsers,
            filter.roleId,
            searchDebounce,
            filter.sortBy,
            filter.sortDirection,
            page.currentPage,
            page.limit,
        ],
        queryFn: async ({ queryKey }) => {
            try {
                const data = await UserService.fetchListUser(
                    {
                        li: queryKey[6],
                        np: queryKey[5],
                        sortBy: queryKey[3],
                        sortDirection: queryKey[4],
                        roleIdFilter: queryKey[1],
                        usernameFilter: queryKey[2],
                    },
                    user,
                    updateUserState
                );
                return data?.["users"];
            } catch (error) {
                console.error(error);
                toast.error(error?.response?.data?.errorCode);
            }
        },
        staleTime: 60 * 1000 * 5, // 5 minutes
        cacheTime: 60 * 1000 * 10, // 10 minutes
    });

    const enableUserMutation = useMutation({
        mutationFn: async (userId) => {
            await UserService.enableUser(userId, user, updateUserState);
            return userId;
        },
        onSuccess: async () => {
            toast.success("User enabled successfully");
            listUsersQuery.refetch();
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
            listUsersQuery.refetch();
        },
        onError: (error) => {
            console.error(error);
            toast.error(error?.response?.data?.errorCode);
        },
    });

    const handleDisableEnableUser = (action, userId) => {
        if (action === "enable") {
            enableUserMutation.mutate(userId);
        } else if (action === "disable") {
            disableUserMutation.mutate(userId);
        }
    };

    const handleResetFilter = () => {
        setFilter(initFilters);
    };

    return (
        <div className="py-4 space-y-2">
            <div>
                <div className="px-4 py-2 rounded-small shadow-small bg-white flex items-center gap-2">
                    <div>
                        <CiFilter className="size-6" />
                    </div>
                    <Input
                        type="text"
                        label="Search by username"
                        radius="sm"
                        value={filter.username}
                        onChange={(e) => setFilter({ ...filter, username: e.target.value })}
                    />
                    <Select
                        label="Role"
                        radius="sm"
                        selectedKeys={[filter.roleId?.toString()]}
                        value={filter.roleId}
                        onChange={(e) => setFilter({ ...filter, roleId: e.target.value })}>
                        {roleListQuery.data?.map((role) => (
                            <SelectItem
                                key={role?.["role id"]}
                                title={role?.["role name"][0].toUpperCase() + role?.["role name"].slice(1)}
                            />
                        ))}
                    </Select>
                    <Select
                        label="Sort by"
                        radius="sm"
                        selectedKeys={[filter.sortBy?.toString()]}
                        value={filter.sortBy}
                        onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })}>
                        {sortBys?.map((sort) => (
                            <SelectItem key={sort?.key} title={sort?.label} />
                        ))}
                    </Select>
                    <Select
                        label="Sort direction"
                        radius="sm"
                        selectedKeys={[filter.sortDirection?.toString()]}
                        value={filter.sortDirection}
                        onChange={(e) => setFilter({ ...filter, sortDirection: e.target.value })}>
                        {sortDirections?.map((direction) => (
                            <SelectItem key={direction?.key} title={direction?.label} />
                        ))}
                    </Select>

                    <Tooltip placement="bottom" content="Reset" showArrow={true} radius="sm">
                        <Button isIconOnly startContent={<RiResetLeftLine />} onPress={handleResetFilter} />
                    </Tooltip>
                </div>
            </div>

            <div className="flex items-center justify-between gap-2">
                <Button
                    radius="sm"
                    color="primary"
                    onPress={() => {
                        listUsersQuery.refetch();
                    }}>
                    Force refresh
                </Button>
                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        <span className="text-[12px]">
                            Showing {listUsersQuery.data?.length} courses of page {page.currentPage}
                        </span>
                    </div>
                    <Button
                        radius="sm"
                        color="primary"
                        isDisabled={page.currentPage <= 1}
                        onPress={() => setPage({ ...page, currentPage: page.currentPage - 1 })}>
                        Previous
                    </Button>
                    <Button
                        radius="sm"
                        color="primary"
                        isDisabled={listUsersQuery.data?.length === 0}
                        onPress={() => setPage({ ...page, currentPage: page.currentPage + 1 })}>
                        Next
                    </Button>
                </div>
            </div>

            <UserListTable listUsers={listUsersQuery.data} handleDisableEnableUser={handleDisableEnableUser} />

            <RejectionModal />
        </div>
    );
}
