import { createGlobalStyle, keyframes } from "styled-components";

export default createGlobalStyle<{color: string}>`
  * {
    margin: 0;
    padding: 0;
    border: 0;
  }

  * {

    //滚动条整体部分
    &::-webkit-scrollbar {
      width: 7px; //y轴滚动条粗细
      height: 7px;
    }

    //滚动条里面的小方块，能上下左右移动（取决于是垂直滚动条还是水平滚动条）
    &::-webkit-scrollbar-thumb {
      border-radius: 8px;
      min-height: 120px; // 滑块高度
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
      background: rgba(97, 108, 114, 0.4);
    }
  }

  //更改antd的样式
  .ant-menu-light .ant-menu-submenu-selected > .ant-menu-submenu-title {
    /* color: #fff; */
    color: ${(props: {color: string}) => props.color};
  }

  .ant-layout-sider-children .ant-menu-submenu-inline .ant-menu-submenu-title {
    &:hover {
      color: ${(props: {color: string}) => props.color};
    }
  }

  .action-dropdown {
    .ant-dropdown-menu-item,.ant-dropdown-menu-item-only-child {
      padding: 0 !important;
    }
  }
`

//旋转样式
export const Rotate = keyframes`
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
`