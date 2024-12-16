import { createHttpAuth } from "../configs/http";

class CourseService {
    static async getCourseList(
        { courseId, roleId, targetLanguageId, sourceLanguageId, minPrice, maxPrice, nPage, limit },
        userState,
        updateUserState
    ) {
        const httpAuth = createHttpAuth(userState, updateUserState);
        const res = await httpAuth.get(
            `course/admin/all?ci=${courseId}&ri=${roleId}&tli=${targetLanguageId}&sli=${sourceLanguageId}&mnp=${minPrice}&mxp=${maxPrice}&np=${nPage}&lm=${limit}`
        );
        return res.data;
    }

    static async fetchCourseInformation(courseId, userState, updateUserState) {
        const httpAuth = createHttpAuth(userState, updateUserState);
        const res = await httpAuth.get(`/course/overview?course-id=${courseId}`);
        return res.data;
    }

    static async enableCourse(courseId, userState, updateUserState) {
        const httpAuth = createHttpAuth(userState, updateUserState);
        const res = await httpAuth.post(`/course/admin/enable-course`, { courseId });
        return res.data;
    }
    static async disableCourse(courseId, userState, updateUserState) {
        const httpAuth = createHttpAuth(userState, updateUserState);
        const res = await httpAuth.post(`/course/admin/disable-course`, { courseId });
        return res.data;
    }
}

export { CourseService };
