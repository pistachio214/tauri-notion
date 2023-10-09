import React, { useEffect, useState } from 'react';
import {
    SyncOutlined,
    FolderOutlined,
    FileTextOutlined,
    EyeOutlined,
    EditOutlined,
    PlusCircleOutlined,
    SettingOutlined,
    PlusOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { Button, Layout, Space, Breadcrumb } from 'antd';
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { shallowEqual } from "react-redux";

import { Outlet } from 'react-router';

import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { setMarkDownEditorChildrenKey, setMarkDownEditorHierarchy, setMarkDownEditorHierarchyAndParentId, setMarkDownEditorHierarchyAndSubfieldAndState, setMarkDownEditorState, setMarkDownEditorSubfield } from '../../redux/slice/editor';

import { LogoContainer, LayoutContent, LayoutOperation } from '../../styles/layout';
import { RootState } from '../../redux/store';
import { MarkDownEditorState } from '../../types/editor';
import { BreadcrumbItemState, BreadcrumbOption } from '../../types/global';
import { getMenuList } from '../../api/gitee';
import { GiteeFileContentRequest, GiteeFileContentResponse } from '../../types/gitee';
import { AxiosResponse } from 'axios';
import { message } from '../Antd/EscapeAntd';
import LayoutMenuComponent from './LayoutMenuComponent';
import LayoutSettingModalComponent from './LayoutSettingModalComponent';


const { Sider } = Layout;

const App: React.FC = () => {

    const dispatch = useAppDispatch();

    const editorState: MarkDownEditorState = useAppSelector((state: RootState) => ({ ...state.editor }), shallowEqual);
    const breadcrumbState: BreadcrumbItemState = useAppSelector((state: RootState) => ({ ...state.breadcrumb }), shallowEqual);

    const [breadcrumbItems, setBreadcrumbItems] = useState<ItemType[]>([]);
    const [settingModal, setSettingModal] = useState<boolean>(false);

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
        //TODO 这里要处理成对应层级的值
        dispatch(setMarkDownEditorHierarchyAndSubfieldAndState({ hierarchy: 1, subfield: true, state: 3 }));
    }

    const editMarkDownDelete = () => { }

    const newPage = () => {
        dispatch(setMarkDownEditorHierarchyAndParentId({ hierarchy: 1, parentId: "0" }))
        createMarkDownEditor();
    }

    const syncMenuAction = () => {
        let data: GiteeFileContentRequest = {
            access_token: '04fe3dabb3769ded506d8122891a04fa',
            ref: 'master',
            owner: 'flayingoranges',
            repo: "test-git",
            path: 'menu.php'
        };

        getMenuList(data).then((res: AxiosResponse<GiteeFileContentResponse | []>) => {
            console.log(res.data);
            const { data } = res;

            if (Array.isArray(data)) {
                message.error("结果为空数组,数据不合法");
            }

            // console.log(typeof data);
        })
    }

    return (
        <Layout
            hasSider
            style={{
                height: '100vh'
            }}
        >
            <Sider
                width={300}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    background: '#F7F7F5',
                }}
            >
                <LogoContainer>

                    <Button
                        className='operitem-botton dropdown'
                        type='text'
                        onClick={(_) => setSettingModal(true)}
                    >
                        <div className={'logo-notion'}>N</div>
                        <Space className='username'>
                            Roger's Notion <SettingOutlined />
                        </Space>
                    </Button>

                    <Button
                        className='operitem-botton'
                        icon={<PlusCircleOutlined twoToneColor={'#989793'} />}
                        type='text'
                        onClick={(e) => {
                            // e.preventDefault();
                            newPage();
                        }}
                    >
                        <Space className='new-page'>
                            New page
                        </Space>
                    </Button>

                    <Button
                        className='operitem-botton'
                        icon={<SyncOutlined twoToneColor={'#989793'} />}
                        type='text'
                        onClick={(_) => syncMenuAction()}
                    >
                        <Space className='new-page'>
                            Sync Menu
                        </Space>
                    </Button>
                </LogoContainer>

                <LayoutMenuComponent />

            </Sider>
            <Layout
                className="site-layout"
                style={{
                    marginLeft: 300,
                    height: '100%',
                }}
            >
                <LayoutContent>
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
                    <div style={{
                        paddingTop: '45px',
                        width: '100%',
                        height: '100%',
                    }}>
                        <Outlet />
                    </div>
                </LayoutContent>

                <LayoutSettingModalComponent
                    open={settingModal}
                    close={() => setSettingModal(false)}
                />
            </Layout>
        </Layout>
    );
};

export default App;