import { type } from "@tauri-apps/api/os";

interface SystemState {
    menu_reload: boolean
    menu_select_key: string
}

export type {
    SystemState
}