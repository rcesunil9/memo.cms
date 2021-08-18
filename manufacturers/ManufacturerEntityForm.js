import update from "immutability-helper";
import filter from "lodash/filter";
import get from "lodash/get";
import find from "lodash/find";
import indexOf from "lodash/indexOf";
import map from "lodash/map";
import React from "react";
import Select from "react-select";
import LanguageSelect from "../common/components/lang/LanguageSelect";
import {
  getSelectedOption,
  inputChanger,
  optionChanger,
  getNewImageType
} from "./utils";
import dotProp from "dot-prop-immutable";

const ManufacturerEntityForm = props => {
  const {
    entity,
    onChange,
    onSave,
    onCancel,
    onPollingRequested,
    matrixMappings,
    targetMarkets,
    taxonomies,
    languages,
    businessRulesSets,
    retailers,
    imageCategories
  } = props;

  const changeFTPSettings = settings => {
    onChange(
      update(entity, {
        importSettings: { ftpConnectionSettings: { $set: settings } }
      })
    );
  };
  const changeImportSettings = settings => {
    onChange(update(entity, { importSettings: { $set: settings } }));
  };
  const changeExportSettings = settings => {
    onChange(update(entity, { exportSettings: { $set: settings } }));
  };
  const changeBusinessRulesSet = v => {
    onChange(
      update(entity, {
        importSettings: { businessRulesIds: { $set: map(v, r => r.id) } }
      })
    );
  };
  const changeRetailers = v => {
    onChange(update(entity, { retailerIds: { $set: map(v, r => r.id) } }));
  };

  const save = e => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={save}>
      {/* Actions cancel/save */}
      <button type="submit" className="btn btn-primary mb-3 mr-2">{`${
        entity.id ? "Save" : "Create"
      }`}</button>
      <button
        type="button"
        onClick={onCancel}
        className="btn btn-secondary mb-3"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onPollingRequested}
        className="float-right btn btn-light mb-3"
      >
        Trigger polling
      </button>

      <div className="form-group field field-object">
        <fieldset>
          <legend>Manufacturer entity information</legend>

          {/* Entity data */}
          {entity.id && (
            <div className="form-group field field-string">
              <label className="control-label">Manufacturer entity ID</label>
              <input className="form-control" value={entity.id} disabled />
            </div>
          )}
          <div className="form-group field field-string">
            <label className="control-label">Name*</label>
            <input
              className="form-control"
              name="name"
              value={entity.name}
              required
              onChange={inputChanger(entity, onChange)}
            />
          </div>

          {/* Retailers network */}
          <div className="form-group mb-3">
            <label className="control-label">Retailers network</label>
            <Select
              isMulti
              closeMenuOnSelect={false}
              value={filter(
                retailers,
                r => indexOf(get(entity, "retailerIds", []), r.id) !== -1
              )}
              onChange={changeRetailers}
              isClearable={true}
              getOptionLabel={o => o.name}
              getOptionValue={o => o.id}
              options={retailers}
            />
          </div>

          {/* Import settings */}
          <div className="form-group field field-object">
            <ImportSettingsForm
              settings={entity.importSettings}
              onChange={changeImportSettings}
              {...{ matrixMappings, targetMarkets, taxonomies, languages, imageCategories }}
            />
          </div>

          {/* Export setting */}
          <div className="form-group field field-object">
            <ExportSettingsForm
              settings={entity.exportSettings || {}}
              onChange={changeExportSettings}
              {...{ matrixMappings, targetMarkets, languages, imageCategories }}
            />
          </div>

          <div className="form-group field field-object">
            <FTPSettingsForm
              settings={entity.importSettings.ftpConnectionSettings}
              onChange={changeFTPSettings}
            />
          </div>
        </fieldset>
      </div>

      {/* Business rules sets */}
      <div className="form-group mb-3">
        <label className="control-label">Business rules sets</label>
        <Select
          isMulti
          closeMenuOnSelect={false}
          value={filter(
            businessRulesSets,
            r =>
              indexOf(
                get(entity, "importSettings.businessRulesIds", []),
                r.id
              ) !== -1
          )}
          onChange={changeBusinessRulesSet}
          isClearable={true}
          getOptionLabel={o => o.name}
          getOptionValue={o => o.id}
          options={businessRulesSets}
        />
      </div>

      {/* Actions cancel/save */}
      <button type="submit" className="btn btn-primary mr-2">{`${
        entity.id ? "Save" : "Create"
      }`}</button>
      <button type="button" onClick={onCancel} className="btn btn-secondary">
        Cancel
      </button>
    </form>
  );
};

const ExportSettingsForm = ({ settings, onChange }) => {
  return (
    <fieldset>
      <legend id="root_exportSettings__title">Export settings</legend>
      {/* Resource base URL */}
      <div className="form-group field field-string">
        <label className="control-label">Resource base URL</label>
        <input
          className="form-control"
          name="baseUrl"
          value={settings.baseUrl || ""}
          onChange={inputChanger(settings, onChange)}
        />
      </div>
    </fieldset>
  );
};

