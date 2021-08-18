import React from "react"
import dotProp from "dot-prop-immutable"
import get from "lodash/get"
import size from "lodash/size"
import SmartDatatable from "../../common/components/datatable/SmartDatatable"
import Editor from "../../common/components/editor/Editor"
import { getStorageFile } from '../../common/services/exportFormats'


// We take the index 0 of the validation result
//
class JSONTemplateValidationResult extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showTransformedText: false,
            transformedText: null
        }
    }

    toggleShowTransformedText(transformation) {
      if(!this.state.transformedText) {
        this.downloadTransformJson(transformation)
      }
        this.setState(dotProp.set(this.state, "showTransformedText", !this.state.showTransformedText))
    }

    downloadTransformJson(transformation) {
      if(get(transformation, 'storageInformation.publicUri') && !this.state.transformedText) {
        getStorageFile(get(transformation, 'storageInformation.publicUri'))
          .then(res => {
            this.setState({transformedText: get(res, 'data', null)})
          })
      }
    }

    render() {

        const { validationResult } = this.props
        const { showTransformedText, transformedText } = this.state

        const transformation = get(validationResult, "0.transformation", null)

        return (

            <React.Fragment>
        
                {/* View transformed text */}
                <button
                    onClick={e => this.toggleShowTransformedText(transformation)}
                    className="btn btn-primary">Toggle view transformed trade item</button>

                {/* Transformed text */}
                {(showTransformedText && transformedText) && (
                    <div className="row py-3">
                        <div className="col">
                            <Editor
                                height="auto"
                                options={{
                                    readOnly: true
                                }}
                                value={JSON.stringify(transformedText)}
                                type="JSON"
                                />
                        </div>
                    </div>
                )}

                {/* Errors */}
                {!showTransformedText && (
                    
                    <div className="row py-3">
                        <div className="col">
                            
                            <SmartDatatable
                                sortable
                                showPagination={false}
                                defaultPageSize={size(get(transformation, "validationErrors", [])) || 0}
                                filterable
                                data={get(transformation, "validationErrors", [])}
                                columns={[
                                    { Header: "Keyword", accessor: "keyword" },
                                    { Header: "Schema Path", accessor: "schemaPath" },
                                    { Header: "Data Path", accessor: "dataPath" },
                                    { Header: "Index", accessor: "index" },
                                    { Header: "Message", accessor: "message" },
                                    { Header: "Params", id: "params", accessor: err => <pre>{JSON.stringify(get(err, "params", {}), null, 2)}</pre> },
                                ]}
                                defaultSorted={[{ id: "dataPath", desc: false }]}
                                />

                        </div>
                    </div>

                )}                
        
            </React.Fragment>
        )

    }
}

export default JSONTemplateValidationResult