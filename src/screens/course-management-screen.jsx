import {
    Button,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    Select,
    SelectItem,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    Input,
} from "@nextui-org/react";
import { useQuery } from "react-query";
import { queryKeys } from "../react-query/queryKeys";
import { CourseService } from "../apis/course.api";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "../providers/GlobalStateProvider";
import { toast } from "react-toastify";
import clsx from "clsx";
import { CiFilter } from "react-icons/ci";
import { LanguageService } from "../apis/language.api";
import { RiResetLeftLine } from "react-icons/ri";
import { RoleService } from "../apis/role.api";
import { useDebounce } from "../hooks/useDebounce";
import { FaSortDown, FaSortUp, FaSort } from "react-icons/fa";

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

    const [courses, setCourses] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
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

    useEffect(() => {
        console.log(sort);
        let courses = courseListQuery.data || [];
        console.log(courses);
        if (sort.id)
            courses.sort((a, b) => {
                return sort.id === "asc" ? a?.["course id"] - b?.["course id"] : b?.["course id"] - a?.["course id"];
            });

        if (sort.name)
            courses.sort((a, b) => {
                return sort.name === "asc"
                    ? a?.["name"].localeCompare(b?.["name"])
                    : b?.["name"].localeCompare(a?.["name"]);
            });
        if (sort.owner)
            courses.sort((a, b) =>
                sort.owner === "asc"
                    ? a?.["username"].localeCompare(b?.["username"])
                    : b?.["username"].localeCompare(a?.["username"])
            );
        if (sort.price)
            courses.sort((a, b) =>
                sort.price === "asc"
                    ? Number(a?.["price"]) - Number(b?.["price"])
                    : Number(b?.["price"]) - Number(a?.["price"])
            );

        if (sort.createdAt)
            courses.sort((a, b) =>
                sort.createdAt === "asc"
                    ? new Date(a?.["created at"]) - new Date(b?.["created at"])
                    : new Date(b?.["created at"]) - new Date(a?.["created at"])
            );
        if (sort.levelCourse)
            courses.sort((a, b) =>
                sort.levelCourse === "asc"
                    ? a?.["course level name"].localeCompare(b?.["course level name"])
                    : b?.["course level name"].localeCompare(a?.["course level name"])
            );
        setCourses(courses);
    }, [courseListQuery, sort]);

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

                <div className="flex justify-end gap-2">
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

                {courseListQuery.isLoading || courseListQuery.isRefetching || courseListQuery.isFetching ? (
                    <Spinner />
                ) : (
                    <Table isStriped aria-label="Example static collection table" radius="sm">
                        <TableHeader radius="sm">
                            <TableColumn>
                                <span className="flex items-center cursor-pointer" aria-label="id" onClick={handleSort}>
                                    ID
                                    {sort.id === "asc" ? (
                                        <FaSortUp aria-label="id" onClick={handleSort} />
                                    ) : sort.id === "desc" ? (
                                        <FaSortDown aria-label="id" onClick={handleSort} />
                                    ) : (
                                        <FaSort aria-label="id" onClick={handleSort} />
                                    )}
                                </span>
                            </TableColumn>
                            <TableColumn>
                                <span
                                    className="flex items-center cursor-pointer"
                                    aria-label="name"
                                    onClick={handleSort}>
                                    Name
                                    {sort.name === "asc" ? (
                                        <FaSortUp aria-label="name" onClick={handleSort} />
                                    ) : sort.name === "desc" ? (
                                        <FaSortDown aria-label="name" onClick={handleSort} />
                                    ) : (
                                        <FaSort aria-label="name" onClick={handleSort} />
                                    )}
                                </span>
                            </TableColumn>
                            <TableColumn>Image Preview</TableColumn>
                            <TableColumn>
                                <span
                                    className="flex items-center cursor-pointer"
                                    aria-label="owner"
                                    onClick={handleSort}>
                                    Owner
                                    {sort.owner === "asc" ? (
                                        <FaSortUp aria-label="owner" onClick={handleSort} />
                                    ) : sort.owner === "desc" ? (
                                        <FaSortDown aria-label="owner" onClick={handleSort} />
                                    ) : (
                                        <FaSort aria-label="owner" onClick={handleSort} />
                                    )}
                                </span>
                            </TableColumn>
                            <TableColumn>Role</TableColumn>
                            <TableColumn>
                                <span
                                    className="flex items-center cursor-pointer"
                                    aria-label="price"
                                    onClick={handleSort}>
                                    Price($)
                                    {sort.price === "asc" ? (
                                        <FaSortUp aria-label="price" onClick={handleSort} />
                                    ) : sort.price === "desc" ? (
                                        <FaSortDown aria-label="price" onClick={handleSort} />
                                    ) : (
                                        <FaSort aria-label="price" onClick={handleSort} />
                                    )}
                                </span>
                            </TableColumn>
                            <TableColumn>
                                <span
                                    className="flex items-center cursor-pointer"
                                    aria-label="createdAt"
                                    onClick={handleSort}>
                                    Created at
                                    {sort.createdAt === "asc" ? (
                                        <FaSortUp aria-label="createdAt" onClick={handleSort} />
                                    ) : sort.createdAt === "desc" ? (
                                        <FaSortDown aria-label="createdAt" onClick={handleSort} />
                                    ) : (
                                        <FaSort aria-label="createdAt" onClick={handleSort} />
                                    )}
                                </span>
                            </TableColumn>
                            <TableColumn>Target</TableColumn>
                            <TableColumn>Source</TableColumn>
                            <TableColumn>
                                <span
                                    className="flex items-center cursor-pointer"
                                    aria-label="levelCourse"
                                    onClick={handleSort}>
                                    Level course
                                    {sort.levelCourse === "asc" ? (
                                        <FaSortUp aria-label="levelCourse" onClick={handleSort} />
                                    ) : sort.levelCourse === "desc" ? (
                                        <FaSortDown aria-label="levelCourse" onClick={handleSort} />
                                    ) : (
                                        <FaSort aria-label="levelCourse" onClick={handleSort} />
                                    )}
                                </span>
                            </TableColumn>
                            <TableColumn>Status</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {courses?.map((course) => {
                                const createdAt = new Date(course?.["created at"]);
                                return (
                                    <TableRow key={course?.["course id"]}>
                                        <TableCell>{course?.["course id"]}</TableCell>
                                        <TableCell>{course?.["name"]}</TableCell>
                                        <TableCell>
                                            <Image
                                                src={course?.["image"]}
                                                loading="lazy"
                                                className="size-10 cursor-pointer"
                                                radius="sm"
                                                onClick={() => {
                                                    setImagePreview(course?.["image"]);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{course?.["username"]}</TableCell>
                                        <TableCell>{course?.["role name"]}</TableCell>
                                        <TableCell>{course?.["price"]}</TableCell>
                                        <TableCell>
                                            {createdAt.getDate()}-{createdAt.getMonth() + 1}-{createdAt.getFullYear()}
                                        </TableCell>

                                        <TableCell>{course?.["target language"]}</TableCell>
                                        <TableCell>{course?.["source language"]}</TableCell>
                                        <TableCell>{course?.["course level name"]}</TableCell>
                                        <TableCell>
                                            <span
                                                className={clsx(
                                                    "text-white text-[12px] py-1 px-2 rounded-small",
                                                    course?.["status"] === "done" ? "bg-green-500" : "bg-red-500 "
                                                )}>
                                                {course?.["status"]}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button radius="sm" size="sm">
                                                    View
                                                </Button>
                                                <Button radius="sm" size="sm">
                                                    {course?.["is deleted"] ? "Enable" : "Disable"}
                                                </Button>
                                                <Button radius="sm" size="sm">
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </div>
            <Modal
                size="lg"
                className="p-0"
                isOpen={!!imagePreview}
                onClose={() => {
                    setImagePreview(null);
                }}>
                <ModalContent className="p-0">
                    <ModalBody className="p-0">
                        <div className="flex justify-center">
                            <Image src={imagePreview} className="size-96" />
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}
