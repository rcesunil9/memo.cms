import React from "react"

const DuplicateMatrixMapping = ({onDuplicateNameChanged, onDuplicate, onCancel, isDuplicateNameValid, duplicateName}) => (
  <React.Fragment>
    <div className="form-group">
      <label htmlFor="duplicate-name">Name</label>
      <input
        value={duplicateName}
        onChange={e => onDuplicateNameChanged(e.target.value)}
        type="text"
        className={`form-control ${isDuplicateNameValid ? "" : "is-invalid"}`}
        id="duplicate-name" />
      {!isDuplicateNameValid && <div className="invalid-feedback">Mapping name must be unique and not be empty.</div>}
    </div>
    <div className="pt-5">
      <div className="text-right">
        <button
          className="btn btn-secondary mr-2"
          onClick={e => onCancel()}>Cancel</button>
        <button
          className={`btn btn-primary ${isDuplicateNameValid ? "" : "disabled"}`}
          onClick={e => isDuplicateNameValid && onDuplicate()}>Duplicate</button>
      </div>
    </div>
  </React.Fragment>
)

export default DuplicateMatrixMapping
