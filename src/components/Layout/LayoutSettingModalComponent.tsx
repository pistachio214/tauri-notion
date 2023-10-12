
import React from 'react';
import { Tabs, Modal, Card, Button } from 'antd';
import type { TabsProps } from 'antd';
import {
    TagsOutlined,
    UserOutlined,
    SettingOutlined,
    WarningOutlined,
} from '@ant-design/icons';

import { invoke } from '@tauri-apps/api';

import { LayoutSettingTabsContainer } from '@/styles/layout';
import { message, modal } from '@/components/Antd/EscapeAntd';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '@/redux/hook';
import { restMarkDownEditor } from '@/redux/slice/editor';
import { setBreadcrumbItems } from '@/redux/slice/breadcrumb';
import { restSystem } from '@/redux/slice/system';


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

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const items: TabsProps['items'] = [
        {
            label: (
                <span>
                    <UserOutlined />
                    用户管理
                </span>
            ),
            key: '1',
            children: (
                <>
                    <Button
                        danger
                        type='primary'
                        onClick={() => {
                            modal.confirm({
                                icon: <WarningOutlined />,
                                title: `提示！`,
                                content: `确定退出系统？`,
                                centered: true,
                                onOk() {
                                    invoke("logout").then(() => {
                                        localStorage.clear();

                                        dispatch(restMarkDownEditor())
                                        dispatch(setBreadcrumbItems([]));
                                        dispatch(restSystem());

                                        message.success('🎉🎉🎉 退出成功', 1);
                                        navigate('/login');
                                    })
                                },
                                onCancel() {
                                    console.log('Cancel');
                                },
                            })

                        }}
                    >
                        退出
                    </Button>
                </>
            ),
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