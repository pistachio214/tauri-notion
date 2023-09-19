import styled from "styled-components";

export const MarkDownContainer = styled.div<{bgcolor: string}>`
  padding: 24;
  text-align: 'center';
  background: ${(props: {bgcolor: string}) => props.bgcolor};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  .operation-container {
    height: 40px;
    display: flex;
    align-items: center;
    padding-right: 2vh;
    gap: 1vh;
    justify-content: right;
    border-bottom: 1px solid #ddd;
  }
  
  .markdown-container {
    margin-top: 1vh;

    .for-panel.for-editor-preview.for-active {
      border-left: 1px solid #ddd;
    }
  }
`