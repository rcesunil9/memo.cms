import React from "react";
import { connect } from "react-redux";
import Select from "react-select";
import dotProp from "dot-prop-immutable";
import get from "lodash/get";
import map from "lodash/map";
import filter from "lodash/filter";
import find from "lodash/find";
import join from "lodash/join";
import split from "lodash/split";
import SelectString from "../../common/components/form/SelectString";
import * as actions from "../actions";
import * as selectors from "../selectors";
import {
  getNewImageProcessExportAction,
  getNewImageResolution,
  getNewImageCategoryFilter
} from "../utils";

const ImageCategoryFilter = React.memo(
  ({ imageCategory, number, imageCategories, onChange }) => {
    return (
      <div className="row">
        <div className="col-8">
          <SelectString
            placeholder="Image category..."
            closeMenuOnSelect={true}
            options={imageCategories}
            value={imageCategory || null}
            onChange={value => onChange({ imageCategory: value })}
          />
        </div>
        <div className="col-4">
          <input
            placeholder="Number..."
            className="form-control"
            value={number || ""}
            onChange={e =>
              onChange({
                number: e.currentTarget.value
                  ? parseInt(e.currentTarget.value)
                  : null
              })
            }
          />
        </div>
      </div>
    );
  }
);

class ExportTradeItemImageActionViewModel extends React.Component {
  componentDidMount() {
    this.init();
  }

  async init() {
    const { model } = this.props;
    const { loadExportImageActionDependencies, setAction } = this.props;
    if (!get(model, "id", null)) setAction(getNewImageProcessExportAction());
    await loadExportImageActionDependencies();
  }

