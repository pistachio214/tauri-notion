import React from 'react';
import { theme } from 'antd';


const App: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <div style={{ padding: 24, textAlign: 'center', background: colorBgContainer, minHeight: '97vh' }}>
            这里显示Markdown的东西
        </div>
    );
};

export default App;