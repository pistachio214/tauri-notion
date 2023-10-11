import React, { useEffect, useState } from "react";

import { Button, Dropdown, Modal } from "antd";
import type { MenuProps } from 'antd';
import {
    FolderOutlined,
    FileTextOutlined,
    FolderOpenOutlined,
    PlusOutlined,
    // EditOutlined,
    DeleteOutlined,
    EllipsisOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { shallowEqual } from "react-redux";

import { invoke } from '@tauri-apps/api/tauri';

import { LayoutMenuContainer } from "@/styles/layout";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { BreadcrumbOption } from "@/types/global";
import { setBreadcrumbItems } from "@/redux/slice/breadcrumb";
import { message } from "@/components/Antd/EscapeAntd";
import {
    setMarkDownEditorChildrenKey,
    setMarkDownEditorContentAndStateAndSubfield,
    setMarkDownEditorHierarchyAndParentId,
    setMarkDownEditorHierarchyAndSubfieldAndState
} from "@/redux/slice/editor";
import { MenuItem, MenuItemType } from "@/types/menu";
import { buildBreadcrumb, buildMenuItemReload, mergeLocalAndCacheMenu } from "@/utils/MenuUtil";
import { RootState } from "@/redux/store";
import { SystemState } from "@/types/system";
import { MarkDownEditorState } from "@/types/editor";
import { setSystemMenuReload, setSystemMenuSelectKey } from "@/redux/slice/system";

const { confirm } = Modal;

const items: MenuProps['items'] = [
    // {
    //     label: <div style={{}}>
    //         <Button
    //             icon={<EditOutlined />}
    //             type="link"
    //             size="small"
    //         >
    //             重命名
    //         </Button>
    //     </div>,
    //     key: 'Renaming',
    // },
    // {
    //     type: 'divider',
    // },
    {
        label: <>
            <Button
                icon={<DeleteOutlined />}
                type="link"
                size="small"
                danger
            >
                删除
            </Button>
        </>,
        key: 'Delete',
    },
];

const LayoutMenuComponent: React.FC = () => {

    const dispatch = useAppDispatch();

    const systemState: SystemState = useAppSelector((state: RootState) => ({ ...state.system }), shallowEqual);
    const editorState: MarkDownEditorState = useAppSelector((state: RootState) => ({ ...state.editor }), shallowEqual);

    const [menuDataArray, setMenuDataArray] = useState<MenuItemType[]>([]);
    const [menuArray, setMenuArray] = useState<MenuItemType[]>([]);
    const [menu, setMenu] = useState<MenuItemType>();

    useEffect(() => {
        getLocalhostMenuList();
    }, [systemState.menu_reload])

    useEffect(() => {
        setMenuArray(buildItem(menuDataArray));

    }, [menuDataArray])

    const getLocalhostMenuList = () => {

        invoke<MenuItem[][]>('menu_list')
            .then(res => {
                let localMenu: MenuItemType[] = [];
                res[0].forEach((item: MenuItem) => {
                    localMenu.push({
                        id: item.id,
                        type: item.type,
                        label: item.label,
                        open: false,
                        parent_id: item.parent_id,
                        content: item.content,
                    })
                })

                let cacheMenu: MenuItemType[] = [];
                res[1].forEach((item: MenuItem) => {
                    cacheMenu.push({
                        id: item.id,
                        type: item.type,
                        label: item.label,
                        open: false,
                        parent_id: item.parent_id,
                        content: item.content,
                    })
                })

                buildMenuItem(localMenu, cacheMenu);
            })
            .catch(err => message.error(err));

    }

    const buildMenuItem = (localMenu: MenuItemType[], cacheMenu: MenuItemType[]) => {
        let tempMenu: MenuItemType[] = mergeLocalAndCacheMenu(localMenu, cacheMenu);
        tempMenu = buildChildren(tempMenu);

        buildMenuItemReload(editorState.childrenKey, tempMenu);
        setMenuDataArray(tempMenu);
    }


    const buildChildren = (data: MenuItemType[], parentId: string = '0') => {
        let children: MenuItemType[] = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].parent_id === parentId) {
                const childrenData = buildChildren(data, data[i].id);
                if (childrenData.length) {
                    data[i].children = childrenData;
                }
                children.push(data[i]);
            }
        }

        return children;
    }

    const buildItem = (data: MenuItemType[]) => {
        let res: MenuItemType[] = [];
        data.forEach((item: MenuItemType) => {
            let db: MenuItemType = {
                id: item.id,
                label: item.label,
                type: item.type,
                open: item.open,
            };

            if (item.open && item.children != undefined && item.children.length > 0) {
                db.icon = <FolderOpenOutlined className="icon-style" onClick={(e) => clickMenu(item.id, e)} />
                res.push(db);

                res = [...res, ...buildItem(item.children)];
            } else {
                if (item.type === 1 || item.children != undefined && item.children.length > 0) {
                    db.icon = <FolderOutlined className="icon-style" onClick={(e) => clickMenu(item.id, e)} />
                } else {
                    db.icon = <FileTextOutlined className="icon-style" onClick={(e) => clickMenu(item.id, e)} />
                }
                res.push(db);
            }
        })

        return res;
    }

    // 判断两个number[]是否相等
    function arraysAreEqual(arr1: number[], arr2: number[]): boolean {
        return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
    }

    const findIndexById = (arr: MenuItemType[], targetId: string, targetArr: number[]): any => {
        let result: number[] = targetArr;

        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id === targetId) {
                result = [...targetArr, i];
                break;
            } else {
                if (arr[i].children !== undefined && arr[i].children !== null && arr[i].children!.length > 0) {
                    let tempKey = [...result, i];
                    let findIndex = findIndexById(arr[i].children!, targetId, tempKey);
                    if (findIndex.length > 0 && !arraysAreEqual(findIndex, tempKey)) {
                        result = findIndex;
                    }
                }
            }
        }

        return result;
    }

    const getMenu = (ids: number[], data: MenuItemType[]): MenuItemType[] => {
        const newData = [...data]; // 创建一个副本以保留原始数据的不可变性
        let current = newData;
        let current_menu;

        for (const index of ids) {
            if (current[index] && current[index].children) {
                current_menu = current[index];
                current = current[index].children!;
            } else {
                return newData; // 如果索引无效，则返回原始数据
            }
        }

        if (current_menu) {
            current_menu.open = !current_menu?.open;
        }

        return newData; // 返回整个被修改的数据副本
    }

    const clickMenu = (id: string, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        let ids = findIndexById(menuDataArray, id, []);

        let menu: MenuItemType | undefined = undefined;

        let tempMenuArray = [...menuDataArray];
        if (ids.length === 1) {
            menu = menuDataArray[ids[0]];
            menu.open = !menu.open;

            tempMenuArray[ids[0]] = menu;
            setMenuDataArray(tempMenuArray);
        } else {
            tempMenuArray = getMenu(ids, menuDataArray);

            if (tempMenuArray !== undefined) {
                setMenuDataArray(tempMenuArray);
            }
        }

        e.stopPropagation();
    }

    const clickMenuTitle = (menu: MenuItemType) => {
        let ids = findIndexById(menuDataArray, menu.id, []);
        let breadcrumb: BreadcrumbOption[] = buildBreadcrumb(ids, menuDataArray); // 构建面包屑数据
        if (breadcrumb.length > 0) {
            let type = 1;
            let menu: MenuItemType | undefined = undefined;
            let tempMenuArray = [...menuDataArray];
            if (ids.length === 1) {
                menu = menuDataArray[ids[0]];

                type = menu.type + 1;
            } else {
                tempMenuArray = getMenu(ids, menuDataArray);

                if (tempMenuArray !== undefined) {
                    let lastMenu = tempMenuArray[tempMenuArray.length - 1];

                    type = lastMenu.type + 1;
                }
            }
            dispatch(setMarkDownEditorHierarchyAndParentId({ hierarchy: type, parentId: breadcrumb[breadcrumb.length - 1].id }));

            dispatch(setMarkDownEditorContentAndStateAndSubfield({ content: breadcrumb[breadcrumb.length - 1].content, state: 2, subfield: false }));
            dispatch(setMarkDownEditorChildrenKey(ids));
            dispatch(setBreadcrumbItems(breadcrumb));
        }

        dispatch(setSystemMenuSelectKey(menu.id));
    }

    const clickMenuAdd = (menu: MenuItemType, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        let ids = findIndexById(menuDataArray, menu.id, []);

        dispatch(setMarkDownEditorChildrenKey(ids));
        dispatch(setMarkDownEditorHierarchyAndSubfieldAndState({ hierarchy: (menu.type + 1), subfield: true, state: 3 }));

        dispatch(setSystemMenuSelectKey(menu.id));

        e.stopPropagation();
    }

    const renamingAction = () => { }

    const deleteAction = () => {
        let id = menu?.id;

        invoke<MenuItemType>("menu_find", { id })
            .then((res) => {
                confirm({
                    icon: <ExclamationCircleOutlined />,
                    content: `是否确定删除 【 ${res.label} 】 ？`,
                    centered: true,
                    onOk() {
                        invoke("menu_delete", { id }).then(() => {
                            message.success("删除成功");
                            dispatch(setSystemMenuReload(!systemState.menu_reload))
                            // 删除成功 干掉面包屑、编辑器内容、选中的key
                            dispatch(setBreadcrumbItems([]));
                            dispatch(setMarkDownEditorContentAndStateAndSubfield({ content: "", state: 1, subfield: false }));

                        }).catch(() => {
                            message.error("错误删除")
                        })
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            })
            .catch(err => { message.error(err) })


    }

    const dropdownOnClick: MenuProps['onClick'] = ({ key, domEvent }) => {
        switch (key) {
            case "Renaming":
                renamingAction();
                break;
            case "Delete":
                deleteAction();
                break;
            default:
                message.error("错误点击");
        }

        domEvent.stopPropagation();
    };

    return (
        <LayoutMenuContainer>
            <dl className="menu-item-container">
                {
                    menuArray.map((item: MenuItemType, index: number) => {
                        return (
                            <dt
                                key={`${index}-menu-item`}
                                className={`menu-item-title ${item.id == systemState.menu_select_key ? 'active' : ''}`}
                                style={{
                                    paddingLeft: `${item.type * 2}vh`
                                }}
                                onClick={() => clickMenuTitle(item)}
                            >
                                <div className="item-title">
                                    {item.icon} <span className="title" >{item.label}</span>
                                </div>

                                <div className="menu-action-container">
                                    <div className="action-item">
                                        <Dropdown
                                            menu={{ items, onClick: dropdownOnClick }}
                                            trigger={['click']}
                                            overlayClassName="action-dropdown"
                                            placement={'bottomLeft'}
                                            overlayStyle={{
                                                padding: 0,
                                                margin: 0,
                                            }}

                                        >
                                            <Button
                                                className="icon-style"
                                                icon={<EllipsisOutlined />}
                                                type="text"
                                                size='small'
                                                onClick={(e) => { setMenu(item); e.stopPropagation(); }}
                                            />
                                        </Dropdown>

                                        <Button
                                            className="icon-style"
                                            icon={<PlusOutlined />}
                                            type="text"
                                            size='small'
                                            onClick={(e) => clickMenuAdd(item, e)}
                                        />
                                    </div>
                                </div>

                            </dt>
                        )
                    })
                }
            </dl>

        </LayoutMenuContainer >
    )

}

export default LayoutMenuComponent;