/* eslint-disable react/prop-types */
import { Image, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { memo, useContext } from "react";
import { Rating } from "./rating";
import { useQuery } from "react-query";
import { queryKeys } from "../react-query/queryKeys";
import { CourseService } from "../apis/course.api";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { GlobalStateContext } from "../providers/GlobalStateProvider";

// eslint-disable-next-line react/display-name
export const CourseInformationModal = memo(({ isOpen, onClose, courseId, footer }) => {
    const user = useRecoilValue(userState);
    const { updateUserState } = useContext(GlobalStateContext);

    const courseInformationQuery = useQuery({
        queryKey: [queryKeys.courseInformation, courseId],
        queryFn: async () => {
            try {
                return await CourseService.fetchCourseInformation(courseId, user, updateUserState);
            } catch (error) {
                console.error(error);
                toast.error(error?.response?.data?.errorCode);
            }
        },
        enabled: courseId !== null,
        staleTime: 60 * 1000 * 5, // 5 minutes,
        cacheTime: 60 * 1000 * 10, // 10 minutes
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" radius="sm">
            <ModalContent>
                <ModalHeader>
                    <div className="flex justify-center w-full uppercase">Course information</div>
                </ModalHeader>
                <ModalBody>
                    {courseInformationQuery.isLoading ||
                    courseInformationQuery.isFetching ||
                    courseInformationQuery.isRefetching ? (
                        "Loading"
                    ) : (
                        <div className="flex items-start justify-between gap-4">
                            <div className="basis-1/2 text-base space-y-2">
                                <h4>
                                    <strong>Course name:&ensp;</strong> {courseInformationQuery.data?.["name"]}
                                </h4>
                                <h4>
                                    <strong>Owner:&ensp;</strong> {courseInformationQuery.data?.["username"]}
                                    &nbsp;-&nbsp;
                                    {courseInformationQuery.data?.["first name"]}
                                    &nbsp;
                                    {courseInformationQuery.data?.["last name"]}
                                </h4>
                                <div>
                                    <span>
                                        <strong>Cost</strong>
                                    </span>
                                    <div className="ml-4 flex items-center gap-8">
                                        <p>
                                            <i>Price:&ensp;</i> {courseInformationQuery.data?.["price"]} USD
                                        </p>
                                        <p>
                                            <i>Discount:&ensp;</i> {Number(courseInformationQuery.data?.["discount"])}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <span>
                                        <strong>Languages</strong>
                                    </span>
                                    <div className="ml-4 flex items-center gap-4">
                                        <p>
                                            <i>Target:&ensp;</i>&nbsp;
                                            {courseInformationQuery.data?.["target language"]}
                                        </p>
                                        <p>
                                            <i>Source:&ensp;</i>&nbsp;
                                            {courseInformationQuery.data?.["source language"]}
                                        </p>
                                    </div>
                                    <p className="ml-4">
                                        <i>Level course:&ensp;</i>&nbsp;
                                        {courseInformationQuery.data?.["course level name"]}
                                    </p>
                                </div>
                                <p>
                                    <strong>Tag:&ensp;</strong> {courseInformationQuery.data?.["tag"]}
                                </p>
                                <p>
                                    <strong>Short description:&ensp;</strong>
                                    {courseInformationQuery.data?.["short description"]}
                                </p>
                                <p>
                                    <strong>Detailed description:&ensp;</strong>
                                    <p className="max-h-80 overflow-y-auto">
                                        {courseInformationQuery.data?.["detailed description"]}
                                    </p>
                                </p>
                                <p>
                                    <strong>Status:&ensp;</strong>
                                    {courseInformationQuery.data?.["is private"] ? "Private" : "Public"}
                                    &nbsp;-&nbsp;
                                    {courseInformationQuery.data?.["status"]?.[0]?.toUpperCase() +
                                        courseInformationQuery.data?.["status"]?.slice(1)}
                                    &nbsp;-&nbsp;{courseInformationQuery.data?.["is deleted"] ? "Disabled" : "Enabled"}
                                </p>
                                <p>
                                    <strong>Created at:&ensp;</strong>
                                    {new Date(courseInformationQuery.data?.["created at"]).toDateString()}
                                </p>
                                <p>
                                    <strong>Updated at:&ensp;</strong>
                                    {new Date(courseInformationQuery.data?.["updated at"]).toDateString()}
                                </p>
                                <div className="flex items-center gap-4">
                                    <p>
                                        <strong>Rate:</strong>&nbsp;
                                        {courseInformationQuery.data?.["avg rate"] || 0}
                                    </p>
                                    <Rating value={Math.round(courseInformationQuery.data?.["avg rate"])} size="sm" />
                                </div>
                                <Link
                                    className="underline flex"
                                    target="_blank"
                                    href={`${import.meta.env.VITE_CLIENT_URL}/sign-in?redirect=/course-information/${
                                        courseInformationQuery.data?.["course id"]
                                    }`}>
                                    Go to view more (Please sign in by admin account)
                                </Link>
                            </div>
                            <div className="basis-1/2">
                                <Image src={courseInformationQuery.data?.["image"]} className="w-full border-1" />
                            </div>
                        </div>
                    )}
                </ModalBody>
                {!!footer && <ModalFooter>{footer}</ModalFooter>}
            </ModalContent>
        </Modal>
    );
});
