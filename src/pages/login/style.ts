import styled, { keyframes } from "styled-components";
import { Button } from "antd";
import { Rotate } from "../../styles/global";

const fromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50vw);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const LoginContainer = styled.div`
  overflow: hidden;
  width: 100vm;
  height: 100vh;
  animation: ${fromLeft} 0.5s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

export const LoginBg = styled.div<{primary: string, deepr: string}>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: -1;

  &::before {
    content: "";
    position: absolute;
    max-width: 1000px;
    min-width: 700px;
    width: 60vw;
    height: 150%;
    background: linear-gradient(to bottom,
    ${(props: {primary: string, deepr: string}) => props.primary} 70%,
    ${(props: {primary: string, deepr: string}) => props.deepr});
    transform: rotateZ(-13deg) translateX(-7%) translateY(-20%);
  }
`;

const fadein = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const LoginImage = styled.img`
  margin-right: 10vw;
  animation: ${fadein} 0.5s ease-in-out backwards;
  animation-delay: 0.5s;
`;

export const LoginBox = styled.div`
  width: 350px;
  animation: ${fadein} 0.5s ease-in-out backwards;
  animation-delay: 0.5s;
  height: 400px;

  .title-description {
    padding-bottom: 30px;
    padding-top: 15px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    text-align: center;
  }
  
  input {
    box-shadow: none!important;
  }
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconBox = styled.img`
  animation: ${Rotate} 4s linear infinite;
  margin-right: 10px;
`;

export const LoginButton = styled(Button)`
  width: 100%;
`;

export const CodeItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .code-item-input {
    width: 75%;
    margin-right: 5px;
    padding: 6.5px 11px 6.5px 11px;
    vertical-align: middle;
    border-radius: 0;
  }

  .code-item-image {
    width: 23%;
    vertical-align: middle;
    padding: 0;
    border: 1px solid black;
  }
`