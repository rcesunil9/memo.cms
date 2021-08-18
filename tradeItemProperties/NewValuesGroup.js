import React from "react"


const NewValuesGroup = ({onSave, onCancel, onChange, valueGroup}) => (
  <React.Fragment>
    <div className="row">
      <div className="col">
        <textarea
          rows={10}
          className="form-control"
          onChange={e => onChange(e.target.value)}>
          {valueGroup}
        </textarea>
      </div>
    </div>
    <div className="form-group d-flex justify-content-end mt-3">
      <button className="btn btn-secondary mr-2" type="button" onClick={onCancel}>
        Cancel
      </button>
      <button className="btn btn-primary" type="submit" onClick={onSave}>
        Save
      </button>
    </div>
  </React.Fragment>

)

export default NewValuesGroup
