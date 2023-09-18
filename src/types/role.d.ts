import { PageQuestionType } from "@/types/common";

interface SysRole {
    id: number
    name: string
    menuIds: number[]
    code: string
    createdAt: string
    remark: string
    status: number
    updatedAt: string
}

interface RolesListParams extends PageQuestionType {
    username?: string
    status?: number
}

interface RoleQuestionType extends PageQuestionType {
    name?: string
}

export type {
    SysRole,
    RolesListParams,
    RoleQuestionType,
}