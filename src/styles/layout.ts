import styled from "styled-components";
import { Layout } from 'antd';

const { Content } = Layout;


export const LayoutMenuContainer = styled.div`
  .menu-item-container {
    /* border: 1px solid red; */
    user-select: none;

    .active {
      color: rgba(0, 0, 0, 0.88);
      background-color: rgba(0, 0, 0, 0.05);
    }

    .menu-item-title {
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 2vh;
      user-select: none !important;

      .item-title {
        display: flex;
        flex-direction: row;

      }

      .menu-action-container {
        padding-right: 1vh;
        display: none;
        
        .action-item {
          display: flex;
          flex-direction: row;
          gap: 3px;


        }
      }

      .icon-style {
        height: 20px;
        width: 20px;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
        
      }
      
      .title {
        margin-left: 0.5vh;
      }

      &:hover {
        color: rgba(0, 0, 0, 0.88);
        background-color: rgba(0, 0, 0, 0.06);
        cursor: pointer;

        .menu-action-container {
          display: block;
        }
      }
    }

    .item-title {
      padding-left: +=2vh;
    }
  }
`

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
    padding-bottom: 1vh;
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
  margin: 0;
  height: 100%;
  overflow: initial;
`

export const LayoutSettingTabsContainer = styled.div`
  margin-top: 2vh;

  .ant-tabs-nav-wrap {
    .ant-tabs-tab {
      padding-top: 0px;
    }
  }
`