import React from "react"
import { WindowScroller, Masonry, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized'
import Card from "../layout/Card";
import { EvaluationResult } from "app/exportJobs/ExportJobDetails";

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

export default class GridExample extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this._columnCount = 0;

    this._cache = new CellMeasurerCache({
      defaultHeight: 250,
      defaultWidth: 800,
      fixedWidth: true,
    });

    this.state = {
      columnWidth: 800,
      height: 300,
      gutterSize: 10,
      overscanByPixels: 0,
      windowScrollerEnabled: true,
    };

    this._cellRenderer = this._cellRenderer.bind(this);
    this._onResize = this._onResize.bind(this);
    this._renderAutoSizer = this._renderAutoSizer.bind(this);
    this._renderMasonry = this._renderMasonry.bind(this);
    this._setMasonryRef = this._setMasonryRef.bind(this);
  }

  render() {
    const {
      // columnWidth,
      height,
      // gutterSize,
      overscanByPixels,
      windowScrollerEnabled,
    } = this.state;

    let child;

    if (windowScrollerEnabled) {
      child = (
        <WindowScroller overscanByPixels={overscanByPixels}>
          {this._renderAutoSizer}
        </WindowScroller>
      );
    } else {
      child = this._renderAutoSizer({height});
    }

    return (
      <div>
        {child}
      </div>
    );
  }

  _calculateColumnCount() {
    const {columnWidth, gutterSize} = this.state;

    this._columnCount = Math.floor(this._width / (columnWidth + gutterSize));
  }

  _cellRenderer({index, key, parent, isScrolling, style}) {
    const {list} = this.props;
    const {columnWidth} = this.state;

    // const datum = list[index % list.size]

    // console.log(list)
    if (!list.length) return '...'

    return (
      <CellMeasurer cache={this._cache} index={index} key={key} parent={parent}>
        <div
          style={{
            ...style,
            width: columnWidth,
          }}>
          <Card
            className='col-12'
            >
            <EvaluationResult evaluationResult={list[index]} name={`import-job-detail-${key}`}/>
            </Card>
          {/* <div
            style={{
              backgroundColor: '#222',
              borderRadius: '0.5rem',
              height: 50,
              marginBottom: '0.5rem',
              width: '100%',
              fontSize: 20,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {index}
          </div> */}
        </div>
      </CellMeasurer>
    );
  }

  _initCellPositioner() {
    if (typeof this._cellPositioner === 'undefined') {
      const {columnWidth, gutterSize} = this.state;

      this._cellPositioner = createCellPositioner({
        cellMeasurerCache: this._cache,
        columnCount: this._columnCount,
        columnWidth,
        spacer: gutterSize,
      });
    }
  }

  _onResize({width}) {
    this._width = width;

    this._calculateColumnCount();
    this._resetCellPositioner();
    this._masonry.recomputeCellPositions();
  }

  _renderAutoSizer({height, scrollTop}) {
    this._height = height;
    this._scrollTop = scrollTop;

    const {overscanByPixels} = this.state;

    return (
      <AutoSizer
        disableHeight
        height={height}
        onResize={this._onResize}
        overscanByPixels={overscanByPixels}
        scrollTop={this._scrollTop}>
        {this._renderMasonry}
      </AutoSizer>
    );
  }

  _renderMasonry({width}) {
    this._width = width;

    this._calculateColumnCount();
    this._initCellPositioner();

    const {height, overscanByPixels, windowScrollerEnabled} = this.state;

    return (
      <Masonry
        scrollingResetTimeInterval={1000}
        autoHeight={windowScrollerEnabled}
        cellCount={10000}
        cellMeasurerCache={this._cache}
        cellPositioner={this._cellPositioner}
        cellRenderer={this._cellRenderer}
        height={windowScrollerEnabled ? this._height : height}
        overscanByPixels={overscanByPixels}
        ref={this._setMasonryRef}
        scrollTop={this._scrollTop}
        width={width}
      />
    );
  }

  // This is a bit of a hack to simulate newly loaded cells
  _resetList = () => {
    const ROW_HEIGHTS = [25, 50, 75, 100];

    const {list} = this.props;
    list.forEach(datum => {
      datum.size = ROW_HEIGHTS[Math.floor(Math.random() * ROW_HEIGHTS.length)];
    });

    this._cache.clearAll();
    this._resetCellPositioner();
    this._masonry.clearCellPositions();
  };

  _resetCellPositioner() {
    const {columnWidth, gutterSize} = this.state;

    this._cellPositioner.reset({
      columnCount: this._columnCount,
      columnWidth,
      spacer: gutterSize,
    });
  }

  _setMasonryRef(ref) {
    this._masonry = ref;
  }
}