import styled from "styled-components";
import { Layout } from 'antd';

const { Content } = Layout;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 1vh;
  
  .logo-notion {
    width: 20px;
    height: 20px;
    margin-right: 0.5vh;
    background-color: #D8D8D5;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dropdown {
    width: 100%;
    padding-left: 2vh;
    margin-bottom: 1vh;
    padding-top: 1vh;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .operitem-botton {
    width: 100%;
    padding-left: 2vh;
    display: flex;
    flex-direction: row;
    align-items: center;

    .new-page {
      font-size: 12px;
    }
  }
  
  .username {
    color: #37352F;
    font-weight: bold;
    font-size: 14px;
  }
`;

export const LayoutOperation = styled.div`
  height: 45px;
  background: #FFFFFF;
  position: fixed;
  top: 0;
  left: 300px;
  right: 0;
  z-index: 999;


  .layout-operation-container {
    height: 100%;
    padding-left: 3vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1vh;
  }
  
  
`

export const LayoutContent = styled(Content)`
  padding-top: 35px;
  margin: 0;
  overflow: initial;
`