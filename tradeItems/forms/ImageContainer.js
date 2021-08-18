import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: auto;
  width: 200px;
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 5px 0px;
  border: 1px solid #e6e6e6;
  padding: 0;
  cursor: grab;
  background-color: #f5f5f5;
`;

const Media = styled.div`
    background-color: #fff;
    height: 113px;
    padding: 0;
    margin: 0;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    background-image: url('${props => props.imgUrl}');
    background-size: ${props => (props.contain ? "contain" : "cover")};
    background-repeat: no-repeat;
    background-position: center;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 80px;
  padding: 0 0 0.25rem;
  margin: 0;
`;

const CoverInfo = styled.div`
  position: absolute;
`

const ImageContainer = ({
  imgUrl,
  contain,
  size,
  colorSpace,
  manuallyImported,
  children,
  onClick
}) => (
  <Container>
    <Media contain={contain} imgUrl={imgUrl} onClick={onClick}/>
    <CoverInfo>
      {manuallyImported && <span className='badge badge-warning d-block mb-2'>Manually imported</span>}
      {size}
      <br/>
      {colorSpace}
    </CoverInfo>
    <Content>{children}</Content>
  </Container>
);

export default ImageContainer;
