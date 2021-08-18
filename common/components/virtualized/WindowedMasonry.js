import React, { useEffect, useState, useMemo, useCallback, useRef } from "react"
import { WindowScroller, Masonry, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized'

function createCellPositioner({
    cellMeasurerCache,
    columnCount,
    columnWidth,
    spacer = 0,
  }){
    let columnHeights;
  
    initOrResetDerivedValues();
  
    const cellPositioner = index => {
      // Find the shortest column and use it.
      let columnIndex = 0;
      for (let i = 1; i < columnHeights.length; i++) {
        if (columnHeights[i] < columnHeights[columnIndex]) {
          columnIndex = i;
        }
      }
  
      const left = columnIndex * (columnWidth + spacer);
      const top = columnHeights[columnIndex] || 0;
  
      columnHeights[columnIndex] =
        top + cellMeasurerCache.getHeight(index) + spacer;
  
      return {
        left,
        top,
      };
    }
  
    function initOrResetDerivedValues() {
      // Track the height of each column.
      // Layout algorithm below always inserts into the shortest column.
      columnHeights = [];
      for (let i = 0; i < columnCount; i++) {
        columnHeights[i] = 0;
      }
    }
  
    function reset(params){
      columnCount = params.columnCount;
      columnWidth = params.columnWidth;
      spacer = params.spacer;
  
      initOrResetDerivedValues();
    }
  
    cellPositioner.reset = reset;

    return cellPositioner
}

function WindowedMasonry({
    cellRenderer,
    columnWidth,
    gutterSize,
    overscanByPixels,
    cellCount,
}){
    // state values
    const [columnCount, setColumnCount] = useState(1)
    const cache = useMemo(() => new CellMeasurerCache({
        defaultHeight: 250,
        defaultWidth: columnWidth,
        fixedWidth: true,
    }), [columnWidth])
    const masonryRef = useRef(null)

    // renderers
    const _cellRenderer = useCallback(({index, isScrolling, key, parent, style}) => {
        return (
            <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
                {cellRenderer({index, isScrolling, key, parent, style})}
            </CellMeasurer>
        )
    }, [cellRenderer, cache])

    // computation functions
    const cellPositioner = useCallback(createCellPositioner({
        cellMeasurerCache: cache,
        columnCount,
        columnWidth,
        spacer: gutterSize,
    }), [])

    const calculateColumnCount = useCallback(width => {
        setColumnCount(Math.floor(width / (columnWidth + gutterSize)))
    }, [columnWidth, gutterSize])
    
    const onResize = useCallback(({ width }) => {
        calculateColumnCount(width)
    }, [calculateColumnCount])

    // const _renderMasonry = useCallback(({height, width, scrollTop}) => {
    //     return (
    //         <Masonry
    //             autoHeight={true}
    //             cellCount={cellCount}
    //             cellMeasurerCache={cache}
    //             cellPositioner={cellPositioner}
    //             cellRenderer={_cellRenderer}
    //             height={height}
    //             overscanByPixels={overscanByPixels}
    //             scrollTop={scrollTop}
    //             width={width}
    //             ref={masonryRef}
    //             />
    //     )
    // }, [overscanByPixels, cellCount, cache, cellPositioner, _cellRenderer, masonryRef])

    // const _renderAutoSizer = useCallback(({height, scrollTop}) => {
    //     return (
    //         <AutoSizer
    //             disableHeight
    //             height={height}
    //             onResize={onResize}
    //             overscanByPixels={overscanByPixels}
    //             scrollTop={scrollTop}
    //             >
    //             {_renderMasonry}
    //         </AutoSizer>
    //     )
    // }, [overscanByPixels, _renderMasonry, onResize])

    // effect
    useEffect(() => {
        
        // reset cell positionier
        cellPositioner.reset({
            columnCount: columnCount,
            columnWidth,
            spacer: gutterSize,
        })

        // recompute masonry
        masonryRef.current.recomputeCellPositions()

    }, [cellPositioner, columnCount, columnWidth, gutterSize])

    return (        
        <WindowScroller overscanByPixels={overscanByPixels}>
            {/* {_renderAutoSizer} */}
        {({ height, width, isScrolling, onChildScroll, scrollTop }) => (
            <AutoSizer
                disableHeight
                height={height}
                onResize={onResize}
                overscanByPixels={overscanByPixels}
                scrollTop={scrollTop}>

                {() => (
                    <Masonry
                        autoHeight={true}
                        cellCount={cellCount > 10000 ? 1000 : cellCount}
                        cellMeasurerCache={cache}
                        cellPositioner={cellPositioner}
                        cellRenderer={_cellRenderer}
                        height={height}
                        overscanByPixels={overscanByPixels}
                        scrollTop={scrollTop}
                        width={width}
                        ref={masonryRef}
                        />
                )}

                </AutoSizer>
            )}
        </WindowScroller>
    )
}

export { createCellPositioner }

export default WindowedMasonry