const ImportSettingsForm = ({
  settings,
  matrixMappings,
  targetMarkets,
  taxonomies,
  languages,
  imageCategories,
  onChange
}) => {
  const change = (k, v) => onChange(dotProp.set(settings, k, v));

  return (
    <fieldset>
      <legend id="root_importSettings__title">Import settings</legend>

      {/* Matrix mapping */}
      <div className="form-group field field-string">
        <label className="control-label">Matrix mapping</label>
        <Select
          value={getSelectedOption(settings.matrixMappingId, matrixMappings)}
          onChange={optionChanger(settings, "matrixMappingId", onChange)}
          isSearchable={true}
          options={matrixMappings}
        />
      </div>

      {/* Default import language */}
      <div className="form-group field field-string">
        <label className="control-label">Default import language*</label>
        <LanguageSelect
          value={getSelectedOption(settings.defaultImportLanguageId, languages)}
          onChange={optionChanger(
            settings,
            "defaultImportLanguageId",
            onChange
          )}
          isSearchable={true}
          options={languages}
        />
      </div>

      {/* Taxonomy */}
      <div className="form-group field field-string">
        <label className="control-label">Taxonomy</label>
        <Select
          isClearable={true}
          options={taxonomies}
          value={getSelectedOption(
            settings.taxonomyId,
            taxonomies
          )}
          onChange={option =>
            onChange(
              update(settings, {
                taxonomyId: {
                  $set: option ? option.value : null
                }
              })
            )
          }
          isSearchable={true}
        />
      </div>

      {/* Default target market */}
      <div className="form-group field field-string">
        <label className="control-label">Default target market</label>
        <Select
          isClearable={true}
          options={targetMarkets}
          value={getSelectedOption(
            settings.defaultImportTargetMarketId,
            targetMarkets
          )}
          onChange={option =>
            onChange(
              update(settings, {
                defaultImportTargetMarketId: {
                  $set: option ? option.value : null
                }
              })
            )
          }
          isSearchable={true}
        />
      </div>

      {/* Media directory */}
      <div className="form-group field field-string">
        <label className="control-label">Media directory</label>
        <input
          className="form-control"
          name="mediaDirectory"
          value={settings.mediaDirectory || ""}
          onChange={inputChanger(settings, onChange)}
        />
      </div>

      {/* fullMediaDirectory */}
      <div className="form-group field field-string">
        <label className="control-label">Full media directory</label>
        <input
          className="form-control"
          name="fullMediaDirectory"
          value={settings.fullMediaDirectory || ""}
          onChange={inputChanger(settings, onChange)}
        />
      </div>

      {/* Images regex */}
      <div className="form-group field field-string">
        <label className="control-label">Images regex</label>
        <input
          className="form-control"
          name="imageRegex"
          value={settings.imageRegex || ""}
          onChange={inputChanger(settings, onChange)}
        />
      </div>

      {/* Images Types */}
      <div className="form-group field field-string">
        <label className="control-label">Image Type Mappings</label>

        <button
          className="btn btn-secondary mt-2 mb-3 d-block"
          onClick={e => {
            e.preventDefault();
            change("imageTypeMappings", [
              ...get(settings, "imageTypeMappings", []),
              getNewImageType()
            ]);
          }}
        >
          + Add new image type mapping
        </button>

        {map(
          get(settings, "imageTypeMappings", []),
          (imageType, imageTypeKey) => (
            <div
              key={`image-type-${imageTypeKey}`}
              className="form-row align-items-center mb-3"
            >
              <div className="col-sm-4">
                <Select
                  options={imageCategories}
                  value={find(
                    imageCategories,
                    cat => cat.value === imageType.imageCategory
                  )}
                  onChange={option =>
                    change(
                      "imageTypeMappings",
                      dotProp.set(
                        settings.imageTypeMappings,
                        `${imageTypeKey}.imageCategory`,
                        option.value
                      )
                    )
                  }
                  isSearchable={true}
                />
              </div>
              <div className="col-sm-6">
                <input
                  className="form-control"
                  type="text"
                  value={imageType.value || ""}
                  onChange={e =>
                    change(
                      "imageTypeMappings",
                      dotProp.set(
                        settings.imageTypeMappings,
                        `${imageTypeKey}.value`,
                        e.target.value
                      )
                    )
                  }
                />
              </div>

              <div className="col-sm-2">
                <button
                  onClick={e => {
                    e.preventDefault();
                    change(`imageTypeMappings`, [
                      ...get(settings, `imageTypeMappings`, []).slice(
                        0,
                        imageTypeKey
                      ),
                      ...get(settings, `imageTypeMappings`, []).slice(
                        imageTypeKey + 1
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

      {/* Video regex */}
      <div className="form-group field field-string">
        <label className="control-label">Video regex</label>
        <input
          className="form-control"
          name="videoRegex"
          value={settings.videoRegex || ""}
          onChange={inputChanger(settings, onChange)}
        />
      </div>

      {/* Matrix regex */}
      <div className="form-group field field-string">
        <label className="control-label">Matrix regex</label>
        <input
          className="form-control"
          name="matrixRegex"
          value={settings.matrixRegex || ""}
          onChange={inputChanger(settings, onChange)}
        />
      </div>
    </fieldset>
  );
};

const FTPSettingsForm = ({ settings, onChange }) => {
  const change = inputChanger(settings, onChange);
  const changePassword = val =>
    onChange(update(settings, { password: { $set: val } }));
  return (
    <fieldset>
      <legend>FTP connection strings</legend>

      {/* URL */}
      <div className="form-group field field-string">
        <label className="control-label">URL</label>
        <input
          className="form-control"
          name="url"
          value={settings.url}
          onChange={change}
        />
      </div>

      {/* Username */}
      <div className="form-group field field-string">
        <label className="control-label">Username</label>
        <input
          className="form-control"
          name="username"
          value={settings.username}
          onChange={change}
        />
      </div>

      {/* Password */}
      <div className="form-group field field-string">
        <label className="control-label">Password</label>
        <input
          className="form-control"
          type="text"
          value={settings.password}
          onChange={e => changePassword(e.target.value)}
        />
      </div>

      {/* Path */}
      <div className="form-group field field-string">
        <label className="control-label">Path</label>
        <input
          className="form-control"
          name="path"
          value={settings.path}
          onChange={change}
        />
      </div>
    </fieldset>
  );
};

export default ManufacturerEntityForm;
