import React, { useEffect, useState } from 'react';
import {
    SyncOutlined,
    FolderOutlined,
    FileTextOutlined,
    EyeOutlined,
    FormOutlined,
    FolderAddOutlined,
    SettingOutlined,
    InsertRowAboveOutlined,
    ExclamationOutlined,
} from '@ant-design/icons';
import { Button, Layout, Space, Breadcrumb } from 'antd';
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { shallowEqual } from "react-redux";
import CryptoJS from 'crypto-js';

import { Outlet } from 'react-router';

import { invoke } from '@tauri-apps/api/tauri';

import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
    setMarkDownEditorHierarchyAndParentId,
    setMarkDownEditorHierarchyAndSubfieldAndState,
    setMarkDownEditorState,
    setMarkDownEditorSubfield
} from '@/redux/slice/editor';
import { LogoContainer, LayoutContent, LayoutOperation } from '@/styles/layout';
import { RootState } from '@/redux/store';
import { MarkDownEditorState } from '@/types/editor';
import { BreadcrumbItemState, BreadcrumbOption } from '@/types/global';
import { message, modal } from '@/components/Antd/EscapeAntd';
import LayoutMenuComponent from '@/components/Layout/LayoutMenuComponent';
import LayoutSettingModalComponent from '@/components/Layout/LayoutSettingModalComponent';
import { MenuItem, MenuItemType } from '@/types/menu';
import { mergeLocalAndCacheMenu } from '@/utils/MenuUtil';
import { SysUser } from '@/types/user';
import { setSystemMenuReload } from '@/redux/slice/system';
import { SystemState } from '@/types/system';

const { Sider } = Layout;

const App: React.FC = () => {

    const dispatch = useAppDispatch();

    const editorState: MarkDownEditorState = useAppSelector((state: RootState) => ({ ...state.editor }), shallowEqual);
    const breadcrumbState: BreadcrumbItemState = useAppSelector((state: RootState) => ({ ...state.breadcrumb }), shallowEqual);
    const systemState: SystemState = useAppSelector((state: RootState) => ({ ...state.system }), shallowEqual);

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
        // 这里要处理成对应层级的值
        dispatch(setMarkDownEditorHierarchyAndSubfieldAndState({ hierarchy: 1, subfield: true, state: 3 }));
    }

    // 打开模板库
    const editMarkDownTemplate = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation();
    }

    const newPage = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        dispatch(setMarkDownEditorHierarchyAndParentId({ hierarchy: 1, parentId: "0" }))
        createMarkDownEditor();

        e.stopPropagation();
    }

    const syncMenuAction = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        let user_info_str = localStorage.getItem("user_info");
        let sysUser: SysUser = JSON.parse(user_info_str!);

        invoke<MenuItem[][]>('menu_sync_first', { data: sysUser })
            .then((res: any[]) => {
                let localMenu: MenuItemType[] = res[0];
                let cacheMenu: MenuItemType[] = res[1];

                let sha: string = res[2];

                if (res[1].length > 0) { // 有调整的数据的时候,则提示合并
                    modal.confirm({
                        icon: <ExclamationOutlined />,
                        title: `特别提醒！！！`,
                        content: `同步之前需要合并数据，是否确认同步全部数据？`,
                        centered: true,
                        onOk() {
                            let tempMenu: MenuItemType[] = mergeLocalAndCacheMenu(localMenu, cacheMenu);

                            let json_str = JSON.stringify(tempMenu);

                            var str = CryptoJS.enc.Utf8.parse(json_str);
                            let encode = CryptoJS.enc.Base64.stringify(str);

                            invoke('menu_sync_push', { sha, user: sysUser, data: encode })
                                .then(() => {
                                    message.success("同步成功")
                                })
                                .catch(() => {
                                    message.error("同步删除")
                                })
                        },
                        onCancel() {
                            console.log('Cancel');
                        },
                    });
                } else {
                    message.success("同步成功")
                }

                dispatch(setSystemMenuReload(!systemState.menu_reload));
            })
            .catch((e) => {
                console.log(e);
                message.error("获取本地数据异常,请检查错误")
            })
        e.stopPropagation();
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
                        icon={<FolderAddOutlined twoToneColor={'#989793'} />}
                        type='text'
                        onClick={(e) => {
                            newPage(e);
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
                        onClick={(e) => syncMenuAction(e)}
                    >
                        <Space className='new-page'>
                            Sync Database
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

                            {
                                !editorState.subfield ? (
                                    <Button
                                        icon={<FormOutlined />}
                                        size='small'
                                        type='text'
                                        title='编辑'
                                        onClick={(e) => {
                                            editMarkDownEditor(true);
                                            dispatch(setMarkDownEditorState(2));
                                            e.stopPropagation();
                                        }}
                                    />
                                ) : null
                            }

                            {
                                editorState.subfield ? (
                                    <Button
                                        icon={<EyeOutlined />}
                                        size='small'
                                        type='text'
                                        title='预览'
                                        onClick={() => editMarkDownEditor(false)}
                                    />
                                ) : null
                            }

                            {
                                editorState.subfield ? (
                                    <Button
                                        icon={<InsertRowAboveOutlined />}
                                        size='small'
                                        type='text'
                                        title='模板'
                                        onClick={(e) => editMarkDownTemplate(e)}
                                    />
                                ) : null
                            }

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