import styled from "styled-components";


export const LogoContainer = styled.div`
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1vh;
  margin-bottom: 1vh;
  margin-top: 2vh;
  
  .logo-img {
    object-fit: cover;
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  
  span {
    font-weight: bold;
    font-size: 16px;
  }
`;