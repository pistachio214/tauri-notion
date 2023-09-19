import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Form, Input, Select } from "antd";
import type { SelectProps } from 'antd';
import {
    EyeInvisibleOutlined,
    EyeTwoTone,
    LockOutlined,
    GithubOutlined,
} from "@ant-design/icons";

import { invoke } from '@tauri-apps/api/tauri'

import { message } from "../../components/Antd/EscapeAntd";
import {
    LoginContainer,
    LoginBg,
    LoginImage,
    LoginBox,
    Title,
    IconBox,
    LoginButton,
    UsernameButton,
} from "./style";
import login_img from "../../assets/login_img.png";
import react_icon from "../../assets/react.svg";
import defaultSettings from "./../../defaultSettings";
import CreateUserModalComponent from "../../components/User/CreateUserModalComponent";
import { getName } from "@tauri-apps/api/app";

interface FormState {
    username: string;
    password: string;
    remember?: boolean;
    code: string
}

const Login: React.FC = () => {

    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();
    }, [])  //eslint-disable-line

    //表单数据
    const [form] = Form.useForm<FormState>();

    const [openAddUserModal, setOpenAddUserModal] = useState<boolean>(false);

    const options: SelectProps['options'] = [
        {
            label: <><GithubOutlined /> ( GitHub ) / RogerPeng123 / my-notion</>,
            value: 1
        },
        {
            label: <>( Gitee ) / flayingoranges / test-git</>,
            value: 2
        }
    ];


    const testRust = () => {
        console.log('这里去调用rust代码')
        getName().then(res => {
            let appName = res.replace(/\s+/g, "");
            
            invoke<string>('generate_json', { appName: appName }).then(() => {
                console.log('success')
            })
        });
    }

    const rememberChecked = !localStorage.getItem("rememberme");

    const onFinish = () => {
        form.validateFields().then(async () => {
            const data: FormState = form.getFieldsValue();
            console.log(data)

            sessionStorage.setItem("token", "萧十一郎");

            message.success('🎉🎉🎉 登录成功', 1);
            navigate('/dashboard');
        })
    }

    return (
        <LoginContainer>
            <LoginBg primary={defaultSettings.token.colorPrimary} deepr={defaultSettings.deepColor} />
            <LoginImage src={login_img} width={600} height={"auto"}></LoginImage>
            <LoginBox>
                <Title>
                    <IconBox src={react_icon}></IconBox>{defaultSettings.title}
                </Title>
                <div className={'title-description'}>{defaultSettings.titleDescription}</div>

                <Form
                    name="select_rule"
                    form={form}
                    initialValues={{ remember: rememberChecked }}
                    onFinish={onFinish}
                >

                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: "请输入账号" }]}
                    >
                        <Select
                            placeholder={'请选择您的用户'}
                            options={options}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: "请输入密码" }]}
                    >
                        <Input.Password
                            allowClear
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="密码(password)"
                            iconRender={(visible) =>
                                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                            }
                        />
                    </Form.Item>

                    <Form.Item>
                        <LoginButton type="primary" htmlType="submit">
                            登录
                        </LoginButton>
                    </Form.Item>

                    <Form.Item>
                        <UsernameButton
                            type="dashed"
                            onClick={() => setOpenAddUserModal(true)}
                        >
                            添加账号
                        </UsernameButton>
                    </Form.Item>

                    <Form.Item>
                        <UsernameButton
                            type="dashed"
                            onClick={() => testRust()}
                        >
                            测试按钮
                        </UsernameButton>
                    </Form.Item>
                </Form>

            </LoginBox>

            <CreateUserModalComponent
                open={openAddUserModal}
                onClose={() => setOpenAddUserModal(false)}
            />
        </LoginContainer>
    )
}

export default Login;