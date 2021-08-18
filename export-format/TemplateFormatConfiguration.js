import dotProp from "dot-prop-immutable"
import find from "lodash/find"
import map from "lodash/map"
import get from "lodash/get"
import React from "react"
import Dropzone from "react-dropzone"
import { connect } from "react-redux"
import Select from "react-select"
import SelectString from "../common/components/form/SelectString"
import * as actions from "./actions"
import * as selectors from "./selectors"
import * as utils from "./utils"
import Editor from "../common/components/editor/Editor"
import AmazonJSONValidator from "./forms/AmazonJSONValidator"
import JSONTextValidator from "./forms/JSONTextValidator"

class TemplateFormatConfiguration extends React.Component {

  componentDidMount() {
    this.setDiscriminator()
  }

  componentDidUpdate(prevProps) {
    if(prevProps.configuration.type !== this.props.configuration.type || this.props.configuration.id !== prevProps.configuration.id) this.setDiscriminator()
  }

  setDiscriminator() {
    const { configuration } = this.props
    const { onChange } = this.props
    onChange(dotProp.set(configuration, "discriminator", utils.getDiscriminatorForTemplateType(configuration.type)))
  }
  
  render() {
    const { configuration, businessRulesets, onChange, properties } = this.props

    const change = (k, v) => onChange( dotProp.set(configuration, k, v) )

    return (
      <div style={{ position: "relative" }}>
        <div className="form-row" style={{ position: "relative", zIndex: 3 }}>
          {/* Type */}
          <div className="form-group col">
            <label className="control-label">Type*</label>
            <SelectString
              options={utils.templateTypes()}
              value={configuration.type}
              onChange={type => change("type", type)}
              />
          </div>

          {/* Business rules set */}
          <div className="form-group col">
            <label className="control-label">Business rules set*</label>
            <Select
              options={map(businessRulesets, utils.makeOption)}
              value={utils.makeOption(find(businessRulesets, ["id", configuration.businessRuleSetId]))}
              onChange={option => change("businessRuleSetId", option.value)}
            />
          </div>
        </div>

        {/* File upload */}
        {utils.doesTemplateNeedUpload(configuration.type) && (
          <div className="form-group">
            <Dropzone
              className="w-100 text-center p-5 bg-secondary text-white"
              onDrop={acceptedFiles => change("fileLocation", acceptedFiles[0])}
            >
              <p className="lead m-0">
                Please drop a matrix file, or click in this area to choose one.
              </p>
              {get(configuration, "fileLocation", null) ? <div className="text-success"><i>File exists</i></div> : <div className="text-danger"><i>No file</i></div>}
              {!get(configuration, "fileLocation.preview", null) && get(configuration, "fileLocation", null) && <div className="text-success"><i>{get(configuration, "fileLocation", null)}</i></div>}
            </Dropzone>
          </div>
        )}

        {/* Template */}
        <div className="form-group" style={{ position: "relative", zIndex: 2 }}>
          <label className="control-label">Template*</label>
          <Select
            options={properties}
            onChange={p => this.templateEditor.paste(` {{ ${p.code} }} `)}
            getOptionLabel={p => p.code}
            getOptionValue={p => p.code}
            value={null} />
        </div>

        <div className="form-group" style={{ position: "relative", zIndex: 1 }}>
          <Editor
            ref={obj => (this.templateEditor = obj)}
            type={configuration.type}
            value={configuration.template}
            onChange={val => change("template", val)}
          />
        </div>

        {/* Validator */}
        <div className="form-group" style={{ position: "relative", zIndex: 1 }}>
          <label className="control-label">Validator</label>
          {utils.isSimpleTemplateValidator(configuration.type) && <JSONTextValidator configuration={configuration} onChange={val => change("validator", val)} />}
          {utils.isAmazonTemplateValidator(configuration.type) && <AmazonJSONValidator configuration={configuration} onChange={c => onChange(c)} />}
        </div>

        {/* Validator references */}
        {utils.isSimpleTemplateValidator(configuration.type) && <div className="form-group" style={{ position: "relative", zIndex: 1 }}>
          <label className="control-label">Validator references</label>
          <button 
            onClick={e => {
              e.preventDefault()
              change("validatorReferences", [utils.getDefaultValidatorReference(), ...(get(configuration, "validatorReferences", []))])
            }}
            className="btn btn-sm btn-secondary float-right">+ Add new validator reference</button>

          <div className="row">
          {map(get(configuration, "validatorReferences"), (vr, k) => (
              <div className="col-12" key={`validator-ref-${configuration.id}--${k}`}>
                <label>File name</label>
                <input 
                  value={vr.filename || ""}
                  onChange={e => change(`validatorReferences.${k}.filename`, e.target.value)}
                  className="form-control" />    
                <label>Content</label>      
                <Editor
                  type={configuration.type}
                  value={get(vr, "content") || ""}
                  onChange={val => change(`validatorReferences.${k}.content`, val)}
                />
                <button 
                  onClick={e => {
                    e.preventDefault()
                    onChange( dotProp.delete(configuration, `validatorReferences.${k}`) )
                  }}
                  className="btn btn-sm btn-danger float-right">Remove validator ref.</button>
              </div>  
          ))}
          </div>
        </div>}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    format: selectors.getFormatObject(state),
    properties: selectors.getMergedTradeItemProperties(state),
  }
}

export default connect(
  mapStateToProps,
  actions
)(TemplateFormatConfiguration)
