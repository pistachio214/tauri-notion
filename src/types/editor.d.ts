interface MarkDownEditorState {
    subfield: boolean
    // 编辑器的状态 1展示 2编辑 3新增
    state: number
    // 编辑器的层级 1表示第一层
    hierarchy: number
}


export type {
    MarkDownEditorState
}