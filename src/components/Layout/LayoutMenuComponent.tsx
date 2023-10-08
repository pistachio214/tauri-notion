import React, { useEffect, useState } from "react";

import { Button, Dropdown } from "antd";
import type { MenuProps } from 'antd';
import {
    FolderOutlined,
    FileTextOutlined,
    FolderOpenOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EllipsisOutlined,
} from '@ant-design/icons';

import { invoke } from '@tauri-apps/api/tauri';

import { LayoutMenuContainer } from "../../styles/layout";
import { useAppDispatch } from "../../redux/hook";
import { BreadcrumbOption } from "../../types/global";
import { setBreadcrumbItems } from "../../redux/slice/breadcrumb";
import { message } from "../Antd/EscapeAntd";

interface MenuItemType {
    id: string
    type: number
    label: string
    open: boolean
    content?: string
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

const items: MenuProps['items'] = [
    {
        label: <div style={{}}>
            <Button
                icon={<EditOutlined />}
                type="link"
                size="small"
                style={{
                }}
            >
                重命名
            </Button>
        </div>,
        key: '0',
    },
    {
        type: 'divider',
    },
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
        key: '3',
    },
];

const LayoutMenuComponent: React.FC = () => {

    const dispatch = useAppDispatch();

    const [menuDataArray, setMenuDataArray] = useState<MenuItemType[]>(data);
    const [menuArray, setMenuArray] = useState<MenuItemType[]>([]);
    const [selectKey, setSelectKey] = useState<String>('');

    useEffect(() => {
        setMenuArray(buildItem(menuDataArray));
    }, [menuDataArray])

    useEffect(() => {
        getLocalhostMenuList();
    }, [])

    const getLocalhostMenuList = () => {
        invoke<MenuItemType[]>('menu_list')
            .then(res => {
                console.log(res);
            })
            .catch(err => message.error(err));

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
                db.icon = <FolderOpenOutlined className="icon-style" onClick={() => clickMenu(item.id)} />
                res.push(db);

                res = [...res, ...buildItem(item.children)];
            } else {
                if (item.type === 1 || item.children != undefined && item.children.length > 0) {
                    db.icon = <FolderOutlined className="icon-style" onClick={() => clickMenu(item.id)} />
                } else {
                    db.icon = <FileTextOutlined className="icon-style" onClick={() => clickMenu(item.id)} />
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
                if (arr[i].children !== undefined && arr[i].children!.length > 0) {
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

    // 构建面包屑的数据
    const buildBreadcrumb = (ids: number[], data: MenuItemType[]) => {
        const newData = [...data]; // 创建一个副本以保留原始数据的不可变性
        let current = newData;
        let breadcrumb: BreadcrumbOption[] = [];

        for (const index of ids) {
            if (current[index] && current[index].children) {
                breadcrumb.push({
                    label: current[index].label,
                    isChildren: current[index] && current[index].children ? true : false
                });
                current = current[index].children!;
            } else {
                breadcrumb.push({
                    label: current[index].label,
                    isChildren: current[index] && current[index].children ? true : false
                });

                return breadcrumb; // 如果索引无效，则返回原始数据
            }
        }

        return breadcrumb;
    }

    const clickMenu = (id: string) => {

        let ids = findIndexById(menuDataArray, id, []);
        console.log(ids);

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
    }

    const clickMenuTitle = (menu: MenuItemType) => {
        let ids = findIndexById(menuDataArray, menu.id, []);
        let breadcrumb: BreadcrumbOption[] = buildBreadcrumb(ids, menuDataArray); // 构建面包屑数据
        if (breadcrumb.length > 0) {
            dispatch(setBreadcrumbItems(breadcrumb));
        }

        setSelectKey(menu.id);
    }

    const clickMenuAdd = (menu: MenuItemType) => {
        console.log('原数据的type为: ', menu.type);
        console.log('添加数据的type为: ', menu.type + 1);
    }

    return (
        <LayoutMenuContainer>
            <dl className="menu-item-container">
                {
                    menuArray.map((item: MenuItemType, index: number) => {
                        return (
                            <dt
                                key={`${index}-menu-item`}
                                className={`menu-item-title ${item.id == selectKey ? 'active' : ''}`}
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
                                            menu={{ items }}
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
                                                onClick={() => clickMenuAdd(item)}
                                            />
                                        </Dropdown>

                                        <Button
                                            className="icon-style"
                                            icon={<PlusOutlined />}
                                            type="text"
                                            size='small'
                                            onClick={() => clickMenuAdd(item)}
                                        />
                                    </div>
                                </div>

                            </dt>
                        )
                    })
                }
            </dl>
        </LayoutMenuContainer>
    )

}

export default LayoutMenuComponent;