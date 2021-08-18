import React from "react";
import get from "lodash/get";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import * as utils from "./../utils";
import Card from "../../common/components/layout/Card";
import Dropzone from "react-dropzone";

const MultipleDocumentForm = ({
  multipleDocuments,
  tradeItem,
  uploadButchDocuments,
  setMultipleDocumentsForm,
  changeMultipleDocumentFormProperty,
  removeMultipleDocumentFormItem
}) => {
  const onDrop = acceptedFiles => {
    return map(acceptedFiles, file =>
      utils.getDefaultDocumentForMultiple(file, tradeItem)
    );
  };

  return (
    <Card>
      <form
        className="row"
        onSubmit={e => {
          e.preventDefault();
          uploadButchDocuments(multipleDocuments);
        }}
      >
        <div className="col-4">
          <div className="form-group">
            <label className="control-label">Document files*</label>

            {/* Dropzone */}
            <Dropzone
              name="Documents"
              className="w-100 text-center bg-secondary text-white"
              onDrop={acceptedFiles => {
                setMultipleDocumentsForm(onDrop(acceptedFiles));
              }}
            >
              <p className="lead p-5">
                Please drop document files, or click in this area to choose
                several.
              </p>
            </Dropzone>

            {/* Edit document preview */}
          </div>
        </div>
        <div className="col-8">
          <div className="form-group">
            <label className="control-label">Added files</label>
            <div className="row">
              <div className="col-10 text-center">Filename</div>
              <div className="col-2 text-center">Remove</div>
            </div>
            <hr className="col-12" />
            {!isEmpty(multipleDocuments) &&
              map(multipleDocuments, (doc, index) => {
                return (
                  <div
                    className="row align-items-center mb-2"
                    key={`document-${index}`}
                  >
                    <div className="col-10">
                      <input
                        className="form-control"
                        type="text"
                        value={get(doc, "filename") || ""}
                        onChange={e =>
                          changeMultipleDocumentFormProperty(
                            `${index}.filename`,
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-2 text-center">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={e => {
                          e.preventDefault();
                          removeMultipleDocumentFormItem(index);
                        }}
                      >
                        x
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="col">
          <button
            type="button"
            onClick={() => setMultipleDocumentsForm()}
            className="btn btn-secondary ml-2 float-right"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary  float-right"
            disabled={isEmpty(multipleDocuments)}
          >
            Upload
          </button>
        </div>
      </form>
    </Card>
  );
};

export default MultipleDocumentForm;
