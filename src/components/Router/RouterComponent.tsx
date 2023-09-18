import React, {
    Suspense
} from "react";
import { Spin } from "antd";
import { HashRouter, Route, Routes } from "react-router-dom";

import LayoutComponent from './../Layout/LayoutComponent';

import Login from "../../pages/login";
import Dashboard from "../../pages/dashboard";

const RouterComponent: React.FC = () => {

    return (
        <>
            <Suspense fallback={<Spin />}>
                <HashRouter>
                    <Routes>
                        <Route path={"/"} element={
                            sessionStorage.getItem("token") === "萧十一郎" ?
                                <Dashboard /> : <Login />
                        }
                        />
                        <Route path={"/login"} element={<Login />} />

                        <Route path="/" element={<LayoutComponent />}>
                            <Route path={"/dashboard"} element={<Dashboard />} />
                        </Route>


                    </Routes>
                </HashRouter>
            </Suspense>
        </>
    );
}

export default RouterComponent;