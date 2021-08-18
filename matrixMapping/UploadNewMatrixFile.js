import React from "react"
import get from "lodash/get"
import isEmpty from "lodash/isEmpty"
import Dropzone from 'react-dropzone'

class UploadNewMatrixFile extends React.Component {

  render() {
    const { fileData } = this.props
    const { onCancel, onUpload, onChange } = this.props

    return (
      <div className="row">
        <div className="col-12">
          <Dropzone
            className="w-100 text-center p-5 bg-secondary text-white"
            onDrop={(acceptedFiles, rejectedFiles) => onChange(get(acceptedFiles, "[0]", null))}>
            <p className="lead m-0">Please drop a matrix file, or click in this area to choose one.</p>
            {!isEmpty(fileData) && <div>{`${fileData.name}`}</div>}
          </Dropzone>
        </div>
        {/* Actions button */}
        <div className="col-12 pt-5">
          <div className="text-right">
            <button
              className="btn btn-secondary mr-2"
              onClick={e => onCancel()}>Cancel</button>
            <button
              className={`btn btn-primary ${isEmpty(fileData) ? "disabled" : ""}`}
              onClick={e => !isEmpty(fileData) && onUpload()}>Upload</button>
          </div>
        </div>
      </div>
    )
  }

}

export default UploadNewMatrixFile
