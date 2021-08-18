import React from "react";
import update from "immutability-helper";
import Dropzone from "react-dropzone";
import * as actions from "./actions";
import * as selectors from "./selectors";
import { connect } from "react-redux";
import get from "lodash/get";
import map from "lodash/map";
import {
  getDefaultExcelIncludeTemplateSheetMapping,
  makeOption,
  inputChanger,
  getDefaultSheetArea,
} from "./utils";
import find from "lodash/find";
import Select from "react-select";
import size from "lodash/size";
import filter from "lodash/filter";
import Tabs from "../common/components/tabs/Tabs";
import Tab from "../common/components/tabs/Tab";

class SheetConfigurationForm extends React.Component {

  render () {
    const {
      onChange,
      sheetConfiguration,
    } = this.props

    const onInput = inputChanger(sheetConfiguration, onChange)
    const push = (k, v) => onChange(update(sheetConfiguration, {[k]: {$push: v}}))

    return (
      <div>
        {/* Sheet index */}
        <div className="form-group">
          <label className="control-label">Sheet name*</label>
          <input
            className="form-control"
            required
            name="sheetName"
            value={sheetConfiguration.sheetName || ''}
            onChange={onInput}
          />
        </div>
        <div className="col">
          <button
            className="btn btn-link p-0"
            type="button"
            onClick={e => push('areas', [getDefaultSheetArea()])}
          >
            + Add new area
          </button>
        </div>
        <div className="form-group">
          <label className="control-label">Areas</label>
          <Areas
            sheetConfiguration={sheetConfiguration}
            onChange={onChange}
          />
        </div>
      </div>
    )
  }
}

const CustomListItem = ({ sheetMapping, onClick, onRemove, selected }) => (
  <div
    onClick={onClick}
    style={{ cursor: "pointer", height: "60px" }}
    className={`col-12 border p-2 ${selected ? "bg-surprise text-white" : ""}`}
  >
    <small>{`Sheet - ${get(sheetMapping, 'sheetName')}`}</small>
    <button
      onClick={e => {
        e.preventDefault();
        onRemove();
      }}
      className={`btn btn-link btn-sm p-0 float-right ${
        selected ? "bg-surprise text-white" : "text-danger"
      }`}
    >
      Remove
    </button>
  </div>
);

const SheetConfigurations = props => {
  const {
    list,
    onChange,
    setExcelSheetConfigurationMapping,
    sheetConfiguration,
  } = props;

  const reorganizeColumns = (newList, fromIndex, up) => {
    if (!window.confirm(`Do you want to reorganize columns?`)) return newList;
    if (fromIndex === size(newList) - 1) return newList;
    const src = get(newList, `[${fromIndex}]`, null);
    if (!src) return newList;
    return map(newList, (sheetMap, k) => {
      if (k <= fromIndex) return sheetMap;
      if (sheetMap.sheetIndex !== src.sheetConfiguration) return sheetMap;
      return update(sheetMap, {
        columnIndex: {
          $set: up ? sheetMap.columnIndex + 1 : sheetMap.columnIndex - 1 || 0
        }
      });
    });
  };
  const add = () => {
    const df = getDefaultExcelIncludeTemplateSheetMapping();
    setExcelSheetConfigurationMapping(df);
    onChange([...list, df]);
  };
  const remove = index => {
    if (size(list) > index + 1)
      setExcelSheetConfigurationMapping(list[index + 1]);
    else setExcelSheetConfigurationMapping(null);
    onChange(
      reorganizeColumns(
        [...list.slice(0, index), ...list.slice(index + 1)],
        index - 1 || 0,
        false
      )
    );
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12 mb-3">
          <button
            className="btn btn-sm btn-secondary"
            type="button"
            onClick={add}
          >
            + Add new sheet configuration
          </button>
        </div>
        <div className="col-6">
          {map(list, (listItemSheetMapping, tIndex) => (
            <CustomListItem
              key={`export-f-export-format-excel-list-${tIndex}`}
              selected={sheetConfiguration === listItemSheetMapping}
              onClick={e => setExcelSheetConfigurationMapping(list[tIndex])}
              onRemove={e => remove(tIndex)}
              sheetMapping={listItemSheetMapping}
              id={`export-format-excel-list-${tIndex}`}
            />
          ))}
        </div>

        <div className="col-6">
          {sheetConfiguration && filter(map(list, (columnMapping, i) => (sheetConfiguration === list[i] && (
            <div key={i} className="mb-2">

              {/* List */}
              <div className="row">
                <div className="col-12">
                  <SheetConfigurationForm
                    sheetConfiguration={sheetConfiguration}
                    onChange={configuration => {
                      setExcelSheetConfigurationMapping(configuration)
                      onChange(update(list, { [i]: { $set: configuration } }))
                    }}
                  />
                </div>
              </div>
            </div>
          )) || null))}
        </div>
      </div>
    </React.Fragment>
  );
};

