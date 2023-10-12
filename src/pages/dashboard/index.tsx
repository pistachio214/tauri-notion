import React, { useState, useEffect } from 'react';
import { theme } from 'antd';
import MarkDownEditor from "for-editor";
import { shallowEqual } from "react-redux";

import { invoke } from '@tauri-apps/api/tauri';

import { MarkDownContainer } from '@/styles/dashboard';
import { message } from '@/components/Antd/EscapeAntd';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { MarkDownEditorState } from '@/types/editor';
import { RootState } from '@/redux/store';
import { setSystemMenuReload } from '@/redux/slice/system';
import { SystemState } from '@/types/system';
import { MenuItemType } from '@/types/menu';
import { setMarkDownEditorContent } from '@/redux/slice/editor';

const Dashboard: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const dispatch = useAppDispatch();
    const editorState: MarkDownEditorState = useAppSelector((state: RootState) => ({ ...state.editor }), shallowEqual);
    const systemState: SystemState = useAppSelector((state: RootState) => ({ ...state.system }), shallowEqual);

    const [mdContent, setMdContent] = useState<string>('');

    useEffect(() => {
        switch (editorState.state) {
            case 1:
                showEditor();
                break;
            case 2:
                showEditor();
                break;
            case 3:
                setMdContent('');
                break;
            default:
        }
    }, [editorState.state, editorState.content])

    const showEditor = () => {
        // 后续要根据选择，进行内容的注入，目前先就这样吧
        setMdContent(editorState.content);
    }

    const addMenu = (value: string) => {
        const data = {
            label: generateLabel(value),
            type: editorState.hierarchy,
            open: false,
            content: value,
            parent_id: editorState.parentId,
        }

        invoke("menu_create", { data })
            .then(() => {

                dispatch(setSystemMenuReload(!systemState.menu_reload))
                message.success('保存成功');

            })
            .catch((e) => {
                console.log(e);
                message.error('保存失败');
            })
    }

    const editMenu = (value: string) => {
        const id = systemState.menu_select_key;

        invoke<MenuItemType>("menu_find", { id })
            .then((res) => {
                const data = {
                    ...res,
                    ...{
                        label: generateLabel(value),
                        content: value,

                    }
                }
                invoke("menu_edit", { id, data })
                    .then(() => {
                        dispatch(setMarkDownEditorContent(value));
                        dispatch(setSystemMenuReload(!systemState.menu_reload))
                        message.success('保存成功');

                    })
                    .catch((e) => {
                        console.log(e);
                        message.error('保存失败');
                    })
            })
            .catch(err => { message.error(err) })
    }

    const handleEditorSave = (value: string) => {
        let state = editorState.state;

        switch (state) {
            case 1: // 展示
                break;
            case 2: // 编辑
                editMenu(value);
                break;
            case 3: // 新增
                addMenu(value);
                break;
            default:
                message.error("非法操作")
        }
    }

    const generateLabel = (value: string) => {
        if (value === "") {
            return " new page "
        }

        let lines = value.split("\n");

        return lines[0].replace("#", "").replace(/\s/g, "");
    }

    return (
        <MarkDownContainer color={colorBgContainer}>
            <div className='markdown-container'>
                <MarkDownEditor
                    key={'md-editor-edit'}
                    value={mdContent}
                    placeholder={"请输入md内容"}
                    toolbar={{}}
                    onSave={(value: string) => handleEditorSave(value)}
                    onChange={(value: string) => setMdContent(value)}
                    addImg={(file: File, index: number) => {
                        console.log(file, index);
                    }}
                    // @ts-ignore
                    lineNum={false}
                    preview={true}
                    subfield={editorState.subfield}
                    language={'zh-CN'}
                    style={{
                        height: '95vh',
                        border: 'none',
                        background: colorBgContainer,
                        boxShadow: 'none',
                    }}
                />
            </div>
        </MarkDownContainer>
    );
};

export default Dashboard;