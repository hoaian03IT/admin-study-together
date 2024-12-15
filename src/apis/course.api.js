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
}

export { CourseService };
