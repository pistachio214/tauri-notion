
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

/**
 * 合并本地与缓存中的数据
 * @param localMenu 本地数据
 * @param cacheMenu 缓存数据
 * @returns 
 */
export const mergeLocalAndCacheMenu = (localMenu: MenuItemType[], cacheMenu: MenuItemType[]) => {
    let tempMenu: MenuItemType[] = [];

    // local blocks is empty and cache blocks is empty
    if (localMenu.length < 1 && cacheMenu.length < 1) {
        tempMenu = [];
    }

    // local blocks is empty
    if (localMenu.length < 1) {
        tempMenu = cacheMenu;
    }

    // cache blocks is empty
    if (cacheMenu.length < 1) {
        tempMenu = localMenu;
    }

    tempMenu = [...localMenu];

    // 1. 查询缓冲中的 同 id数据，以缓存为准
    tempMenu.forEach((tempItem: MenuItemType, index: number) => {
        cacheMenu.forEach((cacheItem: MenuItemType) => {
            if (tempItem.id === cacheItem.id) {
                tempMenu[index] = cacheItem;
            }
        });
    });

    // 2. 缓存中的数据，如果本地不存在,则加入进去
    cacheMenu.forEach((cacheItem: MenuItemType) => {
        let existence = false;
        localMenu.forEach((tempItem: MenuItemType) => {
            if (cacheItem.id === tempItem.id) {
                existence = true;
            }
        })

        if (!existence) {
            tempMenu.push(cacheItem);
        }
    });

    return tempMenu;
}