const Areas = props => {
  const { sheetConfiguration, onChange } = props
  const { areas } = sheetConfiguration

  const change = (k, v, index) => {onChange(update(sheetConfiguration, {areas: {[index]: {[k]: {$set: v}}}}))}
  const changeRepetition = (k, v, index) => {onChange(update(sheetConfiguration, {areas: {[index]: { repetitionSettings : {[k]: {$set: v}}}}}))}
  let defaultTab = 0;
  const remove = index => {
    if (size(areas) > index + 1)
      defaultTab = index - 1;
    else defaultTab = 0;
    onChange(update(sheetConfiguration, {areas: {$set: [...areas.slice(0, index), ...areas.slice(index + 1)]}}));
  };


  return <Tabs activeTab={{id: `${defaultTab}`}}>
    {map(areas, (item, index) => {
        return <Tab id={`${index}`} title={index} key={index}>
          <React.Fragment>
            <div className="form-group">
              <label className="control-label">Starting cell</label>
              <input
                className="form-control"
                name="startingCell"
                value={get(item, 'startingCell', '')}
                required
                onChange={e => change('startingCell', e.target.value, index)}/>
            </div>
            <div className="form-group">
              <label className="control-label">Ending cell</label>
              <input
                className="form-control"
                name="endingCell"
                value={get(item, 'endingCell', '')}
                required
                onChange={e => change('endingCell', e.target.value, index)}/>
            </div>
            <div className="form-group">
              <label className="control-label">Condition</label>
              <input
                className="form-control"
                name="condition"
                value={get(item, 'condition', '')}
                required
                onChange={e => change('condition', e.target.value, index)}/>
            </div>
            <div className="form-group">
              <label className="control-label">Array path</label>
              <input
                className="form-control"
                name="arrayPath"
                value={get(item, 'arrayPath', '')}
                required
                onChange={e => change('arrayPath', e.target.value, index)}/>
            </div>
            <div className="form-group">
              <label className="control-label">Number of columns</label>
              <input
                type="number"
                className="form-control"
                name="numberOfColumns"
                value={get(item, 'repetitionSettings.numberOfColumns', '')}
                required
                onChange={e => changeRepetition('numberOfColumns', e.target.value, index)}/>
            </div>
            <div className="form-group">
              <label className="control-label">Number of rows</label>
              <input
                type="number"
                className="form-control"
                name="numberOfRows"
                value={get(item, 'repetitionSettings.numberOfRows', '')}
                required
                onChange={e => changeRepetition('numberOfRows', e.target.value, index)}/>
            </div>
          </React.Fragment>
          <button
            onClick={e => {
              e.preventDefault();
              remove(index)
            }}
            className="btn btn-sm btn-danger"
          >
            Delete
          </button>
        </Tab>
      }
    )}
  </Tabs>
};

const ExcelIncludingTemplateFormatConfiguration = props => {

  const {
    configuration,
    businessRulesets,
    propertyGroups,
    sheetConfiguration,
    setExcelSheetConfigurationMapping,
    onChange,
    properties,
    loadProperties
  } = props;

  const change = (k, v) =>
    onChange(update(configuration, { [k]: { $set: v } }));
  const attachFile = file => change("fileLocation", get(file, 'preview'));

  return (
    <React.Fragment>
      <div className="form-group">
        <Dropzone
          className="w-100 text-center p-5 bg-secondary text-white"
          onDrop={acceptedFiles => attachFile(acceptedFiles[0])}
        >
          <p className="lead m-0">
            Please drop a matrix file, or click in this area to choose one.
          </p>
          {get(configuration, "fileLocation", null) ? (
            <div className="text-success">
              <i>File exists</i>
            </div>
          ) : (
            <div className="text-danger">
              <i>No file</i>
            </div>
          )}
          {!get(configuration, "fileLocation.preview", null) &&
            get(configuration, "fileLocation", null) && (
              <div className="text-success">
                <i>{get(configuration, "fileLocation", null)}</i>
              </div>
            )}
        </Dropzone>

        {/* Business rules set */}
        <div className="form-group">
          <label className="control-label">Business rules set*</label>
          <Select
            options={map(businessRulesets, makeOption)}
            value={makeOption(
              find(businessRulesets, ["id", configuration.businessRuleSetId])
            )}
            onChange={option => change("businessRuleSetId", option.value)}
          />
        </div>
      </div>

      <SheetConfigurations
        properties={properties}
        sheetConfiguration={sheetConfiguration}
        setExcelSheetConfigurationMapping={setExcelSheetConfigurationMapping}
        list={get(configuration, "sheetConfigurations", [])}
        businessRulesets={businessRulesets}
        propertyGroups={propertyGroups}
        onGroupChange={group => loadProperties()}
        onChange={list =>
          onChange(
            update(configuration, { sheetConfigurations: { $set: list } })
          )
        }
      />
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    sheetConfiguration: selectors.getExcelSheetConfiguration(state),
    properties: selectors.getMergedTradeItemProperties(state)
  };
};

export default connect(
  mapStateToProps,
  actions
)(ExcelIncludingTemplateFormatConfiguration);
