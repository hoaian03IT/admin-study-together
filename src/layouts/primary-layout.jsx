import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";

export const PrimaryLayout = ({ children }) => {
    return (
        <div className="flex">
            <div className="flex min-h-screen">
                <Sidebar />
            </div>
            <div className="flex-1 flex flex-col">
                <header className="px-12 shadow-sm">
                    <Header />
                </header>
                <div className="px-12 bg-[#f8f6f6] flex-1">{children}</div>
            </div>
        </div>
    );
};
