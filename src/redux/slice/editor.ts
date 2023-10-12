import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
    MarkDownEditorChangeHierarchyAndParentId,
    MarkDownEditorChangeHierarchyAndSubfieldAndState,
    MarkDownEditorState
} from '@/types/editor';

const initialState: MarkDownEditorState = {
    subfield: false,
    state: 1,
    hierarchy: 1,
    childrenKey: [],
    parentId: "",
    content: "",
};

export const markDownEditorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        setMarkDownEditorSubfield: (state: MarkDownEditorState, action: PayloadAction<boolean>) => {
            state.subfield = action.payload;
        },
        setMarkDownEditorState: (state: MarkDownEditorState, action: PayloadAction<number>) => {
            state.state = action.payload;
        },
        setMarkDownEditorHierarchy: (state: MarkDownEditorState, action: PayloadAction<number>) => {
            state.hierarchy = action.payload;
        },
        setMarkDownEditorChildrenKey: (state: MarkDownEditorState, action: PayloadAction<number[]>) => {
            state.childrenKey = action.payload;
        },
        setMarkDownEditorParentId: (state: MarkDownEditorState, action: PayloadAction<string>) => {
            state.parentId = action.payload;
        },
        setMarkDownEditorContent: (state: MarkDownEditorState, action: PayloadAction<string>) => {
            state.content = action.payload;
        },
        setMarkDownEditorHierarchyAndSubfieldAndState: (state: MarkDownEditorState, action: PayloadAction<MarkDownEditorChangeHierarchyAndSubfieldAndState>) => {
            state.hierarchy = action.payload.hierarchy;
            state.subfield = action.payload.subfield;
            state.state = action.payload.state;
        },
        setMarkDownEditorHierarchyAndParentId: (state: MarkDownEditorState, action: PayloadAction<MarkDownEditorChangeHierarchyAndParentId>) => {
            state.hierarchy = action.payload.hierarchy;
            state.parentId = action.payload.parentId;
        },
        setMarkDownEditorContentAndStateAndSubfield: (state: MarkDownEditorState, action: PayloadAction<{ content: string, state: number, subfield: boolean }>) => {
            state.content = action.payload.content;
            state.state = action.payload.state;
            state.subfield = action.payload.subfield;
        },
        restMarkDownEditor: (state: MarkDownEditorState) => {
            state.subfield = false;
            state.state = 1;
            state.hierarchy = 1;
            state.childrenKey = [];
            state.parentId = "";
            state.content = "";
         }
    },
});

export const {
    setMarkDownEditorSubfield,
    setMarkDownEditorState,
    setMarkDownEditorHierarchy,
    setMarkDownEditorChildrenKey,
    setMarkDownEditorContent,
    setMarkDownEditorParentId,
    setMarkDownEditorHierarchyAndSubfieldAndState,
    setMarkDownEditorHierarchyAndParentId,
    setMarkDownEditorContentAndStateAndSubfield,
    restMarkDownEditor,
} = markDownEditorSlice.actions;

export default markDownEditorSlice.reducer;