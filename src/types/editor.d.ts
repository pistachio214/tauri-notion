interface MarkDownEditorState extends MarkDownEditorChangeHierarchyAndSubfieldAndState {
    // 新增时，所处下层
    childrenKey: number[]
    // 父级 id
    parentId: string

    content: string
}


interface MarkDownEditorChangeHierarchyAndSubfieldAndState {
    subfield: boolean
    // 编辑器的状态 1展示 2编辑 3新增
    state: number
    // 编辑器的层级 1表示第一层
    hierarchy: number
}

interface MarkDownEditorChangeHierarchyAndParentId {
    parentId: string
    hierarchy: number
}

export type {
    MarkDownEditorState,
    MarkDownEditorChangeHierarchyAndSubfieldAndState,
    MarkDownEditorChangeHierarchyAndParentId,
}