import React from "react";
import { RuleObject, StoreValue } from "rc-field-form/lib/interface";
import { Button, Form, Input } from "antd";
import {
    WarningOutlined,
} from "@ant-design/icons";

import { invoke } from '@tauri-apps/api';

import { message, modal } from '@/components/Antd/EscapeAntd';
import { UserSettingContainer } from "@/styles/user";
import { SysUser } from "@/types/user";

const LayoutUserChangePasswordComponent: React.FC = () => {

    const [form] = Form.useForm();

    const validateConfirmPassword = (_: RuleObject, value: StoreValue) => {
        let newPassword: string = form.getFieldValue("password")
        if (newPassword !== value.toString()) {
            return Promise.reject(new Error('两次输入的密码不相同!'));
        }

        return Promise.resolve();
    }

    const handleOk = () => {

        modal.confirm({
            icon: <WarningOutlined />,
            title: `提示！`,
            content: `确定修改用户密码?`,
            centered: true,
            onOk() {
                let user_json = localStorage.getItem("user_info");
                let sysUser: SysUser = JSON.parse(user_json!);

                const { id } = sysUser;
                const password = form.getFieldValue("password")

                invoke<SysUser>("change_user_password", { id, password })
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
                name="change-password-form"
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                labelAlign="right"
                onFinish={() => handleOk()}
                autoComplete="off"
                layout="vertical"

            >
                <Form.Item
                    label="设置密码"
                    name="password"
                    rules={[
                        { required: true, message: '请输入密码!' },
                        { min: 8, message: "密码长度最小8位" },
                        { max: 18, message: "密码长度最大18位" },
                    ]}
                >
                    <Input.Password
                        allowClear
                        placeholder="请输入密码"
                    />
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
                    <Input.Password
                        allowClear
                        placeholder="请输入密码"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        onClick={() => form.submit()}
                    >
                        更新密码
                    </Button>
                </Form.Item>
            </Form>
        </UserSettingContainer >
    )
}

export default LayoutUserChangePasswordComponent;