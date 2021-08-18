import React from "react"
import Form from "react-jsonschema-form"
import ArrayFieldTemplate from "../common/components/form/ArrayFieldTemplate"

const FormUi = {
  id: {"ui:disabled": true},
  file: {
    sheets: {
      "ui:options":  {
        orderable: false,
        addable: false,
        removable: false
      },
      items: {
        "ui:order": [
          "sheetName",
          "sheetIndex",
          "*"
        ],
        "ui:options":  {
          removable: false
        },
        columns: {"ui:widget": "hidden"}
      }
    }
  }
}

const UpdateSchema = {
  type: "object",
  required: [],
  title: "",
  properties: {
    id: {type: "string", title: "Matrix analysis id"},
    file: {
      type: "object",
      title: "",
      properties: {
        sheets: {
          type: "array",
          title: "",
          items: {
            type: "object",
            title: "",
            properties: {
              ignored: { type: "boolean", title: "Ignored?" },
              sheetIndex: { type: "number", title: "Sheet index" },
              sheetName: { type: "string", title: "Sheet name" },
              headerStartingRowNumber: { type: "number", title: "Header starting row" },
              headerStartingColNumber: { type: "number", title: "Header starting column" },
              dataStartingRowNumber: { type: "number", title: "Data starting row" },
              propertyCodeRowNumber: { type: "number", title: "Property code row" },
            }
          }
        }
      }
    }
  }
}

class EditMatrixAnalysis extends React.Component {

  render() {

    const { matrixAnalysis } = this.props
    const { onChange, onSave, onCancel, onUploadNewFileRequest } = this.props

    return (
      <div className="row">
        <div className="col-12 text-center">
            <button
              className="btn btn-secondary"
              onClick={e => onUploadNewFileRequest()}>
              Upload new file</button>
            <hr/>
        </div>
        <div className="col-12">
            <Form
              showErrorList={false}
              formData={matrixAnalysis}
              ArrayFieldTemplate={ArrayFieldTemplate}
              onChange={f => onChange(f.formData)}
              schema={UpdateSchema}
              uiSchema={FormUi}
              liveValidate><button className="d-none"/></Form>
        </div>
        {/* Actions button */}
        <div className="col-12">
          <div className="text-right">
            <button
              className="btn btn-secondary mr-2"
              onClick={e => onCancel()}>Cancel</button>
            <button
              className={`btn btn-primary`}
              onClick={e => onSave()}>Save</button>
          </div>
        </div>
      </div>
    )
  }

}

export default EditMatrixAnalysis
