// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use tauri::{api::path, Config, App};

#[derive(Serialize, Deserialize)]
struct SysUser {
    r#type: i32,
    access_token: String,
    owner: String,
    repo: String,
    branch: String,
    password: String,
}

#[tauri::command]
fn generate_json(app_name: &str) -> () {
    let config = Config::default();

    let app_dir = path::app_data_dir(&config).unwrap();

    let dir_path = app_dir.join(app_name.to_string());
    if !dir_path.exists() {
        fs::create_dir_all(&dir_path).err();
        println!("Directory created: {}", dir_path.display());
    }

    let file_path = dir_path.join("user_data.txt");
    let data = "Hello, world!";
    std::fs::write(&file_path, data).unwrap();
}

#[tauri::command]
fn add_user_info(data: SysUser) -> () {
    println!("type= {}",data.r#type);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![add_user_info, generate_json])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
