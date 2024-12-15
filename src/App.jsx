import { Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./configs/routes";
import { Fragment, Suspense } from "react";
import { Spinner } from "@nextui-org/react";
import { ToastContainer } from "react-toastify";

function App() {
    return (
        <div>
            <ToastContainer stacked />
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
                                    <Suspense fallback={<Spinner size="lg" />}>
                                        <Element />
                                    </Suspense>
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
                                    <Suspense fallback={<Spinner size="lg" />}>
                                        <Element />
                                    </Suspense>
                                </Layout>
                            }
                        />
                    );
                })}
            </Routes>
        </div>
    );
}

export default App;
