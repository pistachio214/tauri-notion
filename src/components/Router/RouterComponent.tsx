import React, {
    Suspense
} from "react";
import { Spin } from "antd";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import LayoutComponent from '@/components/Layout/LayoutComponent';

import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";

const RouterComponent: React.FC = () => {

    return (
        <>
            <Suspense fallback={<Spin />}>
                <HashRouter>
                    <Routes>
                        <Route
                            path={"/"}
                            element={
                                // sessionStorage.getItem("token") ?
                                //     <Dashboard /> : <Login />

                                <Navigate to={'/dashboard'} />
                            }
                        />
                        <Route path={"/login"} element={<Login />} />

                        <Route path="/" element={<LayoutComponent />}>
                            <Route path={"/dashboard"} element={<Dashboard />} />
                            {/* <Route path={"/"} element={<Dashboard />} /> */}
                        </Route>

                    </Routes>
                </HashRouter>
            </Suspense>
        </>
    );
}

export default RouterComponent;