/* eslint-disable react/prop-types */
import {
    Button,
    Image,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { FaSortDown, FaSortUp, FaSort } from "react-icons/fa";
import { CourseInformationModal } from "./course-information-modal";
import { PreviewImageModal } from "./preview-image-modal";
import { convertUTCToLocal } from "../utils/convert-UTC-to-local";

export const TableListCourse = ({ courses, isLoading, sort, handleSort, handleDisableEnableCourse }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);

    return isLoading ? (
        <div className="flex justify-center">
            <Spinner size="lg" />
        </div>
    ) : (
        <Fragment>
            <Table isStriped aria-label="Example static collection table" radius="sm">
                <TableHeader radius="sm">
                    <TableColumn>
                        <span className="flex items-center cursor-pointer" aria-label="id" onClick={handleSort}>
                            ID
                            {sort?.id === "asc" ? (
                                <FaSortUp aria-label="id" onClick={handleSort} />
                            ) : sort?.id === "desc" ? (
                                <FaSortDown aria-label="id" onClick={handleSort} />
                            ) : (
                                <FaSort aria-label="id" onClick={handleSort} />
                            )}
                        </span>
                    </TableColumn>
                    <TableColumn>
                        <span className="flex items-center cursor-pointer" aria-label="name" onClick={handleSort}>
                            Name
                            {sort?.name === "asc" ? (
                                <FaSortUp aria-label="name" onClick={handleSort} />
                            ) : sort?.name === "desc" ? (
                                <FaSortDown aria-label="name" onClick={handleSort} />
                            ) : (
                                <FaSort aria-label="name" onClick={handleSort} />
                            )}
                        </span>
                    </TableColumn>
                    <TableColumn>Image Preview</TableColumn>
                    <TableColumn>
                        <span className="flex items-center cursor-pointer" aria-label="owner" onClick={handleSort}>
                            Owner
                            {sort?.owner === "asc" ? (
                                <FaSortUp aria-label="owner" onClick={handleSort} />
                            ) : sort?.owner === "desc" ? (
                                <FaSortDown aria-label="owner" onClick={handleSort} />
                            ) : (
                                <FaSort aria-label="owner" onClick={handleSort} />
                            )}
                        </span>
                    </TableColumn>
                    <TableColumn>Role</TableColumn>
                    <TableColumn>
                        <span className="flex items-center cursor-pointer" aria-label="price" onClick={handleSort}>
                            Price($)
                            {sort?.price === "asc" ? (
                                <FaSortUp aria-label="price" onClick={handleSort} />
                            ) : sort?.price === "desc" ? (
                                <FaSortDown aria-label="price" onClick={handleSort} />
                            ) : (
                                <FaSort aria-label="price" onClick={handleSort} />
                            )}
                        </span>
                    </TableColumn>
                    <TableColumn>
                        <span className="flex items-center cursor-pointer" aria-label="createdAt" onClick={handleSort}>
                            Created at
                            {sort?.createdAt === "asc" ? (
                                <FaSortUp aria-label="createdAt" onClick={handleSort} />
                            ) : sort?.createdAt === "desc" ? (
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
                            {sort?.levelCourse === "asc" ? (
                                <FaSortUp aria-label="levelCourse" onClick={handleSort} />
                            ) : sort?.levelCourse === "desc" ? (
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
                        const createdAt = convertUTCToLocal(course?.["created at"]);
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
                                <TableCell>{createdAt.toLocaleDateString()}</TableCell>

                                <TableCell>{course?.["target language"]}</TableCell>
                                <TableCell>{course?.["source language"]}</TableCell>
                                <TableCell>{course?.["course level name"]}</TableCell>
                                <TableCell>
                                    <span
                                        className={clsx(
                                            "block text-white text-[12px] py-1 px-2 rounded-small text-center",
                                            course?.["is private"] ? "bg-red-400" : "bg-green-400"
                                        )}>
                                        {course?.["is private"] ? "Private" : "Public"}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            radius="sm"
                                            size="sm"
                                            color="primary"
                                            onPress={() => setSelectedCourse(course?.["course id"])}>
                                            View
                                        </Button>
                                        <Button
                                            radius="sm"
                                            size="sm"
                                            color={course?.["is deleted"] ? "success" : "danger"}
                                            onPress={() =>
                                                handleDisableEnableCourse(
                                                    course?.["is deleted"] ? "enable" : "disable",
                                                    course?.["course id"]
                                                )
                                            }>
                                            {course?.["is deleted"] ? "Enable" : "Disable"}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            {/* modal to show image */}
            <PreviewImageModal imagePreview={imagePreview} setImagePreview={setImagePreview} />
            {/* modal to show course information */}
            <CourseInformationModal
                isOpen={selectedCourse !== null}
                onClose={() => setSelectedCourse(null)}
                courseId={selectedCourse}
            />
        </Fragment>
    );
};
