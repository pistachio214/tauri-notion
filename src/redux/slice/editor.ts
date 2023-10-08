import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { MarkDownEditorState } from './../../types/editor';

const initialState: MarkDownEditorState = {
    subfield: false,
    state: 1,
    hierarchy: 1
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
        }
    },
});

export const {
    setMarkDownEditorSubfield,
    setMarkDownEditorState,
    setMarkDownEditorHierarchy,
} = markDownEditorSlice.actions;

export default markDownEditorSlice.reducer;