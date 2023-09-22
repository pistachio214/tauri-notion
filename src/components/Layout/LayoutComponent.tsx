import React from 'react';
import {
    FolderOutlined,
    EyeOutlined,
    EditOutlined,
    PlusCircleOutlined,
    SettingOutlined,
    PlusOutlined,
    FolderOpenOutlined,
    FileTextOutlined,
    OrderedListOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Layout, Menu, Dropdown, Space } from 'antd';
import { shallowEqual } from "react-redux";

import { Outlet } from 'react-router';

import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { setMarkDownEditorState, setMarkDownEditorSubfield } from '../../redux/slice/editor';

import { LogoContainer, LayoutContent, LayoutOperation } from '../../styles/layout';
import { RootState } from '../../redux/store';
import { MarkDownEditorState } from '../../types/editor';
import LayoutMenuComponent from './LayoutMenuComponent';

const { Sider } = Layout;

// const menuItems: MenuProps['items'] = [
//     {
//         key: String(1),
//         icon: <FolderOutlined />,
//         label: `技术贴`,
//         children: [
//             {
//                 key: `1-1`,
//                 icon: <OrderedListOutlined />,
//                 label: `Rust权威指南`,
//                 children: [
//                     {
//                         key: `1-1-1`,
//                         icon: <FileTextOutlined />,
//                         label: `将值传递后触发移动或复制问题`,
//                     }

//                 ]
//             },
//             {
//                 key: `1-2`,
//                 icon: <OrderedListOutlined />,
//                 label: `Lunix`,
//                 children: [
//                     {
//                         key: `1-2-1`,
//                         icon: <FileTextOutlined />,
//                         label: `1. 链接服务器`,
//                     },
//                     {
//                         key: `1-2-2`,
//                         icon: <FileTextOutlined />,
//                         label: `2. 简单命令行`,
//                     },
//                     {
//                         key: `1-2-3`,
//                         icon: <FileTextOutlined />,
//                         label: `2. 删除文件`,
//                     },
//                     {
//                         key: `1-2-4`,
//                         icon: <FileTextOutlined />,
//                         label: `2. 删除文件`,
//                     },
//                 ]
//             }
//         ]
//     }


// ];

const App: React.FC = () => {

    const dispatch = useAppDispatch();
    const editorState: MarkDownEditorState = useAppSelector((state: RootState) => ({ ...state.editor }), shallowEqual);

    const dropdownItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <>退出</>
            )
        }
    ];

    const editMarkDownEditor = (type: boolean) => {
        if (type) {
            dispatch(setMarkDownEditorState(2));
        } else {
            dispatch(setMarkDownEditorState(1));
        }
        dispatch(setMarkDownEditorSubfield(type));
    }

    const createMarkDownEditor = () => {
        dispatch(setMarkDownEditorSubfield(true));
        dispatch(setMarkDownEditorState(3));
    }

    const onClick: MenuProps['onClick'] = (e) => {
        console.log(e.key);
    };

    const onSelect: MenuProps['onSelect'] = (e) => {
        console.log(e.key);
    };

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
                    background: '#F7F7F5'
                }}
            >
                <LogoContainer>
                    <Dropdown
                        className='dropdown'
                        placement={'bottomRight'}
                        menu={{
                            items: dropdownItems,
                            onClick: (e: { key: string }) => console.log(e)
                        }}
                        trigger={['click']}
                        overlayStyle={{
                            width: '100px',
                            background: '#FBFAF9'
                        }}
                    >
                        <Button
                            type='text'
                            onClick={(e) => e.preventDefault()}
                        >
                            <div className={'logo-notion'}>N</div>
                            <Space className='username'>
                                Roger's Notion <SettingOutlined />
                            </Space>
                        </Button>
                    </Dropdown>

                    <Button
                        className='operitem-botton'
                        icon={<PlusCircleOutlined twoToneColor={'#989793'} />}
                        type='text'
                        onClick={(e) => e.preventDefault()}
                    >
                        <Space className='new-page'>
                            New page
                        </Space>
                    </Button>
                </LogoContainer>

                <LayoutMenuComponent />

                {/* <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={[]}
                    expandIcon={(props) => {
                        if (props.isOpen) {
                            return <FolderOpenOutlined />;
                        } else {
                            return (
                                <FolderOutlined />
                            )
                        }
                    }}
                    // items={items}
                    items={menuItems}
                    style={{
                        background: '#F7F7F5',
                        width: 300,
                        borderRight: 'none',
                    }}
                    onClick={onClick}
                    onSelect={onSelect}
                /> */}

            </Sider>
            <Layout className="site-layout" style={{ marginLeft: 300, height: '100%' }}>

                <LayoutOperation>
                    <div className='layout-operation-container'>
                        <Button
                            icon={<PlusOutlined />}
                            size='small'
                            type='text'
                            title='new tab Ctrl+T'
                            onClick={() => createMarkDownEditor()}
                        />

                        {
                            !editorState.subfield ? (
                                <Button
                                    icon={<EditOutlined />}
                                    size='small'
                                    type='text'
                                    title='edit tab Ctrl+E'
                                    onClick={() => editMarkDownEditor(true)}
                                />
                            ) : null
                        }

                        {
                            editorState.subfield ? (
                                <Button
                                    icon={<EyeOutlined />}
                                    size='small'
                                    type='text'
                                    title='edit tab Ctrl+E'
                                    onClick={() => editMarkDownEditor(false)}
                                />
                            ) : null
                        }

                        <Button
                            icon={<FolderOpenOutlined />}
                            size='small'
                            type='text'
                            title='new tab Ctrl+T'
                        >
                            圆月弯刀
                        </Button>
                        /
                        <Button
                            icon={<FileTextOutlined />}
                            size='small'
                            type='text'
                        >
                            小楼一夜听春雨
                        </Button>
                    </div>
                </LayoutOperation>

                <LayoutContent>
                    <Outlet />
                </LayoutContent>
            </Layout>
        </Layout>
    );
};

export default App;