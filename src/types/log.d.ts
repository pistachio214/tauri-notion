import { PageQuestionType } from "@/types/common";

interface SysOperLogoDetailsProps {
    id: number
    isVisible: boolean
    closeModel: () => void
}


interface OperLogQuestionType extends PageQuestionType {
    operUserName?: string
    startAt?: string
    endAt?: string
}

interface SysLog {
    id: number

    operRequMethod: string

    operRequParam: string

    operUserId: number
    operUserName: string
    operMethod: string
    operUri: string
    operIp: string
    operVer: string

    createdAt: string
    updatedAt: string
    isDelete: number
}

interface SysOperLog extends SysLog {
    operModul: string
    operType: string
    operDesc: string

    operRespParam: string
}

interface SysExceptionLog extends SysLog {
    excRequParam: string
    excName: string
    excMessage: string
}

interface SysExceptionLogoDetailsProps extends SysOperLogoDetailsProps {
}

export type {
    SysOperLogoDetailsProps,
    OperLogQuestionType,
    SysOperLog,
    SysExceptionLog,
    SysExceptionLogoDetailsProps,
}