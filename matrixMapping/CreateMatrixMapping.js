import React from "react"
import Form from "react-jsonschema-form"
import map from "lodash/map"
import ArrayFieldTemplate from "../common/components/form/ArrayFieldTemplate"

const FormUi = {}

const getFormSchema = (tradeItemCategories, taxonomies) => { return {
  type: "object",
  required: ["mappingTitle", "taxonomyId", "tradeItemCategory"],
  title: "",
  properties: {
    mappingTitle: {type: "string", title: "Mapping name", minLength: 3},
    taxonomyId: {type: "string", title: "Taxonomy", enum: map(taxonomies, s => s.id), enumNames: map(taxonomies, s => s.name)},
    tradeItemCategory: {type: "object", title: "", properties: { code: {type: "string", title: "Trade Item Category", enum: map(tradeItemCategories, s => s.code.code), enumNames: map(tradeItemCategories, s => `${s.code.code} - ${s.name} (${s.unspsc})`)} }}
  }
}}

const validate = (formData, errors, isNameValid) => {
  if (!isNameValid) errors.mappingTitle.addError("must be unique and not empty")
  return errors
}

const CreateMatrixMapping = ({defaultMapping, tradeItemCategories, taxonomies, isNameValid, onChange, onCancel, onCreate}) => (
  <React.Fragment>
    <div className="row">
      <div className="col-12">
          <Form
            autocomplete="off"
            showErrorList={false}
            formData={defaultMapping}
            ArrayFieldTemplate={ArrayFieldTemplate}
            onChange={f => onChange(f.formData)}
            schema={getFormSchema(tradeItemCategories, taxonomies)}
            uiSchema={FormUi}
            validate={(formData, errors) => validate(formData, errors, isNameValid)}><button className="d-none"/></Form>
      </div>
      {/* Actions button */}
      <div className="col-12">
        <div className="text-right">
          <button
            className={`btn btn-primary ${isNameValid ? "" : "disabled"}`}
            onClick={e => isNameValid && onCreate()}>Save</button>
        </div>
      </div>
    </div>
  </React.Fragment>
)

export default CreateMatrixMapping
