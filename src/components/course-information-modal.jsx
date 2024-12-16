/* eslint-disable react/prop-types */
import { Image, Link, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useEffect } from "react";
import { Rating } from "./rating";

export const CourseInformationModal = ({ isOpen, onClose, courseInformation, isLoading }) => {
    useEffect(() => {
        console.log(courseInformation);
    }, [courseInformation]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" radius="sm">
            <ModalContent>
                <ModalHeader>
                    <div className="flex justify-center w-full uppercase">Course information</div>
                </ModalHeader>
                <ModalBody>
                    {isLoading ? (
                        "Loading"
                    ) : (
                        <div className="flex items-start justify-between gap-4">
                            <div className="basis-1/2 text-base space-y-2">
                                <h4>
                                    <strong>Course name:&ensp;</strong> {courseInformation?.["name"]}
                                </h4>
                                <h4>
                                    <strong>Owner:&ensp;</strong> {courseInformation?.["username"]}&nbsp;-&nbsp;
                                    {courseInformation?.["first name"]}
                                    &nbsp;
                                    {courseInformation?.["last name"]}
                                </h4>
                                <div>
                                    <span>
                                        <strong>Cost</strong>
                                    </span>
                                    <div className="ml-4 flex items-center gap-8">
                                        <p>
                                            <i>Price:&ensp;</i> {courseInformation?.["price"]} USD
                                        </p>
                                        <p>
                                            <i>Discount:&ensp;</i> {Number(courseInformation?.["discount"])}
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
                                            {courseInformation?.["target language"]}
                                        </p>
                                        <p>
                                            <i>Source:&ensp;</i>&nbsp;
                                            {courseInformation?.["source language"]}
                                        </p>
                                    </div>
                                    <p className="ml-4">
                                        <i>Level course:&ensp;</i>&nbsp;{courseInformation?.["course level name"]}
                                    </p>
                                </div>
                                <p>
                                    <strong>Tag:&ensp;</strong> {courseInformation?.["tag"]}
                                </p>
                                <p>
                                    <strong>Short description:&ensp;</strong> {courseInformation?.["short description"]}
                                </p>
                                <p>
                                    <strong>Detailed description:&ensp;</strong>
                                    <p className="max-h-96 overflow-y-auto">
                                        {courseInformation?.["detailed description"]}
                                    </p>
                                </p>
                                <p>
                                    <strong>Status:&ensp;</strong>{" "}
                                    {courseInformation?.["is private"] ? "Private" : "Public"}
                                    &nbsp;-&nbsp;
                                    {courseInformation?.["status"]?.[0]?.toUpperCase() +
                                        courseInformation?.["status"]?.slice(1)}
                                    &nbsp;-&nbsp;{courseInformation?.["is deleted"] ? "Disabled" : "Enabled"}
                                </p>
                                <p>
                                    <strong>Created at:&ensp;</strong>{" "}
                                    {new Date(courseInformation?.["created at"]).toDateString()}
                                </p>
                                <p>
                                    <strong>Updated at:&ensp;</strong>{" "}
                                    {new Date(courseInformation?.["updated at"]).toDateString()}
                                </p>
                                <div className="flex items-center gap-4">
                                    <p>
                                        <strong>Rate:</strong>&nbsp;
                                        {courseInformation?.["avg rate"] || 0}
                                    </p>
                                    <Rating value={Math.round(courseInformation?.["avg rate"])} size="sm" />
                                </div>
                                <Link
                                    className="underline flex"
                                    target="_blank"
                                    href={`${import.meta.env.VITE_CLIENT_URL}/sign-in?redirect=/course-information/${
                                        courseInformation?.["course id"]
                                    }`}>
                                    Go to view more (Please sign in by admin account)
                                </Link>
                            </div>
                            <div className="basis-1/2">
                                <Image src={courseInformation?.["image"]} className="w-full border-1" />
                            </div>
                        </div>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
