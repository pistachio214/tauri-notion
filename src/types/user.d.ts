import { PageQuestionType } from "@/types/common";
import { SysRole } from "@/types/role";

interface UserQuestionType extends PageQuestionType {
    username?: string
}

interface AssignRoles {
    id: number
    sysRoles: SysRole[]
}

interface SysUser {
    id: number
    avatar: string
    nickname: string
    username: string
    sysRoles: SysRole[]
    email: string
    status: number
    createdAt: string
}

interface UserCreateRequest {
    username: string
    email: string
    status: number
}

interface UserInfoEditRequest {
    nickname: string
    avatar?: string | null
    email?: string | null
}

interface UserChangePasswordRequest {
    oldPassword: string
    newPassword: string
    confirmPassword: string
}

export type {
    UserQuestionType,
    AssignRoles,
    SysUser,
    UserCreateRequest,
    UserInfoEditRequest,
    UserChangePasswordRequest,
}