  render() {
    const props = this.props;
    const {
      model,
      transportConfigurations,
      imageCategories,
      colorSpaces
    } = props;
    const { onChange } = props;

    const change = (k, v) => onChange(dotProp.set(model, k, v));

    const backgroundColorValues = join(model.backgroundColors, ",");

    return (
      <React.Fragment>
        {/* transportConfigurationIds	array string($uuid) */}
        <div className="form-group">
          <label className="control-label">Transport configuration*</label>
          <Select
            closeMenuOnSelect={false}
            isMulti={true}
            getOptionLabel={o => o.name}
            getOptionValue={o => o.id}
            options={transportConfigurations}
            name="transportConfigurationId"
            value={filter(transportConfigurations, transportConfiguration =>
              find(
                get(model, "transportConfigurationIds", []),
                transportConfigurationId =>
                  transportConfigurationId === transportConfiguration.id
              )
            )}
            onChange={values =>
              change(
                "transportConfigurationIds",
                values === null ? null : map(values, value => value.id)
              )
            }
          />
        </div>

        {/* Image category filters */}
        <div className="form-group">
          <label className="control-label d-block">
            Images categories filter
          </label>

          <button
            className="btn btn-secondary mt-2 mb-3"
            onClick={e => {
              e.preventDefault();
              change("categoryFilters", [
                ...get(model, "categoryFilters", []),
                getNewImageCategoryFilter()
              ]);
            }}
          >
            + Add new image category filter
          </button>

          {map(
            get(model, "categoryFilters", []),
            (categoryFilter, categoryFilterIdx) => (
              <div
                key={`category-filter-${categoryFilterIdx}`}
                className="form-row align-items-center mb-3"
              >
                <div className="col-sm-10">
                  <ImageCategoryFilter
                    imageCategories={imageCategories}
                    onChange={o => {
                      change(`categoryFilters`, [
                        ...get(model, `categoryFilters`, []).slice(0, categoryFilterIdx),
                        { ...categoryFilter, ...o },
                        ...get(model, `categoryFilters`, []).slice(categoryFilterIdx + 1
                        )
                      ]);
                    }}
                    {...categoryFilter}
                  />
                </div>
                <div className="col-sm-2">
                  <button
                    onClick={e => {
                      e.preventDefault();
                      change(`categoryFilters`, [
                        ...get(model, `categoryFilters`, []).slice(
                          0,
                          categoryFilterIdx
                        ),
                        ...get(model, `categoryFilters`, []).slice(
                          categoryFilterIdx + 1
                        )
                      ]);
                    }}
                    className="btn btn-sm btn-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* colorSpaces */}
        <div className="form-group">
          <label className="control-label">Color spaces</label>
          <SelectString
            closeMenuOnSelect={false}
            isMulti={true}
            isClearable={true}
            options={colorSpaces}
            value={get(model, "colorSpaces") || []}
            onChange={value => change("colorSpaces", value)}
          />
        </div>

        {/* Image resolutions */}
        <div className="form-group">
          <label className="control-label d-block">Resolutions</label>

          <button
            className="btn btn-secondary mt-2 mb-3"
            onClick={e => {
              e.preventDefault();
              change("imageResolutions", [
                ...get(model, "imageResolutions", []),
                getNewImageResolution()
              ]);
            }}
          >
            + Add new image resolution
          </button>

          {map(
            get(model, "imageResolutions", []),
            (imageResolution, imageResolutionKey) => (
              <div
                key={`image-resolution-${imageResolutionKey}`}
                className="form-row align-items-center mb-3"
              >
                <div className="col-sm-3">
                  <input
                    placeholder="Width"
                    onChange={e =>
                      change(
                        "imageResolutions",
                        dotProp.set(
                          model.imageResolutions,
                          `${imageResolutionKey}.width`,
                          e.target.value
                        )
                      )
                    }
                    value={imageResolution.width || ""}
                    className="form-control"
                    type="text"
                  />
                </div>

                <div className="col-sm-3">
                  <input
                    placeholder="Height"
                    onChange={e =>
                      change(
                        "imageResolutions",
                        dotProp.set(
                          model.imageResolutions,
                          `${imageResolutionKey}.height`,
                          e.target.value
                        )
                      )
                    }
                    value={imageResolution.height || ""}
                    className="form-control"
                    type="text"
                  />
                </div>

                <div className="col-sm-4">
                  <input
                    placeholder="Name"
                    required
                    onChange={e =>
                      change(
                        "imageResolutions",
                        dotProp.set(
                          model.imageResolutions,
                          `${imageResolutionKey}.name`,
                          e.target.value
                        )
                      )
                    }
                    value={imageResolution.name || ""}
                    className="form-control"
                    type="text"
                  />
                </div>

                <div className="col-sm-2">
                  <button
                    onClick={e => {
                      e.preventDefault();
                      change(`imageResolutions`, [
                        ...get(model, `imageResolutions`, []).slice(
                          0,
                          imageResolutionKey
                        ),
                        ...get(model, `imageResolutions`, []).slice(
                          imageResolutionKey + 1
                        )
                      ]);
                    }}
                    className="btn btn-sm btn-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* background colors */}
        <div className="form-group">
          <label className="control-label">
            Background colors (format: #xxxxxxyy, with 'x'='hex color',
            'y'='alpha level', e.g.: #ffffff00 = 'transparent white')
          </label>
          <textarea
            className="form-control"
            value={backgroundColorValues}
            onChange={e =>
              e.currentTarget.value
                ? change(
                    "backgroundColors",
                    split(e.currentTarget.value, /[\s,\n\t;]/)
                  )
                : change("backgroundColors", null)
            }
          />
        </div>

        {/* min resolution */}
        <div className="form-group">
          <div className="row">
            {/* min width */}
            <div className="col">
              <label className="control-label">Min width</label>
              <input
                className="form-control"
                value={model.minimumWidth || ""}
                onChange={e =>
                  change(
                    "minimumWidth",
                    e.currentTarget.value
                      ? parseInt(e.currentTarget.value)
                      : null
                  )
                }
              />
            </div>
            {/* min height */}
            <div className="col">
              <label className="control-label">Min height</label>
              <input
                className="form-control"
                value={model.minimumHeight || ""}
                onChange={e =>
                  change(
                    "minimumHeight",
                    e.currentTarget.value
                      ? parseInt(e.currentTarget.value)
                      : null
                  )
                }
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    transportConfigurations: selectors.getTransportConfigurations(state),
    imageCategories: selectors.getImageCategories(state),
    colorSpaces: selectors.getColorSpaces(state)
  };
};

export default connect(
  mapStateToProps,
  actions
)(ExportTradeItemImageActionViewModel);
