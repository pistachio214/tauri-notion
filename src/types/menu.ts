interface SysMenu {
    id: number
    name: string
    orderNum: number
    parentId: number
    path: string
    perms: string
    status: number
    type: number
    updatedAt: string
    icon: string
    createdAt: string
    component: string
    children?: SysMenu[]
}

interface MenuEdit {
    id?: number
    parentId: number
    name: string
    perms: string
    icon?: string
    path?: string
    component?: string
    type: number
    status: number
    orderNum: number
}

interface MenuTreeNodesType {
    title: string
    key: string
    children?: MenuTreeNodesType[]
}

export type {
    SysMenu,
    MenuEdit,
    MenuTreeNodesType,
}
