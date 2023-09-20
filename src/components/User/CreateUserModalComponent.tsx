import React, { useEffect } from "react";
import { RuleObject, StoreValue } from "rc-field-form/lib/interface";
import { Modal, Form, Input, Select } from "antd";
import {
    GithubOutlined,
    GitlabOutlined,
} from "@ant-design/icons";

import { invoke } from '@tauri-apps/api/tauri'

import { CreateUserModalContainer } from "../../styles/user";
import { SysUser } from "../../types/user";

interface IProps {
    open: boolean
    onClose: () => void
}

const CreateUserModalComponent: React.FC<IProps> = (props: IProps) => {

    const options = [
        {
            label: <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<GithubOutlined />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GitHub </>,
            value: 1
        },
        {
            label: <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<GitlabOutlined />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Gitee </>,
            value: 2
        }
    ];

    const [form] = Form.useForm();

    useEffect(() => {
        if (props.open) {
            form.resetFields();
        }
    }, [props.open]) // eslint-disable-line

    const handleOk = () => {
        let data: SysUser = form.getFieldsValue();

        invoke<SysUser>('add_user_info', { data }).then(() => {
            props.onClose();
        })
    }

    const validateConfirmPassword = (_: RuleObject, value: StoreValue) => {
        let newPassword: string = form.getFieldValue("password")
        if (newPassword !== value.toString()) {
            return Promise.reject(new Error('两次输入的密码不相同!'));
        }

        return Promise.resolve();
    }

    return (
        <CreateUserModalContainer>
            <Modal
                title={`配置数据`}
                open={props.open}
                onCancel={() => props.onClose()}
                onOk={() => form.submit()}
                getContainer={false}
                width={700}
                centered
                bodyStyle={{
                    marginTop: '2vh',
                }}
            >

                <Form
                    name="save-user-form"
                    form={form}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    labelAlign="right"
                    onFinish={() => handleOk()}
                    autoComplete="off"

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

                    <Form.Item
                        label="设置密码"
                        name="password"
                        rules={[
                            { required: true, message: '请输入密码!' },
                            { min: 8, message: "密码长度最小8位" },
                            { max: 18, message: "密码长度最大18位" },
                        ]}
                    >
                        <Input allowClear placeholder="请输入密码" />
                    </Form.Item>

                    <Form.Item
                        label="重复密码"
                        name="confirmPassword"
                        rules={[
                            { required: true, message: '请输入密码!' },
                            { min: 8, message: "密码长度最小8位" },
                            { max: 18, message: "密码长度最大18位" },
                            { validator: validateConfirmPassword },
                        ]}
                    >
                        <Input allowClear placeholder="请输入密码" />
                    </Form.Item>
                </Form>
            </Modal>
        </CreateUserModalContainer>
    );
}

export default CreateUserModalComponent;