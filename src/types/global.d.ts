import React, { MouseEvent } from 'react';

interface BreadcrumbItemType {
    title: React.ReactNode
}

interface BreadcrumbItemState {
    items: BreadcrumbOption[]
}

interface BreadcrumbOption {
    label: string 
    id: string
    content: string
    isChildren: boolean
}

export type {
    BreadcrumbItemState,
    BreadcrumbItemType,
    BreadcrumbOption,
}