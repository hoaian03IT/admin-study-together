import { Button, Spinner } from "@nextui-org/react";
import { useMutation, useQuery } from "react-query";
import { queryKeys } from "../react-query/queryKeys";
import { CourseService } from "../apis/course.api";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { useCallback, useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "../providers/GlobalStateProvider";
import { toast } from "react-toastify";
import { useDetectScroll } from "../hooks/useDetectScroll";
import { CourseInformationModal } from "../components/course-information-modal";
import { CourseApprovalTable } from "../components/course-approval-table";
import { RejectionModal } from "./rejection-modal";

export default function CourseApprovalScreen() {
    const user = useRecoilValue(userState);
    const { updateUserState } = useContext(GlobalStateContext);

    const [page, setPage] = useState({ currentPage: 1, limit: 20 });
    const [courses, setCourses] = useState([]);
    const [rejectReason, setRejectReason] = useState("");

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showRejectReasonModal, setShowRejectReasonModal] = useState(false);

    const courseApprovalQuery = useQuery({
        queryKey: [queryKeys.courseApproval, page.currentPage],
        queryFn: async () => {
            try {
                const data = await CourseService.fetchPendingCourse(
                    { page: page.currentPage, limit: page.limit },
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
        staleTime: 1000 * 5,
        // refetchInterval: 60 * 1000, // Fetch new data every 60 seconds
    });

    const approveCourseMutation = useMutation({
        mutationFn: async (courseId) => await CourseService.approveCourse(courseId, user, updateUserState),
        onSuccess: () => {
            toast.success("Course has been approved.");
            handleForceRefresh();
        },
        onError: async (error) => {
            toast.error(error.response.data?.errorCode);
        },
    });

    const rejectCourseMutation = useMutation({
        mutationFn: async ({ courseId, reason }) =>
            await CourseService.rejectCourse(courseId, reason, user, updateUserState),
        onSuccess: () => {
            toast.success("Course has been rejected.");
            handleForceRefresh();
        },
        onError: async (error) => {
            toast.error(error.response.data?.errorCode);
        },
    });

    useDetectScroll(() => {
        if (courseApprovalQuery.data?.length > 0) setPage({ ...page, currentPage: page.currentPage + 1 });
    });

    useEffect(() => {
        if (courseApprovalQuery.data) {
            if (page.currentPage === 1) {
                setCourses(courseApprovalQuery.data || []);
            } else {
                setCourses((prev) => prev.concat(courseApprovalQuery.data));
            }
        }
    }, [courseApprovalQuery.data, page.currentPage]);

    const handleForceRefresh = useCallback(() => {
        courseApprovalQuery.refetch({ queryKey: [queryKeys.courseApproval, 1] }).then(({ data }) => {
            setPage({ ...page, currentPage: 1 });
            setCourses(data);
        });
    }, [courseApprovalQuery, page]);

    const handleApproveRejectCourse = (action, courseId) => {
        if (action === "reject") {
            setShowRejectReasonModal(courseId);
        } else if (action === "approve") {
            approveCourseMutation.mutate(courseId);
            setSelectedCourse(null);
        }
    };

    const handleRejectCourse = useCallback(() => {
        rejectCourseMutation.mutateAsync({ courseId: showRejectReasonModal, reason: rejectReason }).then(() => {
            setShowRejectReasonModal(null);
            setSelectedCourse(null);
            setRejectReason("");
        });
    }, [rejectCourseMutation, rejectReason, showRejectReasonModal]);

    const handleCloseRejectionModal = useCallback(() => {
        setShowRejectReasonModal(false);
        setRejectReason("");
    }, []);

    return (
        <div className="py-4 space-y-2">
            <div>
                <Button
                    radius="sm"
                    color="primary"
                    onPress={handleForceRefresh}
                    isLoading={
                        courseApprovalQuery.isFetching ||
                        courseApprovalQuery.isLoading ||
                        courseApprovalQuery.isRefetching
                    }>
                    Force refresh
                </Button>
            </div>
            <CourseApprovalTable
                courses={courses}
                handleApproveRejectCourse={handleApproveRejectCourse}
                setSelectedCourse={setSelectedCourse}
            />
            {(courseApprovalQuery.isFetching || courseApprovalQuery.isLoading || courseApprovalQuery.isRefetching) && (
                <div className="w-full flex justify-center">
                    <Spinner color="primary" size="lg" />
                </div>
            )}

            <CourseInformationModal
                courseId={selectedCourse}
                isOpen={!!selectedCourse}
                onClose={() => {
                    setSelectedCourse(null);
                }}
                footer={
                    <div className="flex items-center gap-2">
                        <Button
                            color="success"
                            radius="sm"
                            size="sm"
                            onPress={() => handleApproveRejectCourse("approve", selectedCourse)}>
                            Approve
                        </Button>
                        <Button
                            color="warning"
                            radius="sm"
                            size="sm"
                            onPress={() => handleApproveRejectCourse("reject", selectedCourse)}>
                            Reject
                        </Button>
                    </div>
                }
            />
            {/* modal for reject reason */}
            <RejectionModal
                showRejectReasonModal={showRejectReasonModal}
                rejectReason={rejectReason}
                setRejectReason={setRejectReason}
                handleRejectCourse={handleRejectCourse}
                onClose={handleCloseRejectionModal}
            />
        </div>
    );
}
