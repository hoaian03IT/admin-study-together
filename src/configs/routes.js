import { lazy } from "react";
import { pathname } from "../routes";
import { PrimaryLayout } from "../layouts/primary-layout";

const Dashboard = lazy(() => import("../screens/dashboard-screen"));
const UserManagement = lazy(() => import("../screens/user-management-screen"));
const CourseManagement = lazy(() => import("../screens/course-management-screen"));
const Revenue = lazy(() => import("../screens/revenues-screen"));
const SignIn = lazy(() => import("../screens/sign-in-screen"));

export const publicRoutes = [
    { path: pathname.dashboard, component: Dashboard, layout: PrimaryLayout },
    { path: pathname.users, component: UserManagement, layout: PrimaryLayout },
    { path: pathname.courses, component: CourseManagement, layout: PrimaryLayout },
    { path: pathname.revenues, component: Revenue, layout: PrimaryLayout },
];
export const privateRoutes = [{ path: pathname.signin, component: SignIn, layout: null }];