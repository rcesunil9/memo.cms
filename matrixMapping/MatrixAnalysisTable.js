import React from "react"
import get from "lodash/get"
import map from "lodash/map"
import orderBy from "lodash/orderBy"
import isEmpty from "lodash/isEmpty"
import reduce from "lodash/reduce"
import filter from "lodash/filter"
import { toColumnIndex } from "../common/utils/excel"

const prepareColumns = (columns) => orderBy(columns, c => toColumnIndex(c.columnIdentifier))

const TableView = ({columns, sheet, mappedColumns}) => (
  <div  style={{position: "relative", maxWidth: "100%", overflowX: "auto"}}>
    <table className="table table-sm table-bordered m-0">
        <thead>
            <tr className="bg-light">{map(columns, col => col.columnName && <th
                  key={`matrix-analysis-column-id-${sheet.sheetIndex}-${col.columnIdentifier}`}
                  className={`text-center ${isEmpty(get(mappedColumns, col.columnIdentifier)) ? "bg-warning" : "text-white bg-success"}`}>{col.columnIdentifier}</th>)}</tr>
        </thead>
        <tbody>
          <tr className="bg-light">{map(columns, col => col.columnName && <td
            key={`matrix-analysis-column-name-${sheet.sheetIndex}-${col.columnIdentifier}`}
            nowrap="true">{col.columnName}</td>)}</tr>
        </tbody>
    </table>
  </div>
)

const MatrixAnalysisTable = ({matrixAnalysis, mappedColumns}) => {
  return (
    <React.Fragment>
      {map(get(matrixAnalysis, "file.sheets"), sheet => (
        <div className="row pb-4" key={`sheet-${sheet.sheetIndex}`}>
          {/* Sheet info */}
          <div className="col-12 pb-3">
            <h6>Tab {`${sheet.sheetIndex+1}`}: {get(sheet, "sheetName")}</h6>
            <span>Ignored: <input type="checkbox" checked={get(sheet, "ignored") ? "checked" : false} disabled/></span>&nbsp;&nbsp;
            <span>headerStartingRowNumber: {get(sheet, "headerStartingRowNumber")}</span>&nbsp;&nbsp;
            <span>headerStartingColNumber: {get(sheet, "headerStartingColNumber")}</span>&nbsp;&nbsp;
            <span>dataStartingRowNumber: {get(sheet, "dataStartingRowNumber")}</span>&nbsp;&nbsp;
            <span>dataStartingRowNumber: {get(sheet, "propertyCodeRowNumber")}</span>&nbsp;&nbsp;
          </div>
          {/* Sheet columns */}
          {!get(sheet, "ignored", false) && <div className="col-12">
            <TableView
              mappedColumns={reduce(mappedColumns, (r, c, k) => {return {...r, [k]: filter(c, _c => _c.sheetIndex === sheet.sheetIndex)}}, {})}
              columns={prepareColumns(get(sheet, "columns"))}
              sheet={sheet}/>
          </div>}
        </div>
      ))}
      </React.Fragment>
)}

export default MatrixAnalysisTable
