import { Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./configs/routes";
import { Fragment, Suspense } from "react";
import { Spinner } from "@nextui-org/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <div>
            <ToastContainer stacked />
            <Suspense fallback={<Spinner size="lg" />}>
                <Routes>
                    {publicRoutes.map((route) => {
                        const Element = route.component;
                        const Layout = route.layout ? route.layout : Fragment;
                        return (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Element />
                                    </Layout>
                                }
                            />
                        );
                    })}
                    {privateRoutes.map((route) => {
                        const Element = route.component;
                        const Layout = route.layout ? route.layout : Fragment;
                        return (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Element />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </Suspense>
        </div>
    );
}

export default App;
