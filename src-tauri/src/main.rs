// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64_url;
use bcrypt::{hash, verify, DEFAULT_COST};
use reqwest::{Client, Method};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::{error::Error, fs};
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

#[derive(Serialize, Deserialize, Debug, Clone)]
struct GiteePullRes {
    r#type: String,
    encoding: String,
    size: i32,
    name: String,
    path: String,
    content: String,
    sha: String,
    url: String,
    html_url: String,
    download_url: String,
    _links: GiteePullLinks,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct GiteePullLinks {
    #[serde(rename = "self")]
    self_: String,
    html: String,
}

// 测试案例,放在最上面,封测就删掉
#[tauri::command]
fn generate_json() {
    print!("到底进来没得哟?");
}

// TODO 有合并数据的时候,需要push到远端
#[tauri::command]
fn menu_sync_push(
    sha: String,
    user: SysUserType,
    data: Vec<MenuItemType>,
) -> Result<String, String> {
    match gitee_push(sha, data, user) {
        Ok(_) => {
            return Ok("success".to_string());
        }
        Err(_) => {
            return Err("同步失败".to_string());
        }
    };
}

#[tauri::command]
fn menu_sync_first(
    data: SysUserType,
) -> Result<(Vec<MenuItemType>, Vec<MenuItemType>, String), String> {
    let mut sha = String::from("");
    // 1. 先把远端的数据pull到本地
    let gitee_data_str = gitee_pull(data).unwrap();
    println!("gitee_data_str= {}", gitee_data_str);
    if gitee_data_str.len() > 0 {
        let gitee_data: GiteePullRes = serde_json::from_str(&gitee_data_str).unwrap();
        sha = gitee_data.sha;
        println!("content= {}", gitee_data.content);
        // let decode_gitee_data = base64_url::decode(&gitee_data.content).unwrap();

        match base64_url::decode(&gitee_data.content) {
            Ok(e) => {
                let gitee_content_str = String::from_utf8(e).unwrap();
                let local_data: Vec<MenuItemType> = serde_json::from_str(&gitee_content_str).unwrap();

                set_local_menu(local_data);
            }
            Err(err) => {
                println!("反正也是不知道错到哪儿了,打出来看看 {:?}", err)
            }
        }
        // print!("decode_gitee_data= {:?}", decode_gitee_data);
        // let gitee_content_str = String::from_utf8(decode_gitee_data).unwrap();
        // let local_data: Vec<MenuItemType> = serde_json::from_str(&gitee_content_str).unwrap();

        // set_local_menu(local_data);
    }

    let local_menu: Vec<MenuItemType> = get_local_menu();
    let cache_menu: Vec<MenuItemType> = get_cache_menu();

    Ok((local_menu, cache_menu, sha.to_string()))
}

#[tauri::command]
fn menu_find(id: String) -> Result<MenuItemType, String> {
    let mut cache_menu: Vec<MenuItemType> = get_cache_menu();
    let cache_index: Option<usize> = cache_menu.iter().position(|menu| menu.id == id);
    if let Some(index_cache) = cache_index {
        let item = cache_menu.remove(index_cache);

        return Ok(item);
    } else {
        let mut local_menu: Vec<MenuItemType> = get_local_menu();
        let local_index: Option<usize> = local_menu.iter().position(|menu| menu.id == id);
        if let Some(index_local) = local_index {
            let item = local_menu.remove(index_local);
            return Ok(item);
        } else {
            return Err("没有找到该信息，如果确定远程仓库有该信息,请同步后再尝试".to_string());
        }
    }
}

#[tauri::command]
fn menu_edit(id: String, data: MenuItemTypeReq) -> Result<(), String> {
    let mut cache_menu: Vec<MenuItemType> = get_cache_menu();

    let edit_data: MenuItemType = MenuItemType {
        id: id.clone(),
        r#type: data.r#type,
        parent_id: data.parent_id,
        label: data.label,
        open: false,
        children: None,
        content: data.content,
    };

    let cache_index: Option<usize> = cache_menu.iter().position(|menu| menu.id == id);
    if let Some(index) = cache_index {
        cache_menu[index] = edit_data;
    } else {
        cache_menu.push(edit_data);
    }

    set_cache_menu(cache_menu);

    Ok(())
}

// 用户菜单列表数据删除
#[tauri::command]
fn menu_delete(id: String) -> Result<String, String> {
    let mut local_menu: Vec<MenuItemType> = get_local_menu();
    let mut cache_menu: Vec<MenuItemType> = get_cache_menu();

    let local_index: Option<usize> = local_menu.iter().position(|menu| menu.id == id);
    if let Some(index) = local_index {
        local_menu.remove(index);
    }

    let cache_index: Option<usize> = cache_menu.iter().position(|menu| menu.id == id);
    if let Some(index) = cache_index {
        cache_menu.remove(index);
    }

    set_local_menu(local_menu);
    set_cache_menu(cache_menu);

    Ok("success".to_string())
}

// 新增用户的菜单列表数据到暂存区
#[tauri::command]
fn menu_create(data: MenuItemTypeReq) -> Result<Vec<MenuItemType>, String> {
    let mut user_menu_array: Vec<MenuItemType> = get_cache_menu();

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

    set_cache_menu(user_menu_array.clone());

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
            menu_sync_push,
            menu_sync_first,
            menu_find,
            menu_edit,
            menu_delete,
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

// 本地 push 数据到远端
#[tokio::main]
async fn gitee_push(
    sha: String,
    content: Vec<MenuItemType>,
    data: SysUserType,
) -> Result<String, Box<dyn Error>> {
    let access_u8 = base64_url::decode(&data.access_token).unwrap();

    let access_token = String::from_utf8(access_u8)?;
    let banner = &data.branch;

    let owner = &data.owner;
    let repo = &data.repo;

    let path = "data.json";

    let url_string = format!(
        "https://gitee.com/api/v5/repos/{}/{}/contents/{}",
        owner, repo, path
    );

    let client = Client::new();
    let request = client
        .request(Method::PUT, url_string)
        .header("Accept", "/")
        .form(&[
            ("access_token", access_token),
            ("branch", banner.to_string()),
            (
                "content",
                hash(serde_json::to_string(&content).unwrap(), DEFAULT_COST).unwrap(),
            ),
            ("sha", sha),
            ("message", "同步数据".to_string()),
        ]);

    request.send().await?;

    Ok("push success".to_string())
}

// 远端拉取数据到本地
#[tokio::main]
async fn gitee_pull(data: SysUserType) -> Result<String, Box<dyn Error>> {
    let access_u8 = base64_url::decode(&data.access_token).unwrap();

    let access_token = String::from_utf8(access_u8)?;
    let banner = &data.branch;

    let owner = &data.owner;
    let repo = &data.repo;

    let path: &str = "data.json";

    let url_string = format!(
        "https://gitee.com/api/v5/repos/{}/{}/contents/{}",
        owner, repo, path
    );

    let client = Client::new();
    let request = client
        .request(Method::GET, url_string)
        .header("Accept", "/")
        .query(&[("access_token", access_token), ("ref", banner.to_string())]);

    let res = request.send().await?;

    let body = res.bytes().await?;
    let v = body.to_vec();

    let v_str = String::from_utf8(v);

    match v_str {
        Ok(e) => {
            if e == "[]" {
                return Ok("".to_string());
            }
            return Ok(e);
        }
        Err(_) => {
            return Ok("".to_string());
        }
    };
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

// 写入 Cache blocks 的menu数据
fn set_cache_menu(data: Vec<MenuItemType>) -> Vec<MenuItemType> {
    let file: String = String::from("user_menu_temp.json");

    find_dir_and_file(&file, "[]");

    let file_path = get_data_file(file);

    std::fs::write(&file_path, serde_json::to_string(&data).unwrap()).unwrap();
    return data;
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

// 写入 Local blocks 的menu数据
fn set_local_menu(data: Vec<MenuItemType>) -> Vec<MenuItemType> {
    let file: String = String::from("user_menu.json");

    find_dir_and_file(&file, "[]");

    let file_path = get_data_file(file);

    std::fs::write(&file_path, serde_json::to_string(&data).unwrap()).unwrap();
    return data;
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
