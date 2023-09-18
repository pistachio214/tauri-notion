//接口返回值
import { ReactNode } from "react";
import { UserBaseInfo } from "@/redux/types/User";

export interface Response<T> {
    code: number;
    message: string;
    data: T;
}

export interface PageQuestionType {
    current?: number
    size?: number
}

export interface OptionsInterface {
    label: string
    value: string
}

export interface OptionSelect {
    label: string
    value: number
}

//Layout中回调函数传参类型
export interface CallbackItem {
    key: string;
    label: string;
}

//列表返回类型
export interface ListRes<T> {
    total: number;
    pageIndex: number;
    pageSize: number;
    rows: T[];
}

export interface RouteReactNode {
    key: string
    component: ReactNode
}

export interface AuthorNavsType {
    id: number
    name: string
    title: string
    icon?: string | null
    path: string
    component: string | null
    children?: AuthorNavsType[]
}

export interface AuthorResponse {
    authoritys: string[]
    navs: AuthorNavsType[]
    user: UserBaseInfo
}
