import React, { useState, useEffect } from 'react';
import { theme } from 'antd';
import MarkDownEditor from "for-editor";
import { shallowEqual } from "react-redux";

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

    const [saveLoading, setSaveLoading] = useState<boolean>(true);

    useEffect(() => {
        console.log(editorState)
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
        if (!saveLoading) {
            return;
        }

        console.log(value);

        setSaveLoading(false);

        message.info("保存中.....");

        setTimeout(() => {
            // .... 执行完各种操作后
            setSaveLoading(true);

        }, 2000)

    }

    return (
        <MarkDownContainer bgcolor={colorBgContainer}>
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