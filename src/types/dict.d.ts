import { PageQuestionType } from "@/types/common";

interface DictQuestionType extends PageQuestionType {
    type?: string
    system?: string | number
}

interface SysDict {
    id?: number
    type: string
    description: string
    remarks: string
    system: number
    createdAt: string
    updatedAt: string
    isDelete: number
}

interface DictItem {
    value: string
    label: string
}

interface SysDictListResponse {
    id: number
    type: string
    name: string
    items: DictItem[]
}

interface SysDictItem {
    id?: number
    createdAt: string
    updatedAt: string
    isDelete: number
    dictId: number
    value: string
    label: string
    type: string
    description: string
    remarks: string
    sort: number
}

interface SysDictInfoResponse extends SysDict {
    items: SysDictItem[]

}

export type {
    DictQuestionType,
    SysDict,
    SysDictItem,
    SysDictListResponse,
    SysDictInfoResponse,
}