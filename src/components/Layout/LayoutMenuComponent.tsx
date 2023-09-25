import React from "react";
import { LayoutMenuContainer } from "../../styles/layout";

interface MenuItemType {
    id: string,
    label: string
    children?: MenuItemType[]
}

const data: MenuItemType[] = [
    {
        id: "1",
        label: "圆月弯刀",
        children: [
            {
                id: '1-1',
                label: "小楼一夜听春雨",
                children: [
                    {
                        id: '1-1-1',
                        label: "第1场春雨",
                    },
                    {
                        id: '1-1-2',
                        label: "第2场春雨",
                    },
                    {
                        id: '1-1-3',
                        label: "第3场春雨",
                    },
                    {
                        id: '1-1-4',
                        label: "第4场春雨",
                    },
                    {
                        id: '1-1-5',
                        label: "第5场春雨",
                    },
                ]
            },
            {
                id: '1-2',
                label: "天外流星",
                children: [
                    {
                        id: '1-2-1',
                        label: "第1颗流星",
                    },
                    {
                        id: '1-2-2',
                        label: "第2颗流星",
                    },
                    {
                        id: '1-2-3',
                        label: "第3颗流星",
                    },
                ]
            }
        ]
    }
];

const buildMenuItem = () => {

    data.forEach((item: MenuItemType, index: number) => { 
        item.
    })

}

const LayoutMenuComponent: React.FC = () => {

    return (
        <LayoutMenuContainer>
            <dl className="menu-item-container">
                <dt className="menu-item-title">圆月弯刀</dt>
                <dt className="menu-item-title item-title">小楼一夜听春雨</dt>
                <dt className="menu-item-title">第1场春雨</dt>
                <dt className="menu-item-title">第2场春雨</dt>
                <dt className="menu-item-title">第3场春雨</dt>
                <dt className="menu-item-title">第4场春雨</dt>
                <dt className="menu-item-title">第5场春雨</dt>
                <dt className="menu-item-title">第6场春雨</dt>
                <dt className="menu-item-title">第7场春雨</dt>
            </dl>
        </LayoutMenuContainer>
    )

}

export default LayoutMenuComponent;