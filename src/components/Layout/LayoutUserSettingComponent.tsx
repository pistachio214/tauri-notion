import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import {
    GithubOutlined,
    GitlabOutlined,
    WarningOutlined,
} from "@ant-design/icons";

import { invoke } from '@tauri-apps/api';

import { message, modal } from '@/components/Antd/EscapeAntd';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '@/redux/hook';
import { restMarkDownEditor } from '@/redux/slice/editor';
import { setBreadcrumbItems } from '@/redux/slice/breadcrumb';
import { restSystem } from '@/redux/slice/system';
import { UserSettingContainer } from "@/styles/user";
import { SysUser } from "@/types/user";

const LayoutUserSettingComponent: React.FC = () => {
    const options = [
        {
            label: <><GithubOutlined />&nbsp;&nbsp;&nbsp;&nbsp;GitHub </>,
            value: 1
        },
        {
            label: <><GitlabOutlined />&nbsp;&nbsp;&nbsp;&nbsp;Gitee </>,
            value: 2
        }
    ];

    const [form] = Form.useForm();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [id, setId] = useState<string>('');

    useEffect(() => {
        let user_json = localStorage.getItem("user_info");
        let sysUser: SysUser = JSON.parse(user_json!);

        setId(sysUser.id!);
        form.setFieldsValue({ ...sysUser, ...{ password: undefined } });

    }, [])

    const logout = () => {
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
    }

    const handleOk = () => {
        modal.confirm({
            icon: <WarningOutlined />,
            title: `提示！`,
            content: `确定修改用户配置,可能会造成预料之外的后果？`,
            centered: true,
            onOk() {
                const data = form.getFieldsValue();
                invoke<SysUser>("change_user_setting", { id, data })
                    .then((e) => {
                        localStorage.setItem('user_info', JSON.stringify(e))
                        message.success('🎉🎉🎉 修改成功', 1);
                    })
                    .catch((e) => message.error(e));
            },
            onCancel() {
                console.log('Cancel');
            },
        })
    }

    return (
        <UserSettingContainer>
            <Form
                name="save-user-setting-form"
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                labelAlign="right"
                onFinish={() => handleOk()}
                autoComplete="off"
                layout="vertical"

            >
                <Form.Item
                    label="类型"
                    name="type"
                    rules={[
                        { required: true, message: '请输入类型!' }
                    ]}
                >
                    <Select
                        placeholder={'请选择您的用户类型'}
                        options={options}
                    />
                </Form.Item>

                <Form.Item
                    label="access_token"
                    name="access_token"
                    rules={[
                        { required: true, message: '请输入标签名!' }
                    ]}
                >
                    <Input allowClear placeholder="请输入标签名" />
                </Form.Item>


                <Form.Item
                    label="所属空间"
                    name="owner"
                    rules={[
                        { required: true, message: '请输入所属空间!' }
                    ]}
                >
                    <Input allowClear placeholder="请输入所属空间" />
                </Form.Item>

                <Form.Item
                    label="所属仓库"
                    name="repo"
                    rules={[
                        { required: true, message: '请输入所属仓库!' }
                    ]}
                >
                    <Input allowClear placeholder="请输入所属仓库" />
                </Form.Item>

                <Form.Item
                    label="所属分支"
                    name="branch"
                    rules={[
                        { required: true, message: '请输入所属分支!' }
                    ]}
                >
                    <Input allowClear placeholder="请输入所属分支" />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        onClick={() => form.submit()}
                    >
                        更新信息
                    </Button>

                    <Button
                        danger
                        style={{ marginLeft: '10px' }}
                        onClick={() => logout()}
                    >
                        退出应用
                    </Button>
                </Form.Item>
            </Form>
        </UserSettingContainer >
    )
}

export default LayoutUserSettingComponent;