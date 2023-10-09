import React from "react";
import { ConfigProvider, App as AntdApp, } from 'antd';
import zhCN from "antd/es/locale/zh_CN";

import GlobalStyle from "@/styles/global";
import defaultSettings from "@/defaultSettings";
import EntryComponent from "@/components/Antd/EscapeAntd";
import RouterComponent from "@/components/Router/RouterComponent";

const App: React.FC = () => {
    return (
        <>
            <GlobalStyle color={defaultSettings.token.colorPrimary}/>
            <ConfigProvider locale={zhCN} theme={{token: defaultSettings.token}}>
                <AntdApp>
                    <EntryComponent/>
                    <RouterComponent/>
                </AntdApp>
            </ConfigProvider>
        </>
    );
}

export default App;