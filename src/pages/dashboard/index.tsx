import React, { useState, useEffect } from 'react';
import { theme } from 'antd';
import MarkDownEditor from "for-editor";
import { shallowEqual } from "react-redux";

import { invoke } from '@tauri-apps/api/tauri';

import { MarkDownContainer } from '../../styles/dashboard';
import { message } from '../../components/Antd/EscapeAntd';
import { useAppSelector } from '../../redux/hook';
import { MarkDownEditorState } from '../../types/editor';
import { RootState } from '../../redux/store';

const Dashboard: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const editorState: MarkDownEditorState = useAppSelector((state: RootState) => ({ ...state.editor }), shallowEqual);

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
    }, [editorState.state])

    const showEditor = () => {
        // 后续要根据选择，进行内容的注入，目前先就这样吧
        setMdContent(`# 小楼一夜听春雨`)
    }

    const handleEditorSave = (value: string) => {
        let data = {
            label: generateLabel(value),
            type: editorState.hierarchy,
            open: false,
            content: value
        }

        console.log(data);

        message.info("保存中.....");
        invoke("add_menu_list")
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