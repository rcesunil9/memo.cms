import React from "react";
import get from "lodash/get";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import * as utils from "./../utils";
import Card from "../../common/components/layout/Card";
import Dropzone from "react-dropzone";

const MultipleImageForm = ({
  multipleImages,
  setMultipleImageForm,
  tradeItem,
  uploadButchImages,
  changeMultipleImageFormProperty,
  removeMultipleImageFormItem
}) => {
  const onDrop = acceptedFiles => {
    return map(acceptedFiles, file =>
      utils.getDefaultImageForMultiple(file, tradeItem)
    );
  };

  return (
    <Card>
      <form
        className="row"
        onSubmit={e => {
          e.preventDefault();
          uploadButchImages(multipleImages);
        }}
      >
        <div className="col-4">
          <div className="form-group">
            <label className="control-label">Image files*</label>

            {/* Dropzone */}
            <Dropzone
              name="Images"
              className="w-100 text-center bg-secondary text-white"
              onDrop={acceptedFiles => {
                setMultipleImageForm(onDrop(acceptedFiles));
                // setImageProperty("filename", get(acceptedFiles[0], "name"));
              }}
            >
              <p className="lead p-5">
                Please drop a image files, or click in this area to choose
                several.
              </p>
            </Dropzone>

            {/* Edit image preview */}
          </div>
        </div>
        <div className="col-8">
          <div className="form-group">
            <label className="control-label">Added files</label>
            <div className="row">
              <div className="col-4 text-center">Preview</div>
              <div className="col-6 text-center">Filename</div>
              <div className="col-2 text-center">Remove</div>
            </div>
            <hr className="col-12" />
            {!isEmpty(multipleImages) &&
              map(multipleImages, (image, index) => {
                return (
                  <div
                    className="row align-items-center mb-2"
                    key={`images-${index}`}
                  >
                    <div className="col-4 text-center">
                      <img
                        style={{
                          maxHeight: "100px",
                          maxWidth: "150px",
                          objectFit: "contain"
                        }}
                        className="h-100"
                        src={get(image, "file.preview")}
                        alt=""
                      />
                    </div>
                    <div className="col-6">
                      <input
                        className="form-control"
                        type="text"
                        value={get(image, "filename") || ""}
                        onChange={e =>
                          changeMultipleImageFormProperty(
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
                          removeMultipleImageFormItem(index);
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
            onClick={() => setMultipleImageForm()}
            className="btn btn-secondary ml-2 float-right"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary  float-right"
            disabled={isEmpty(multipleImages)}
          >
            Upload
          </button>
        </div>
      </form>
    </Card>
  );
};

export default MultipleImageForm;
