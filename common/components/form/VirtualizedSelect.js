import React from "react"
import { List } from "react-virtualized"
import { components } from 'react-select'
import styled from "styled-components"
import size from "lodash/size"
import OptimizedSelect from "./OptimizedSelect"

const VirtualizedRow = styled.div`
  position: relative;
  display: inline-block;
  width: 100% !important;
  overflow: hidden;
`


const VirtualizedMenuList = ({
                               children
                             }) => (
  <List
    style={{width: "100%", position: "relative"}}
    width={1000}
    height={300}
    rowCount={size(children)}
    rowHeight={50}
    rowRenderer={({
                    key,
                    index,
                    isScrolling,
                    isVisible,
                    style,
                  }) => (
      <VirtualizedRow
        key={key}
        style={style}
      >
        {children[index]}
      </VirtualizedRow>
    )}
  />
)

const MenuList = (props) => {
  return (
    <components.MenuList {...props}>
      <VirtualizedMenuList>
        {props.children}
      </VirtualizedMenuList>
    </components.MenuList>
  );
};

const VirtualizedSelect = props => <OptimizedSelect {...props} components={{ MenuList }} maxMenuHeight={200000} />

export default VirtualizedSelect