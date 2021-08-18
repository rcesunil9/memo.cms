import React from "react"
import { connect } from "react-redux"
import Select from "react-select"
import dotProp from "dot-prop-immutable"
import get from "lodash/get"
import find from "lodash/find"
import { Link } from 'react-router-dom'
import * as actions from "../actions"
import * as selectors from "../selectors"


class ExportTradeItemsWithImagesActionViewModel extends React.Component {

  componentDidMount() {
    this.init()
  }

  async init() {
    const { loadExportTradeItemWithImagesDependencies } = this.props
    await loadExportTradeItemWithImagesDependencies()
  }

  render() {
    const props = this.props
    const { model, exportPreComputedTradeItemActions } = props
    const { onChange } = props
 
    const change = (k, v) => onChange(dotProp.set(model, k, v))

    return (
      <React.Fragment>

        {/* transportConfigurationIds	array string($uuid) */}
        <div className="form-group">
          <label className="control-label">Export action*</label>
          {get(model, 'exportPreComputedTradeItemActionId') && <Link to={`/action/${model.exportPreComputedTradeItemActionId}`} className="btn btn-link p-0 ml-1">&#8594; View action</Link>}
          <Select
            getOptionLabel={o => o.name}
            getOptionValue={o => o.id}
            options={exportPreComputedTradeItemActions}
            name="transportConfigurationId"
            value={find(exportPreComputedTradeItemActions, ea => ea.id === get(model, "exportPreComputedTradeItemActionId"))}
            onChange={val => change("exportPreComputedTradeItemActionId", get(val, "id") || null)}
          />
        </div>

        {/* Image pattern */}
        <div className="form-group">
            <label className="control-label d-block">Image filename pattern</label>
            <input
                onChange={e => change("imageFilenamePattern", e.target.value)}
                value={get(model, "imageFilenamePattern")}
                className="form-control"
                />      
        </div>

        {/* Include images */}
        <div className="form-check">
          <label>
            <input
              className="form-check-input"
              type="checkbox"
              checked={!!get(model, "includeImages")}
              name="includeImages"
              onChange={e => change("includeImages", !!e.target.checked)}
            />
            Include images
          </label>
        </div>

        {/* Metadata pattern */}
        <div className="form-group">
            <label className="control-label d-block">Metadata filename pattern</label>
            <input
                onChange={e => change("metadataFilenamePattern", e.target.value)}
                value={get(model, "metadataFilenamePattern")}
                className="form-control"
                />      
        </div>

        
      </React.Fragment>
    )

  }

}




const mapStateToProps = (state) => {
  return {
    exportPreComputedTradeItemActions: selectors.getExportPreComputedTradeItemActions(state),
  }
}

export default connect(mapStateToProps, actions)(ExportTradeItemsWithImagesActionViewModel)
