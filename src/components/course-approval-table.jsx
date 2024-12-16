/* eslint-disable react/prop-types */
import { Button, Image, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { Fragment, memo, useState } from "react";
import clsx from "clsx";
import { PreviewImageModal } from "../components/preview-image-modal";

// eslint-disable-next-line react/display-name
export const CourseApprovalTable = memo(({ courses = [], setSelectedCourse, handleApproveRejectCourse }) => {
    const [imagePreview, setImagePreview] = useState(null);
    return (
        <Fragment>
            <Table isStriped aria-label="Example static collection table" radius="sm">
                <TableHeader radius="sm">
                    <TableColumn>
                        <span className="flex items-center cursor-pointer" aria-label="id">
                            ID
                        </span>
                    </TableColumn>
                    <TableColumn>
                        <span className="flex items-center cursor-pointer" aria-label="name">
                            Name
                        </span>
                    </TableColumn>
                    <TableColumn>Image Preview</TableColumn>
                    <TableColumn>
                        <span className="flex items-center cursor-pointer" aria-label="owner">
                            Owner
                        </span>
                    </TableColumn>
                    <TableColumn>Role</TableColumn>
                    <TableColumn>
                        <span className="flex items-center cursor-pointer">Tag</span>
                    </TableColumn>
                    <TableColumn>
                        <span className="flex items-center cursor-pointer">Short description</span>
                    </TableColumn>
                    <TableColumn>
                        <span className="flex items-center cursor-pointer" aria-label="createdAt">
                            Created at
                        </span>
                    </TableColumn>
                    <TableColumn>Target</TableColumn>
                    <TableColumn>Source</TableColumn>
                    <TableColumn>
                        <span className="flex items-center cursor-pointer" aria-label="levelCourse">
                            Level course
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
                                        className="size-24 cursor-pointer"
                                        radius="sm"
                                        onClick={() => {
                                            setImagePreview(course?.["image"]);
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{course?.["username"]}</TableCell>
                                <TableCell>{course?.["role name"]}</TableCell>
                                <TableCell>{course?.["tag"]}</TableCell>
                                <TableCell>{course?.["short description"]}</TableCell>

                                <TableCell>
                                    {createdAt.getDate()}-{createdAt.getMonth() + 1}-{createdAt.getFullYear()}
                                </TableCell>

                                <TableCell>{course?.["target language"]}</TableCell>
                                <TableCell>{course?.["source language"]}</TableCell>
                                <TableCell>{course?.["course level name"]}</TableCell>
                                <TableCell>
                                    <span className={clsx("text-white text-[12px] py-1 px-2 rounded-small bg-red-400")}>
                                        {course?.["status"]}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            radius="sm"
                                            size="sm"
                                            onPress={() => setSelectedCourse(course?.["course id"])}>
                                            View
                                        </Button>
                                        <Button
                                            color="success"
                                            radius="sm"
                                            size="sm"
                                            onPress={() => handleApproveRejectCourse("approve", course?.["course id"])}>
                                            Approve
                                        </Button>
                                        <Button
                                            color="warning"
                                            radius="sm"
                                            size="sm"
                                            onPress={() => handleApproveRejectCourse("reject", course?.["course id"])}>
                                            Reject
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <PreviewImageModal imagePreview={imagePreview} setImagePreview={setImagePreview} />
        </Fragment>
    );
});
