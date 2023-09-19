
interface SysUser {
    type: number
    access_token: string
    owner: string
    repo: string
    branch: string
    password: string
}

export type {
    SysUser
}