
import { MenuItemType } from "@/types/menu";
import { BreadcrumbOption } from "@/types/global";

// 构建面包屑的数据
export const buildBreadcrumb = (ids: number[], data: MenuItemType[]) => {
    const newData = [...data]; // 创建一个副本以保留原始数据的不可变性
    let current = newData;
    let breadcrumb: BreadcrumbOption[] = [];

    for (const index of ids) {
        if (current[index] && current[index].children) {
            breadcrumb.push({
                label: current[index].label,
                id: current[index].id,
                content: current[index].content ?? "",
                isChildren: current[index] && current[index].children ? true : false
            });
            current = current[index].children!;
        } else {
            breadcrumb.push({
                label: current[index].label,
                id: current[index].id,
                content: current[index].content ?? "",
                isChildren: current[index] && current[index].children ? true : false
            });

            return breadcrumb; // 如果索引无效，则返回原始数据
        }
    }

    return breadcrumb;
}

export const buildMenuItemReload = (ids: number[], data: MenuItemType[]) => {
    const newData = [...data]; // 创建一个副本以保留原始数据的不可变性
    let current = newData;

    for (let i = 0; i < ids.length - 1; i++) {
        if (current[ids[i]] && current[ids[i]].children) {
            current[ids[i]].open = true;
            current = current[ids[i]].children!;
        } else {
            return current; // 如果索引无效，则返回原始数据
        }
    }

    return current;
}