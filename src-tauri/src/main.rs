// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64_url;
use bcrypt::{hash, verify, DEFAULT_COST};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::{api::path, utils::assets::EmbeddedAssets, Config};
use uuid::Uuid;

// 创建并返回 Tauri 上下文信息
fn create_tauri_context() -> tauri::Context<EmbeddedAssets> {
    tauri::generate_context!()
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct MenuUserType {
    id: String,
    items: Vec<MenuItemType>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct MenuItemType {
    id: String,
    r#type: i32,
    label: String,
    open: bool,
    parent_id: String,
    content: String,
    children: Option<Vec<MenuItemType>>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct SysUserType {
    id: Option<String>,
    r#type: i32,
    access_token: String,
    owner: String,
    repo: String,
    branch: String,
    password: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct MenuItemTypeReq {
    r#type: i32,
    label: String,
    open: bool,
    content: String,
    parent_id: String,
}

// 测试案例,放在最上面,封测就删掉
#[tauri::command]
fn generate_json() {
    print!("到底进来没得哟?2");
}

// 新增用户的菜单列表数据到暂存区
#[tauri::command]
fn menu_create(data: MenuItemTypeReq) -> Result<Vec<MenuItemType>, String> {
    let file: String = String::from("user_menu_temp.json");

    find_dir_and_file(&file, "[]");

    let file_path = get_data_file(file);

    // 上一步保证了文件必存在,此时获取文件内容毫无压力
    let user_menu = tauri::api::file::read_string(file_path.clone()).unwrap();

    let mut user_menu_array: Vec<MenuItemType> = match serde_json::from_str(&user_menu) {
        Ok(res) => res,
        Err(_) => Vec::new(),
    };

    let push_data: MenuItemType = MenuItemType {
        id: Uuid::new_v4().to_string(),
        r#type: data.r#type,
        parent_id: data.parent_id,
        label: data.label,
        open: false,
        children: None,
        content: data.content,
    };

    user_menu_array.push(push_data);

    std::fs::write(&file_path, serde_json::to_string(&user_menu_array).unwrap()).unwrap();

    return Ok(user_menu_array);
}

// TODO 获取某个用户的菜单列表
#[tauri::command]
fn menu_list() -> Result<(Vec<MenuItemType>, Vec<MenuItemType>), String> {
    let local_menu = get_local_menu();
    let cache_menu = get_cache_menu();

    Ok((local_menu, cache_menu))
}

// TOOD 试试能不能同步线上的菜单数据
// fn syncGiteeMenu() {}

/**
 * 用户登录操作
 */
#[tauri::command]
fn user_login(username: String, password: String) -> Result<SysUserType, String> {
    let user_list: Vec<SysUserType> = get_user_config_list();

    let mut sys_user_option: Option<&SysUserType> = None;
    for user in user_list.iter() {
        let id = match &user.id {
            Some(id) => id,
            None => "",
        };

        if id == username {
            sys_user_option = Some(user);
        }
    }

    if sys_user_option.is_none() {
        return Err("账号信息不存在,请刷新重新操作".to_string());
    }

    if let Some(sys_user) = sys_user_option.as_deref() {
        let verify_password = match verify(password, &sys_user.password) {
            Ok(_) => true,
            Err(_) => false,
        };

        if verify_password {
            return Ok(sys_user.clone());
        } else {
            return Err("密码不正确，请重新尝试".to_string());
        }
    };

    Err("账号信息不存在,请刷新重新操作".to_string())
}

/**
 * 创建新的用户数据到本地存储
 */
#[tauri::command]
fn add_user_info(mut data: SysUserType) -> () {
    let mut user_data_array: Vec<SysUserType> = get_user_config_list();

    data.id = Some(Uuid::new_v4().to_string());
    data.access_token = base64_url::encode(&data.access_token);
    data.password = hash(data.password, DEFAULT_COST).unwrap();

    user_data_array.push(data);

    let file: String = String::from("user_data.json");
    let file_path = get_data_file(file);

    std::fs::write(&file_path, serde_json::to_string(&user_data_array).unwrap()).unwrap();
}

/**
 * 获取本地存储的用户账号配置信息
 */
#[tauri::command]
fn get_user_config_list() -> Vec<SysUserType> {
    let file: String = String::from("user_data.json");

    find_dir_and_file(&file, "[]");

    let file_path = get_data_file(file);

    // 上一步保证了文件必存在,此时获取文件内容毫无压力
    let user_data = tauri::api::file::read_string(file_path.clone()).unwrap();

    let user_data_array: Vec<SysUserType> = match serde_json::from_str(&user_data) {
        Ok(res) => res,
        Err(_) => Vec::new(),
    };

    user_data_array
}

fn main() {
    let context = create_tauri_context();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            menu_create,
            add_user_info,
            get_user_config_list,
            user_login,
            menu_list,
            generate_json,
        ])
        .run(context)
        .expect("error while running tauri application");
}

// 获取 Cache blocks 的menu数据
fn get_cache_menu() -> Vec<MenuItemType> {
    let file: String = String::from("user_menu_temp.json");

    find_dir_and_file(&file, "[]");

    let file_path = get_data_file(file);

    // 上一步保证了文件必存在,此时获取文件内容毫无压力
    let user_menu = tauri::api::file::read_string(file_path.clone()).unwrap();

    let user_menu_array: Vec<MenuItemType> = match serde_json::from_str(&user_menu) {
        Ok(res) => res,
        Err(_) => Vec::new(),
    };

    return user_menu_array;
}
// 获取 Local blocks 的menu数据
fn get_local_menu() -> Vec<MenuItemType> {
    let file: String = String::from("user_menu.json");

    find_dir_and_file(&file, "[]");

    let file_path = get_data_file(file);

    // 上一步保证了文件必存在,此时获取文件内容毫无压力
    let user_menu = tauri::api::file::read_string(file_path.clone()).unwrap();

    let user_menu_array: Vec<MenuItemType> = match serde_json::from_str(&user_menu) {
        Ok(res) => res,
        Err(_) => Vec::new(),
    };

    return user_menu_array;
}

// 获取应用的data地址
fn get_data_path() -> PathBuf {
    let app = create_tauri_context();
    let app_name = app.config().package.product_name.as_ref().unwrap();

    let config = Config::default();
    let app_dir = path::app_data_dir(&config).unwrap();

    app_dir.join(app_name.replace(" ", "").to_string())
}

// 获取应用data中指定file文件
fn get_data_file(file: String) -> PathBuf {
    let dir_path = get_data_path();

    dir_path.join(file)
}

// 公共方法，查看指定文件是否存在
fn find_dir_and_file(file: &String, content: &str) {
    // 去掉项目名称中的所有空格以作为存储地址
    let dir_path: PathBuf = get_data_path();

    // 当用户数据文件不存在的时候就创建
    if !dir_path.exists() {
        fs::create_dir_all(&dir_path).err();
        println!("Directory created: {}", dir_path.display());
    }

    let file_path = dir_path.join(file);
    if !file_path.exists() {
        let data = content;
        std::fs::write(&file_path, data).unwrap();
    }
}
