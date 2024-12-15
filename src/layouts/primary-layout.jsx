import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";

export const PrimaryLayout = () => {
    return (
        <div className="flex">
            <div className="h-full">
                <Sidebar />
            </div>
            <div className="flex-1">
                <header className="px-12 shadow-sm">
                    <Header />
                </header>
                <div className="px-12 bg-[#f8f6f6]"></div>
            </div>
        </div>
    );
};
