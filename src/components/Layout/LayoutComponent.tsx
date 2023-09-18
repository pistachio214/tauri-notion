import React from 'react';
import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    ShopOutlined,
    TeamOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Image, Layout, Menu } from 'antd';
import reactPng from './../../assets/6.jpeg';
import { LogoContainer } from '../../styles/layout';
import { Outlet } from 'react-router';

const { Content, Sider } = Layout;

const items: MenuProps['items'] = [
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    BarChartOutlined,
    CloudOutlined,
    AppstoreOutlined,
    TeamOutlined,
    ShopOutlined,
].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `nav ${index + 1}`,
    children: [
        {
            key: `${String(index + 100)}`,
            icon: React.createElement(icon),
            label: `nav children ${index + 1}`,
        }
    ]
}));

const App: React.FC = () => {

    return (
        <Layout hasSider>
            <Sider
                width={300}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    background: '#FFFFFF'
                }}
            >
                <LogoContainer>
                    <Image className={'logo-img'} src={reactPng} alt={''} preview={false} />
                    <span>莱昂纳多·迪卡普里奥</span>
                </LogoContainer>

                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={['4']}
                    items={items} />

            </Sider>
            <Layout className="site-layout" style={{ marginLeft: 300 }}>
                <Content style={{ margin: '12px 16px', overflow: 'initial' }}>
                    <Outlet />

                </Content>
            </Layout>
        </Layout>
    );
};

export default App;