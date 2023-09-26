import React, { useEffect, useState } from 'react';
import {
    FolderOutlined,
    FileTextOutlined,
    EyeOutlined,
    EditOutlined,
    PlusCircleOutlined,
    SettingOutlined,
    PlusOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Layout, Dropdown, Space, Breadcrumb } from 'antd';
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { shallowEqual } from "react-redux";

import { Outlet } from 'react-router';

import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { setMarkDownEditorState, setMarkDownEditorSubfield } from '../../redux/slice/editor';

import { LogoContainer, LayoutContent, LayoutOperation } from '../../styles/layout';
import { RootState } from '../../redux/store';
import { MarkDownEditorState } from '../../types/editor';
import LayoutMenuComponent from './LayoutMenuComponent';
import { BreadcrumbItemState, BreadcrumbOption } from '../../types/global';


const { Sider } = Layout;

const App: React.FC = () => {

    const dropdownItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <>退出</>
            )
        }
    ];


    const dispatch = useAppDispatch();

    const editorState: MarkDownEditorState = useAppSelector((state: RootState) => ({ ...state.editor }), shallowEqual);
    const breadcrumbState: BreadcrumbItemState = useAppSelector((state: RootState) => ({ ...state.breadcrumb }), shallowEqual);

    const [breadcrumbItems, setBreadcrumbItems] = useState<ItemType[]>([]);


    useEffect(() => {
        // 初始化面包屑
        setBreadcrumbItems([]);
    }, [])

    useEffect(() => {
        const { items } = breadcrumbState;

        let option: ItemType[] = [];
        items.forEach((item: BreadcrumbOption) => {
            let itemType: ItemType = {
                title: (
                    <Button
                        icon={item.isChildren ? <FolderOutlined /> : <FileTextOutlined />}
                        size='small'
                        type='text'
                    >
                        {item.label}
                    </Button>
                )
            }

            option.push(itemType);
        })

        setBreadcrumbItems(option);

    }, [breadcrumbState.items])

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

    const editMarkDownDelete = () => { }

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
                        // placement={'bottomRight'}
                        menu={{
                            items: dropdownItems,
                            onClick: (e: { key: string }) => console.log(e)
                        }}
                        trigger={['click']}
                        overlayStyle={{
                            // width: '100px',
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
                            icon={<DeleteOutlined />}
                            size='small'
                            type='text'
                            danger
                            title='删除'
                            onClick={() => editMarkDownDelete()}
                        />

                        <Breadcrumb
                            items={breadcrumbItems}
                        />

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