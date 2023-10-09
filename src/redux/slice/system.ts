import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { SystemState } from "@/types/system";

const initialState: SystemState = {
    menu_reload: false,
    menu_select_key: ""
};

export const systemSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        setSystemMenuReload: (state: SystemState, action: PayloadAction<boolean>) => {
            state.menu_reload = action.payload;
        },
        setSystemMenuSelectKey: (state: SystemState, action: PayloadAction<string>) => {
            state.menu_select_key = action.payload;
        },
    },
});

export const {
    setSystemMenuReload,
    setSystemMenuSelectKey,
} = systemSlice.actions;

export default systemSlice.reducer;