import React, { useState } from 'react';
import { Button, theme } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    FileAddOutlined
} from '@ant-design/icons';
import MarkDownEditor from "for-editor";

import { MarkDownContainer } from '../../styles/dashboard';
import defaultSettings from '../../defaultSettings';
import { message } from '../../components/Antd/EscapeAntd';


const Dashboard: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [mdContent, setMdContent] = useState<string>(`# ${defaultSettings.title}`);
    const [subfield, setSubfield] = useState<boolean>(false);

    const [saveLoading, setSaveLoading] = useState<boolean>(true);

    const handleEditorSave = (value: string) => {
        if (!saveLoading) {
            return;
        }

        setSaveLoading(false);

        message.info("保存中.....");

        setTimeout(() => {
            // .... 执行完各种操作后
            setSaveLoading(true);

        }, 2000)

    }

    return (
        <MarkDownContainer bgcolor={colorBgContainer}>
            <div className='operation-container'>
                <Button
                    type="text"
                    icon={<FileAddOutlined />}
                    onClick={() => {
                        setSubfield(true)
                    }}
                >
                    添加
                </Button>
                <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => {
                        setSubfield(!subfield)
                    }}
                >
                    编辑
                </Button>
                <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    danger
                >
                    删除
                </Button>
            </div>

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
                    subfield={subfield}
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