import React from "react";

interface IOperator {
    title: string
    disable?: boolean
    icon?: React.ReactElement
    danger?: boolean
    onClick?: () => void
    message?: string
    permission?: string[]
}

interface IOperatorProps {
    items?: IOperator[]
}

export type {
    IOperator,
    IOperatorProps
}