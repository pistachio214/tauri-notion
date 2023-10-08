import styled from "styled-components";

export const MarkDownContainer = styled.div<{color: string}>`
  padding: 0 8vh;
  text-align: 'center';
  background: ${(props: {color: string}) => props.color};
  /* min-height: 96.32vh; */
  height: 100%;
  
  .operation-container {
    height: 40px;
    display: flex;
    align-items: center;
    padding-right: 2vh;
    gap: 1vh;
    justify-content: right;
    /* border-bottom: 1px solid #ddd; */
  }
  
  .markdown-container {
    /* margin-top: 1vh; */

    .for-panel.for-editor-preview.for-active {
      border-left: 1px solid #ddd;
    }

    .for-preview.for-markdown-preview{
      background: ${(props: {color: string}) => props.color};
    }
  }
`