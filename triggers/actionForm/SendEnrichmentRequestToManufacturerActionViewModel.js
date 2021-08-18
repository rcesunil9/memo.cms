import React from "react"
import { connect } from "react-redux"
import Select from "react-select"
import dotProp from "dot-prop-immutable"
import get from "lodash/get"
import map from "lodash/map"
import { inputChanger  } from "../utils"
import * as actions from "../actions"
import * as selectors from "../selectors"
import SelectString from "app/common/components/form/SelectString"

const MATRIX_ATTACHMENT = ["Full", "Incremental"]

class SendEnrichmentRequestToManufacturerActionViewModel extends React.Component {

  state = {
    enrichmentConfigurations: []
  }

  componentDidMount() {
    this.init()
  }

  init() {
    this.props.getManufacturers()
  }

  render() {
    const props = this.props

    const { 
      model, 
      manufacturers, 
    } = props

    const { 
      onChange,
    } = props
    
    const selectedManufacturers = manufacturers.filter(
      o => model.manufacturerIds.indexOf(o.value) >= 0
    )
  
    const change = (k, v) => onChange(dotProp.set(model, k, v))
  
    const input = inputChanger(model, onChange)

    return (
      <React.Fragment>
  
        {/* manufacturerIds	string($uuid) */}
        <div className="form-group">
          <label className="control-label">Manufacturers</label>
          <Select
            isMulti
            closeMenuOnSelect={false}
            options={manufacturers}
            name="manufacturerIds"
            value={selectedManufacturers}
            onChange={v => change("manufacturerIds", map(v, _v => _v.value) || [])}
          />
        </div>
  
        {/* MatrixAttachment	string */}
        <div className="form-group">
          <label className="control-label">Matrix Attachment</label>
          <SelectString
            isMulti
            closeMenuOnSelect={false}
            value={get(model, 'matrixAttachments')}
            onChange={v => change("matrixAttachments", v || [])}
            options={MATRIX_ATTACHMENT}
            />
        </div>
  
        {/* EmailTitleTemplate	string */}
        <div className="form-group">
          <label className="control-label">Email Title Template</label>
          <textarea
            name="emailTitleTemplate"
            className="form-control"
            value={get(model, 'emailTitleTemplate') || ""}
            onChange={input}
            />
        </div>
  
        {/* EmailBodyTemplate	string */}
        <div className="form-group">
          <label className="control-label">Email Body Template</label>
          <textarea
            rows={10}
            name="emailBodyTemplate"
            className="form-control"
            value={get(model, 'emailBodyTemplate') || ""}
            onChange={input}
            />
        </div>
        
      </React.Fragment>
    )

  }

}




const mapStateToProps = state => {
  return {
    exportFormats: selectors.getExportFormats(state),
    transportConfigurations: selectors.getTransportConfigurations(state),
    manufacturers: selectors.getManufacturersForSelect(state),
    imageActions: selectors.getImageActions(state),
    retailers: selectors.getRetailersList(state),
    targetMarkets: selectors.getTargetMarkets(state),
    displayInputParams: selectors.displayInputParams(state),
    inputParamsValues: selectors.inputParamsValues(state),
  }
}

export default connect(mapStateToProps, actions)(SendEnrichmentRequestToManufacturerActionViewModel)
