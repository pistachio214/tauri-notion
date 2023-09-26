import { Reducer } from "react";
import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger"
import { ReducersMapObject, combineReducers, CombinedState } from 'redux'

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from "redux-persist/lib/storage";
import { PersistConfig } from 'redux-persist/es/types'
import { PersistPartial } from "redux-persist/es/persistReducer";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

import markDownEditorSlice from "./slice/editor";
import breadcrumbItemSlice from "./slice/breadcrumb";

const persistConfig: PersistConfig<ReducersMapObject> = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2
}

const rootReducer: Reducer<CombinedState<any>, any> = combineReducers({
    editor: markDownEditorSlice,
    breadcrumb: breadcrumbItemSlice,
});

const persistedReducer: Reducer<any & PersistPartial, any> = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    // 每个reducer代表一个模块的状态管理器
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(logger)
});

export const persistor = persistStore(store)

// RootState作用是返回store的方法getState的类型 function
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch 作用是拿到Store的dispatch方法的类型 function
export type AppDispatch = typeof store.dispatch;

