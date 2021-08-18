import React from "react"
import { WindowScroller, List, AutoSizer } from 'react-virtualized'

function VirtualizedList({
    list,
    rowRenderer,
    overscanRowCount
}){
    return (
        <WindowScroller>
          {({height, isScrolling, registerChild, onChildScroll, scrollTop}) => (
              <AutoSizer disableHeight>
                {({width}) => (
                  <div ref={registerChild}>
                    <List
                      autoHeight
                      height={height}
                      isScrolling={isScrolling}
                      onScroll={onChildScroll}
                      overscanRowCount={overscanRowCount}
                      rowCount={list.length}
                      rowHeight={30}
                      rowRenderer={rowRenderer}
                      scrollTop={scrollTop}
                      width={width}
                    />
                  </div>
                )}
              </AutoSizer>
          )}
        </WindowScroller>
    )
}

export default VirtualizedList
