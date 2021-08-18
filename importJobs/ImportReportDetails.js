import React from "react"
import { connect } from "react-redux"
import get from "lodash/get"
import map from "lodash/map"
import * as selectors from "./selectors"
import * as actions from "./actions"
import * as utils from "./utils"
import BusinessRulesEvaluationResult from "./BusinessRulesFailedTree";

const ImportReportDetails = ({detailReport}) => {

  const { detail } = detailReport

  return <React.Fragment>
    {/* persistence */}
    {get(detailReport, 'group') === 'persistence' && <ul className="list-group">
      {map(get(detail, 'exception', []), (value, key) => <li className="list-group-item"><span className="font-weight-bold">{`${key}: `}</span>{value}</li>)}
    </ul>}

    {/* businessRule */}
    {get(detailReport, 'group') === 'businessRule' && <BusinessRulesEvaluationResult evaluationResult={detail} />}

    {/* mapping */}
    {get(detailReport, 'group') === 'mapping' && <ul className="list-group">
      <li className="list-group-item"><span className="font-weight-bold">ID:</span> { get(detail, "id") }</li>
      <li className="list-group-item"><span className="font-weight-bold">Date:</span> { utils.getCreationDateTime(detail) }</li>
      <li className="list-group-item"><span className="font-weight-bold">EAN:</span> { get(detail, "gtin") }</li>
      <li className="list-group-item"><span className="font-weight-bold">Manufacturer code:</span> { get(detail, "tradeItemManufacturerCode") }</li>
      <li className="list-group-item"><span className="font-weight-bold">Line number:</span> { get(detail, "lineNumber") }</li>
      <li className="list-group-item"><span className="font-weight-bold">Sheet index:</span> { get(detail, "sheetIndex") }</li>
      <li className="list-group-item"><span className="font-weight-bold">Fail reason:</span> { get(detail, "reason") }</li>
      <li className="list-group-item"><span className="font-weight-bold">Property code:</span> { get(detail, "propertyCode") }</li>
      <li className="list-group-item"><span className="font-weight-bold">Property value:</span> { get(detail, "propertyValue") }</li>
    </ul>}
  </React.Fragment>

}


const mapStateToProps = (state) => {
    return {
        detailReport: selectors.getDetailReport(state),
    }
}

export default connect(mapStateToProps, actions)(ImportReportDetails)