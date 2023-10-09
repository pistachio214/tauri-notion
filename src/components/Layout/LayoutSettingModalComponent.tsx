
import React from 'react';
import { Tabs, Modal, Card } from 'antd';
import type { TabsProps } from 'antd';
import { TagsOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';

import { LayoutSettingTabsContainer } from '@/styles/layout';

interface IProps {
    open: boolean
    close: () => void
}

const AboutApplication = (
    <Card
        size="small"
        title="Tauri Notion"
        bordered={false}
        style={{
            border: "none",
            boxShadow: "none"
        }}
    >
        <p>这个应用是我用来做自己的的文本记录操作用的</p>
        <p>绝对不包含什么奇奇怪怪的东西</p>
        <p>保证应用软件的安全</p>
        <p>童叟无欺</p>
        <p>老少皆宜</p>
        <p>基于Tauri框架，得以在Windows、MacOs上无缝使用</p>
    </Card>
);

const LayoutSettingModalComponent: React.FC<IProps> = (props: IProps) => {

    const items: TabsProps['items'] = [
        {
            label: (
                <span>
                    <UserOutlined />
                    用户管理
                </span>
            ),
            key: '1',
            children: `Content of Tab 1`,
        },
        {
            label: (
                <span>
                    <SettingOutlined />
                    系统配置
                </span>
            ),
            key: '2',
            children: `Content of Tab 2`,
        },
        {
            label: (
                <span>
                    <TagsOutlined />
                    关于应用
                </span>
            ),
            key: '3',
            children: AboutApplication,
        },
    ];

    return (

        <Modal
            open={props.open}
            onCancel={() => props.close()}
            footer={null}
            maskClosable={false}
            width={800}
            style={{ top: 100 }}
        >
            <LayoutSettingTabsContainer>
                <Tabs
                    size={'small'}
                    tabPosition={'left'}
                    items={items}
                    style={{
                        height: 500
                    }}
                />
            </LayoutSettingTabsContainer>
        </Modal >

    );
}

export default LayoutSettingModalComponent;