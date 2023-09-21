import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { MarkDownEditorState } from './../../types/editor';

const initialState: MarkDownEditorState = {
    subfield: false,
    state: 1
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
    },
});

export const {
    setMarkDownEditorSubfield,
    setMarkDownEditorState,
} = markDownEditorSlice.actions;

export default markDownEditorSlice.reducer;