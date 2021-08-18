import React from "react";
import get from "lodash/get";
import map from "lodash/map";
import find from "lodash/find";
import Card from "../../common/components/layout/Card";
import { RequiredSelectInputWrap } from "../../common/components/form/RequiredSelecInputWrap";
import Dropzone from "react-dropzone";
import * as utils from '../utils'
import Channel from './Channel'
import Select from "react-select"

const ImageForm = ({
  imageEdit,
  targetMarkets,
  retailers,
  currentImageEditIndex,
  currentImageEditChannels,
  imageCategories,
  imagePlungeAngles,
  imageFacingTypes,
  setImageProperty,
  deleteImageProperty,
  mergeImageProperty,
  createImage,
  updateImage,
  resetEditImage,
  setMultipleImageForm,
  setTradeItemProperty
}) => {
  return (
    <Card>
      <form
        className="row"
        onSubmit={e => {
          e.preventDefault();
          if (get(imageEdit, "id")) {
            updateImage(imageEdit);
          } else createImage(imageEdit);
        }}
      >
        <div className="col-6">
          <div className="form-group">
            <label className="control-label">Image file*</label>

            {/* Dropzone */}
            {!get(imageEdit, "id") && (
              <Dropzone
                name="Image"
                className="w-100 text-center bg-secondary text-white"
                onDrop={acceptedFiles => {
                  setImageProperty("file", acceptedFiles[0]);
                  setImageProperty("filename", get(acceptedFiles[0], "name"));
                }}
              >
                {get(imageEdit, "file", null) ? (
                  <img
                    className="w-100"
                    src={get(imageEdit, "file.preview")}
                    alt=""
                  />
                ) : (
                  <p className="lead p-5">
                    Please drop a image file, or click in this area to choose
                    one.
                  </p>
                )}
              </Dropzone>
            )}

            {/* Edit image preview */}
            {get(imageEdit, "storageInformation.publicUri") && (
              <img
                className="w-100"
                src={get(imageEdit, "storageInformation.publicUri")}
                alt=""
              />
            )}
          </div>
          <div className="form-group">
            <label className="control-label">Channels</label>
            <Channel
              channels={currentImageEditChannels}
              targetMarkets={targetMarkets}
              retailers={retailers}
              onChange={value => setTradeItemProperty(utils.getTradeItemChannelKey('Images', currentImageEditIndex), value)}
            />
          </div>
        </div>
        <div className="col-6">
          {/* Image Id */}
          <div className="form-group">
            <label className="control-label">Id</label>
            <input
              value={get(imageEdit, "id") || ""}
              className="form-control"
              readOnly
            />
          </div>

          {/* File name */}
          <div className="form-group">
            <label className="control-label">File name*</label>
            <input
              value={get(imageEdit, "filename") || ""}
              className="form-control"
              required
              onChange={e => setImageProperty("filename", e.target.value)}
            />
          </div>

          {/* Index */}
          <div className="form-group">
            <label className="control-label">Index*</label>
            <input
              value={get(imageEdit, "index") || 0}
              className="form-control"
              type="number"
              required
              onChange={e => setImageProperty("index", e.target.value)}
            />
          </div>

          {/* Image Category */}
          <div className="form-group">
            <label className="control-label">Image Category*</label>
            <RequiredSelectInputWrap
              getOptionLabel={c => c.label}
              getOptionValue={c => c.value}
              options={imageCategories}
              required
              value={find(
                imageCategories,
                cat => cat.value === get(imageEdit, "imageCategory")
              )}
              onChange={val => setImageProperty("imageCategory", val.value)}
            />
          </div>

          {/* Plunge angle */}
          <div className="form-group">
            <label className="control-label">Plunge angles</label>
            <Select
              getOptionLabel={c => c.label}
              getOptionValue={c => c.value}
              options={imagePlungeAngles}
              value={find(
                imagePlungeAngles,
                cat => cat.value === get(imageEdit, "plungeAngle")
              )}
              onChange={t => {
                  console.log(t)
                  setImageProperty("plungeAngle", t.value || null)}
                }
              />
          </div>

          {/* Facing type */}
          <div className="form-group">
            <label className="control-label">Facing type</label>
            <Select
              getOptionLabel={c => c.label}
              getOptionValue={c => c.value}
              options={imageFacingTypes}
              value={find(
                imageFacingTypes,
                cat => cat.value === get(imageEdit, "facingType")
              )}
              onChange={t => {
                  console.log(t)
                  setImageProperty("facingType", t.value || null)}
                }
              />
          </div>

          {/* Not definitive */}
          <div className="form-group">
            <label>Not definitive</label>
            <input
              onChange={e => setImageProperty('notDefinitive', e.target.checked)}
              checked={get(imageEdit, 'notDefinitive') || false}
              className="form-control"
              type="checkbox"/>
          </div>

          {/* Not definitive */}
          <div className="form-group">
            <label>Not exportable</label>
            <input
              onChange={e => setImageProperty('notExportable', e.target.checked)}
              checked={get(imageEdit, 'notExportable') || false}
              className="form-control"
              type="checkbox"/>
          </div>

          {/* Language codes */}
          <div className="form-group">
            <label className="control-label">Language codes*</label>
            {map(get(imageEdit, "languageCodes"), (code, langIndex) => {
              return (
                <div className="row mb-2" key={`languageCodes.${langIndex}`}>
                  <div className="col">
                    <input
                      className="form-control"
                      type="text"
                      onChange={e =>
                        setImageProperty(
                          `languageCodes.${langIndex}`,
                          e.target.value
                        )
                      }
                      value={code || ""}
                    />
                  </div>
                  <div className="col-2">
                    <button
                      onClick={e =>
                        deleteImageProperty(`languageCodes.${langIndex}`)
                      }
                      className="btn btn-danger btn-sm"
                    >
                      x
                    </button>
                  </div>
                </div>
              );
            })}
            {/* Add new item */}
            <button
              onClick={e => {
                e.preventDefault();
                mergeImageProperty("languageCodes", [""]);
              }}
              className="btn btn-link btn-sm p-0 d-block"
            >
              Add new item
            </button>
          </div>

          {/* Retailers codes */}
          <div className="form-group">
            <label className="control-label">Retailers codes*</label>
            {map(get(imageEdit, "retailerCodes"), (code, langIndex) => {
              return (
                <div className="row mb-2" key={`retailerCodes.${langIndex}`}>
                  <div className="col">
                    <input
                      className="form-control"
                      type="text"
                      onChange={e =>
                        setImageProperty(
                          `retailerCodes.${langIndex}`,
                          e.target.value
                        )
                      }
                      value={code || ""}
                    />
                  </div>
                  <div className="col-2">
                    <button
                      onClick={e =>
                        deleteImageProperty(`retailerCodes.${langIndex}`)
                      }
                      className="btn btn-danger btn-sm"
                    >
                      x
                    </button>
                  </div>
                </div>
              );
            })}
            {/* Add new item */}
            <button
              onClick={e => {
                e.preventDefault();
                mergeImageProperty("retailerCodes", [""]);
              }}
              className="btn btn-link btn-sm p-0 d-block"
            >
              Add new item
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="col">
          <button
            type="button"
            onClick={() => {
              setMultipleImageForm();
              resetEditImage();
            }}
            className="btn btn-secondary ml-2 float-right"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary  float-right">
            {get(imageEdit, "id") ? "Update" : "Upload"}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default ImageForm;
