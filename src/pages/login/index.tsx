import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Form, Input, Select } from "antd";
import type { SelectProps } from 'antd';
import {
    EyeInvisibleOutlined,
    EyeTwoTone,
    LockOutlined,
    GithubOutlined,
    GitlabFilled,
} from "@ant-design/icons";
import { AxiosResponse } from "axios";

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
import { SysUser } from "../../types/user";
import { GiteeErrorResponse, GiteeFileContentRequest, GiteeFileContentResponse } from "../../types/gitee";
import { getMenuList } from "../../api/gitee";

interface MenuItemType {
    id: string
    type: number
    label: string
    open: boolean
    icon?: React.ReactNode
    children?: MenuItemType[]
}

const data: MenuItemType[] = [
    {
        id: "1",
        type: 1,
        label: "圆月弯刀",
        open: false,
        children: [
            {
                id: '1-1',
                type: 2,
                label: "小楼一夜听春雨",
                open: false,
                children: [
                    {
                        id: '1-1-1',
                        type: 3,
                        label: "第1场春雨",
                        open: false,
                        children: [
                            {
                                id: '1-1-1-1',
                                type: 4,
                                label: "测试更多的目录",
                                open: false,
                            }
                        ]
                    },
                    {
                        id: '1-1-2',
                        type: 3,
                        label: "第2场春雨",
                        open: false,
                    },
                    {
                        id: '1-1-3',
                        type: 3,
                        label: "第3场春雨",
                        open: false,
                    },
                    {
                        id: '1-1-4',
                        type: 3,
                        label: "第4场春雨",
                        open: false,
                    },
                    {
                        id: '1-1-5',
                        type: 3,
                        label: "第5场春雨",
                        open: false,
                    },
                ]
            },
            {
                id: '1-2',
                type: 2,
                label: "天外流星",
                open: false,
                children: [
                    {
                        id: '1-2-1',
                        type: 3,
                        label: "第1颗流星",
                        open: false,
                    },
                    {
                        id: '1-2-2',
                        type: 3,
                        label: "第2颗流星",
                        open: false,
                    },
                    {
                        id: '1-2-3',
                        type: 3,
                        label: "第3颗流星",
                        open: false,
                    },
                ]
            }
        ]
    },
    {
        id: "2",
        type: 1,
        label: "萧十一郎",
        open: false,
        children: [
            {
                id: '2-1',
                type: 2,
                label: "萧十一郎的红颜",
                open: false,
                children: [
                    {
                        id: '2-1-1',
                        type: 3,
                        label: "沈璧君",
                        open: false,
                    },
                    {
                        id: '2-1-2',
                        type: 3,
                        label: "风四娘",
                        open: false,
                    },
                ]
            },
            {
                id: '2-2',
                type: 2,
                label: "萧十一郎的武器",
                open: false,
                children: [
                    {
                        id: '2-2-1',
                        type: 3,
                        label: "割鹿刀",
                        open: false,
                    },
                ]
            }
        ]
    }
];

interface FormState {
    id: string;
    password: string;
}

const Login: React.FC = () => {

    const navigate = useNavigate();

    //表单数据
    const [form] = Form.useForm<FormState>();

    const [openAddUserModal, setOpenAddUserModal] = useState<boolean>(false);
    const [options, setOptions] = useState<SelectProps['options']>([]);

    useEffect(() => {
        console.log('进来了几次?')
        sessionStorage.clear();
    }, [])  //eslint-disable-line

    useEffect(() => {
        if (!openAddUserModal) {
            invoke<SysUser[]>('get_user_config_list').then((res: SysUser[]) => {
                let option: SelectProps['options'] = [];
                res.forEach((item: SysUser, index: number) => {
                    let label;

                    switch (item.type) {
                        case 1:
                            label = <><GithubOutlined /> ( GitHub ) / {item.owner} / {item.repo}</>
                            break;
                        case 2:
                            label = <><GitlabFilled /> ( Gitee ) / {item.owner} / {item.repo}</>
                            break;
                        default:
                            label = <></>
                    }

                    let val = item.id === null ? `user_list_${index}` : item.id;
                    option?.push({
                        label: label,
                        value: val
                    })
                })
                setOptions(option);
            })
        }
    }, [openAddUserModal]); //eslint-disable-line


    const gitFileContent = () => {
        let data: GiteeFileContentRequest = {
            access_token: '04fe3dabb3769ded506d8122891a04fa',
            ref: 'master',
            owner: "flayingoranges",
            repo: "test-git",
            path: "menu.json"
        };

        getMenuList(data)
            .then((res: AxiosResponse<GiteeFileContentResponse>) => {
                if (res.data.content !== undefined && res.data.size > 0) {
                    console.log(atob(res.data.content));
                }

            })
            .catch((error: AxiosResponse<GiteeErrorResponse>) => {
                console.log(error);
            });
    }

    const testRust = () => {
        console.log('push gitee')
        gitFileContent();
    }

    const onFinish = () => {
        form.validateFields().then(async () => {
            const data: FormState = form.getFieldsValue();

            invoke<SysUser>('user_login', { username: data.id, password: data.password })
                .then(res => {
                    sessionStorage.setItem("token", res.id!);

                    message.success('🎉🎉🎉 登录成功', 1);
                    navigate('/dashboard');
                })
                .catch(err => message.error(err))
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
                    onFinish={onFinish}
                >

                    <Form.Item
                        name="id"
                        rules={[{ required: true, message: "请选择您的用户" }]}
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