
interface MenuItemType {
    id: string
    type: number
    label: string
    open: boolean
    parent_id?: string,
    content?: string
    icon?: React.ReactNode
    children?: MenuItemType[]
}

interface MenuItem {
    id: string,
    type: number,
    label: string,
    open: boolean,
    parent_id: string,
    content?: string
    children?: MenuItem[]
}


export type {
    MenuItem,
    MenuItemType
}