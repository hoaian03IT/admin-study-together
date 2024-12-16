import { Button, Select, SelectItem, Tooltip, Input } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { queryKeys } from "../react-query/queryKeys";
import { CourseService } from "../apis/course.api";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "../providers/GlobalStateProvider";
import { toast } from "react-toastify";
import { CiFilter } from "react-icons/ci";
import { LanguageService } from "../apis/language.api";
import { RiResetLeftLine } from "react-icons/ri";
import { RoleService } from "../apis/role.api";
import { useDebounce } from "../hooks/useDebounce";
import { TableListCourse } from "../components/table-list-course";

const initSorts = {
    id: null,
    owner: null,
    price: null,
    createdAt: null,
    name: null,
    levelCourse: null,
};

export default function CourseManagement() {
    const user = useRecoilValue(userState);
    const { updateUserState } = useContext(GlobalStateContext);

    const queryClient = useQueryClient();

    const [courses, setCourses] = useState([]);

    const [filter, setFilter] = useState({
        searchId: "",
        role: "",
        targetLanguageId: "",
        sourceLanguageId: "",
        price: "0-9999",
    });

    const [sort, setSort] = useState(initSorts);

    const [page, setPage] = useState({
        currentPage: 1,
        limitRecords: 15,
    });

    const searchDebounce = useDebounce(filter.searchId, 500);

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
    });

    const languageListQuery = useQuery({
        queryKey: [queryKeys.languages],
        queryFn: async () => {
            try {
                const data = await LanguageService.fetchAllLanguages();
                return data?.["languages"];
            } catch (error) {
                console.error(error);
                toast.error(error?.response?.data?.errorCode);
            }
        },
    });

    const courseListQuery = useQuery({
        queryKey: [
            queryKeys.courseList,
            searchDebounce,
            filter.role,
            filter.price,
            filter.sourceLanguageId,
            filter.targetLanguageId,
            page.currentPage,
            page.limitRecords,
        ],
        queryFn: async ({ queryKey }) => {
            try {
                const data = await CourseService.getCourseList(
                    {
                        courseId: queryKey[1],
                        roleId: queryKey[2],
                        targetLanguageId: queryKey[5],
                        sourceLanguageId: queryKey[4],
                        minPrice: queryKey[3] ? queryKey[3]?.split("-")[0] : 0,
                        maxPrice: queryKey[3] ? queryKey[3]?.split("-")[1] : 0,
                        nPage: queryKey[6],
                        limit: queryKey[7],
                    },
                    user,
                    updateUserState
                );
                return data?.["courses"];
            } catch (error) {
                console.error(error);
                toast.error(error?.response?.data?.errorCode);
            }
        },
        enabled: user.isLogged,
        staleTime: 1000 * 60 * 2, // Fresh trong 2 phút
        cacheTime: 1000 * 60 * 10, // Cache trong 10 phút
    });

    const disableCourseMutation = useMutation({
        mutationFn: async (courseId) => await CourseService.disableCourse(courseId, user, updateUserState),
        onSuccess: (data) => {
            toast.success("Course has been disabled successfully.");
            handleUpdateEnableDisableStatus(data);
        },
        onError: async (error) => {
            toast.error(error.response.data?.errorCode);
        },
    });

    const enableCourseMutation = useMutation({
        mutationFn: async (courseId) => await CourseService.enableCourse(courseId, user, updateUserState),
        onSuccess: (data) => {
            toast.success("Course has been enabled successfully.");
            handleUpdateEnableDisableStatus(data);
        },
        onError: async (error) => {
            toast.error(error.response.data?.errorCode);
        },
    });

    const handleUpdateEnableDisableStatus = (data) => {
        let courses = queryClient.getQueryData([
            queryKeys.courseList,
            searchDebounce,
            filter.role,
            filter.price,
            filter.sourceLanguageId,
            filter.targetLanguageId,
            page.currentPage,
            page.limitRecords,
        ]);
        let index = courses.findIndex((course) => data?.["course id"] === course?.["course id"]);
        courses[index] = { ...courses[index], "is deleted": data?.["is deleted"] };

        queryClient.setQueryData(
            [
                queryKeys.courseList,
                searchDebounce,
                filter.role,
                filter.price,
                filter.sourceLanguageId,
                filter.targetLanguageId,
                page.currentPage,
                page.limitRecords,
            ],
            courses
        );
    };
    // cap nhat lai list course khi sort hoac co query courses
    useEffect(() => {
        let courses = courseListQuery.data || [];

        if (sort.id)
            courses.sort((a, b) => {
                return sort.id === "asc" ? a?.["course id"] - b?.["course id"] : b?.["course id"] - a?.["course id"];
            });
        else if (sort.name)
            courses.sort((a, b) => {
                return sort.name === "asc"
                    ? a?.["name"].localeCompare(b?.["name"])
                    : b?.["name"].localeCompare(a?.["name"]);
            });
        else if (sort.owner)
            courses.sort((a, b) =>
                sort.owner === "asc"
                    ? a?.["username"].localeCompare(b?.["username"])
                    : b?.["username"].localeCompare(a?.["username"])
            );
        else if (sort.price)
            courses.sort((a, b) =>
                sort.price === "asc"
                    ? Number(a?.["price"]) - Number(b?.["price"])
                    : Number(b?.["price"]) - Number(a?.["price"])
            );
        else if (sort.createdAt)
            courses.sort((a, b) =>
                sort.createdAt === "asc"
                    ? new Date(a?.["created at"]) - new Date(b?.["created at"])
                    : new Date(b?.["created at"]) - new Date(a?.["created at"])
            );
        else if (sort.levelCourse)
            courses.sort((a, b) =>
                sort.levelCourse === "asc"
                    ? a?.["course level name"].localeCompare(b?.["course level name"])
                    : b?.["course level name"].localeCompare(a?.["course level name"])
            );

        setCourses(courses);
    }, [courseListQuery, sort]);

    const handleDisableEnableCourse = (action, courseId) => {
        if (action === "enable") {
            enableCourseMutation.mutate(courseId);
        } else if (action === "disable") {
            disableCourseMutation.mutate(courseId);
        }
    };

    const handleResetFilter = () => {
        setFilter({
            searchId: "",
            role: "",
            targetLanguageId: "",
            sourceLanguageId: "",
            price: "0-9999",
        });
    };

    const handleSort = (e) => {
        if (sort[e.target.ariaLabel] === null) {
            setSort({ ...initSorts, [e.target.ariaLabel]: "asc" });
        } else if (sort[e.target.ariaLabel] === "asc") {
            setSort({ ...initSorts, [e.target.ariaLabel]: "desc" });
        } else {
            setSort({ ...initSorts });
        }
    };

    return (
        <div>
            <div className="py-4 space-y-2">
                <div>
                    <div className="px-4 py-2 rounded-small shadow-small bg-white flex items-center gap-2">
                        <div>
                            <CiFilter className="size-6" />
                        </div>
                        <Input
                            type="number"
                            label="Search by ID"
                            radius="sm"
                            value={filter.searchId}
                            onChange={(e) => setFilter({ ...filter, searchId: e.target.value })}
                        />
                        <Select
                            label="Role"
                            radius="sm"
                            selectedKeys={[filter.role.toString()]}
                            value={filter.role}
                            onChange={(e) => setFilter({ ...filter, role: e.target.value })}>
                            {roleListQuery.data?.map((role) => (
                                <SelectItem
                                    key={role?.["role id"]}
                                    title={role?.["role name"][0].toUpperCase() + role?.["role name"].slice(1)}
                                />
                            ))}
                        </Select>
                        <Select
                            label="Source language"
                            radius="sm"
                            selectedKeys={[filter.sourceLanguageId.toString()]}
                            value={filter.sourceLanguageId}
                            onChange={(e) => setFilter({ ...filter, sourceLanguageId: e.target.value })}>
                            {languageListQuery.data?.map((language) => (
                                <SelectItem key={language?.["language id"]} title={language?.["language name"]} />
                            ))}
                        </Select>
                        <Select
                            label="Target language"
                            radius="sm"
                            selectedKeys={[filter.targetLanguageId.toString()]}
                            value={filter.targetLanguageId}
                            onChange={(e) => setFilter({ ...filter, targetLanguageId: e.target.value })}>
                            {languageListQuery.data?.map((language) => (
                                <SelectItem key={language?.["language id"]} title={language?.["language name"]} />
                            ))}
                        </Select>
                        <Select
                            label="Price"
                            radius="sm"
                            selectedKeys={[filter.price]}
                            value={filter.price}
                            onChange={(e) =>
                                setFilter({
                                    ...filter,
                                    price: e.target.value,
                                })
                            }>
                            <SelectItem key="0-0" title="No price" />
                            <SelectItem key="0.0001-9999" title="Has price" />
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
                            courseListQuery.refetch();
                        }}>
                        Force refresh
                    </Button>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            <span className="text-[12px]">
                                Showing {courses.length} courses of page {page.currentPage}
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
                            isDisabled={courseListQuery.data?.length === 0}
                            onPress={() => setPage({ ...page, currentPage: page.currentPage + 1 })}>
                            Next
                        </Button>
                    </div>
                </div>
                <TableListCourse
                    isLoading={
                        courseListQuery?.isLoading || courseListQuery?.isRefetching || courseListQuery?.isFetching
                    }
                    sort={sort}
                    handleSort={handleSort}
                    courses={courses}
                    handleDisableEnableCourse={handleDisableEnableCourse}
                />
            </div>
        </div>
    );
}
