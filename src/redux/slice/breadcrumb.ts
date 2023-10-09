import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { BreadcrumbItemState, BreadcrumbOption } from '@/types/global';

const initialState: BreadcrumbItemState = {
    items: [],
};

export const breadcrumbItemSlice = createSlice({
    name: 'breadcrumb',
    initialState,
    reducers: {
        setBreadcrumbItems: (state: BreadcrumbItemState, action: PayloadAction<BreadcrumbOption[]>) => {
            state.items = action.payload;
        },
    },
});

export const {
    setBreadcrumbItems,
} = breadcrumbItemSlice.actions;

export default breadcrumbItemSlice.reducer;