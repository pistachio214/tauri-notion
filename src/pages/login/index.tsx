import React, { useEffect } from "react";
import { useNavigate } from "react-router";

import { Checkbox, Form, Input } from "antd";
import {
    EyeInvisibleOutlined,
    EyeTwoTone,
    LockOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { message } from "../../components/Antd/EscapeAntd";

import {
    LoginContainer,
    LoginBg,
    LoginImage,
    LoginBox,
    Title,
    IconBox,
    LoginButton,
} from "./style";

import login_img from "../../assets/login_img.png";
import react_icon from "../../assets/react.svg";
import defaultSettings from "./../../defaultSettings";

interface FormState {
    username: string;
    password: string;
    remember: boolean;
    code: string
}

const Login: React.FC = () => {

    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();
    }, [])  //eslint-disable-line

    //表单数据
    const [form] = Form.useForm<FormState>();

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
                    name="dynamic_rule"
                    form={form}
                    initialValues={{ remember: rememberChecked }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: "请输入账号" }]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="账号(username)"
                            allowClear
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
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>记住我</Checkbox>
                        </Form.Item>
                    </Form.Item>

                    <Form.Item>
                        <LoginButton type="primary" htmlType="submit">
                            登录
                        </LoginButton>
                    </Form.Item>
                </Form>
            </LoginBox>
        </LoginContainer>
    )
}

export default Login;