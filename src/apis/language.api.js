import { http } from "../configs/http";

class LanguageService {
    static async fetchAllLanguages() {
        const res = await http.get("/language/all");
        return res.data;
    }
}

export { LanguageService };
