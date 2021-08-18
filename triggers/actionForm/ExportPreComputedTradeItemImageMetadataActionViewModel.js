import React from "react"
import { connect } from "react-redux"
import Select from "react-select"
import dotProp from "dot-prop-immutable"
import get from "lodash/get"
import find from "lodash/find"
import { Link } from 'react-router-dom'
import * as actions from "../actions"
import * as selectors from "../selectors"
import { SelectObject, getNewImageMetadataExportAction } from "../utils";


class ExportPreComputedTradeItemImageMetadataActionViewModel extends React.Component {


    componentDidMount() {
        this.init()
    }

    async init() {
        const { model } = this.props
        const { setAction,loadExportTradeItemWithImagesMetadataDependencies } = this.props

        if(!get(model, "id", null)) setAction(getNewImageMetadataExportAction())
        await loadExportTradeItemWithImagesMetadataDependencies()
    }

    render() {
        const { model, exportPreComputedTradeItemActions, transportConfigurations, exportFormats } = this.props
        const { onChange } = this.props

        const change = (k, v) => onChange(dotProp.set(model, k, v))

        return (
            <React.Fragment>

            {/* exportPreComputedTradeItemActionId	array string($uuid) */}
            <div className="form-group">
                <label className="control-label">Export action*</label>
                {get(model, 'exportPreComputedTradeItemActionId') && <Link to={`/action/${model.exportPreComputedTradeItemActionId}`} className="btn btn-link p-0 ml-1">&#8594; View action</Link>}
                <Select
                getOptionLabel={o => o.name}
                getOptionValue={o => o.id}
                options={exportPreComputedTradeItemActions}
                name="exportPreComputedTradeItemActionId-img-mtd"
                value={find(exportPreComputedTradeItemActions, ea => ea.id === get(model, "exportPreComputedTradeItemActionId"))}
                onChange={val => change("exportPreComputedTradeItemActionId", get(val, "id") || null)}
                />
            </div>
  
            {/* formatConfigurationId	string($uuid) */}
            <div className="form-group">
                <label className="control-label">Format configuration*</label>
                {get(model, 'formatConfigurationId') && <Link to={`/tools/export-format/${model.formatConfigurationId}`} className="btn btn-link p-0 ml-1">&#8594; View format</Link>}
                <SelectObject
                    options={exportFormats}
                    name="formatConfigurationId-img-mtd"
                    value={model.formatConfigurationId}
                    onChange={val => change("formatConfigurationId", get(val, "target.value") || null)}
                />
            </div>

            {/* transportConfigurationId	string($uuid) */}
            <div className="form-group">
                <label className="control-label">Transport configuration*</label>
                {get(model, 'transportConfigurationId') && <Link to={`/transport-configuration/${model.transportConfigurationId}`} className="btn btn-link p-0 ml-1">&#8594; View transport</Link>}
                <SelectObject
                    options={transportConfigurations}
                    name="transportConfigurationId-img-mtd"
                    value={model.transportConfigurationId}
                    onChange={val => change("transportConfigurationId", get(val, "target.value") || null)}
                />
            </div>
            
            </React.Fragment>
        )

    }

}




const mapStateToProps = (state) => {
  return {
    exportPreComputedTradeItemActions: selectors.getExportPreComputedTradeItemActions(state),
    transportConfigurations: selectors.getTransportConfigurations(state),
    exportFormats: selectors.getExportFormats(state),
  }
}

export default connect(mapStateToProps, actions)(ExportPreComputedTradeItemImageMetadataActionViewModel)
