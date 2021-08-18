import React from "react";
import { connect } from "react-redux";
import Select from "react-select";
import dotProp from "dot-prop-immutable";
import get from "lodash/get";
import filter from "lodash/filter";
import indexOf from "lodash/indexOf";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import find from "lodash/find";
import reduce from "lodash/reduce";
import orderBy from "lodash/orderBy";
import LanguageSelect from "../../common/components/lang/LanguageSelect";
import { inputChanger, SelectObject } from "../utils";
import * as actions from "../actions";
import * as selectors from "../selectors";
import { Link } from "react-router-dom";
import Modal from "../../common/components/layout/Modal";
import ParamFactory from "../../common/components/parameters";
import { getEnrichmentConfigurationsByRetailerId } from "../../common/services/retailer";
import { getConnector } from "app/common/services/subscription";

class ExportPreComputedTradeItemActionViewModel extends React.Component {
  state = {
    enrichmentConfigurations: []
  };

  componentDidMount() {
    this.init();

    this.loadEnrichmentConfigurationsByConnector = this.loadEnrichmentConfigurationsByConnector.bind(
      this
    );
  }

  async init() {
    await this.props.loadExportDependencies();
    this.props.getTransportConfigurations();
    this.props.getManufacturers();
    this.props.getAllConnectorsLight();
    this.props.getAllTaxonomies();
    if (this.props.model && this.props.model.taxonomyId && this.props.model.tradeItemCategory && this.props.model.tradeItemCategory.code)
      this.props.loadTradeItemCategoryDependencies(this.props.model.taxonomyId, this.props.model.tradeItemCategory.code);
    if (this.props.model && this.props.model.connectorId)
      this.loadEnrichmentConfigurationsByConnector(
        this.props.model.connectorId
      );
  }

  loadEnrichmentConfigurationsByConnector(connectorId) {
    getConnector(connectorId).then(connectorRes => {
      if (get(connectorRes, "data.retailerId")) {
        this.loadEnrichmentConfigurations(connectorRes.data.retailerId);
      }
    });
  }

  loadEnrichmentConfigurations(retailerId) {
    getEnrichmentConfigurationsByRetailerId(retailerId).then(res => {
      this.setState({ enrichmentConfigurations: get(res, "data", []) });
    });
  }

  render() {
    const props = this.props;

    const {
      model,
      businessRules,
      languages,
      tradeItemCategories,
      imageActions,
      transportConfigurations,
      manufacturers,
      connectors,
      taxonomies,
      displayInputParams,
      inputParamsValues
    } = props;

    const {
      onChange,
      preComputeForExportAction,
      launchAction,
      hideInputParameters,
      showInputParameters,
      setInputParameter
    } = props;

    const { enrichmentConfigurations } = this.state;

    const languageOptions = languages.map(lang => ({
      label: lang.code,
      value: lang.id
    }));
    const orderedExportLanguageIds =
      get(model, "orderedExportLanguageIds") || [];
    const selectedLanguages = reduce(
      orderedExportLanguageIds,
      (res, curr) => {
        res.push(find(languageOptions, lo => lo.value === curr));
        return res;
      },
      []
    );
    const selectedExtraLanguages = languageOptions.filter(
      o => model.extraExportLanguages.indexOf(o.value) >= 0
    );
    const selectedManufacturers = orderBy(
      manufacturers.filter(o => model.manufacturerIds.indexOf(o.value) >= 0),
      ["label"],
      ["asc"]
    );
    const selectedImageActions = model.exportTradeItemImageActionIds
      ? imageActions.filter(
          o => model.exportTradeItemImageActionIds.indexOf(o.id) >= 0
        )
      : [];
    const selectedConnector = model.connectorId
      ? find(connectors, c => c.connectorId === model.connectorId)
      : null;

    const selectTradeItemCategory = model.tradeItemCategory
      ? find(tradeItemCategories, c => c.code.code ===  model.tradeItemCategory.code)
      : null;

    const selectTaxonomy = model.taxonomyId
      ? find(taxonomies, c => c.id === model.taxonomyId)
      : null;

    const change = (k, v) => {
      onChange(dotProp.set(model, k, v));
    };

    const select = key => option =>
      change(
        key,
        Array.isArray(option)
          ? option.map(o => o.value)
          : option === null
          ? null
          : option.value
      );

    const input = inputChanger(model, onChange);

    return (
      <React.Fragment>

        {/* Taxonomy */}
        <div className="form-group">
          <label className="control-label">Taxonomy*</label>

          <Select
            options={taxonomies}
            value={selectTaxonomy}
            name={"taxonomyId"}
            getOptionLabel={o => o.name}
            getOptionValue={o => o.id}
            onChange={taxonomy => {
              //props.loadTaxonomyDependencies(taxonomy.id); 
              //console.log(taxonomy.id);
              change("taxonomyId", taxonomy.id);
            }}
          />
        </div>

        {/* Trade Item Category */}
        <div className="form-group">
          <label className="control-label">Trade Item Category*</label>

          <Select
            options={tradeItemCategories}
            value={selectTradeItemCategory}
            name={"tradeItemCategoryCode"}
            getOptionLabel={o => `${o.code.code} - ${o.name} (${o.unspsc})`}
            getOptionValue={o => o.code.code}
            onChange={tradeItemCategory => {
              props.loadTradeItemCategoryDependencies(get(model, "taxonomyId"), tradeItemCategory.code.code); 
              change("tradeItemCategory", {code: tradeItemCategory.code.code});
            }}
          />
        </div>

        {/* connectorId	string($uuid) */}
        <div className="form-group">
          <label className="control-label">Connector</label>
          {get(model, "connectorId") && (
            <Link
              to={`/subscription/connector/${model.connectorId}`}
              className="btn btn-link p-0 ml-1"
            >
              &#8594; View connector
            </Link>
          )}
          <Select
            options={connectors}
            value={selectedConnector}
            name={"connectorId"}
            getOptionLabel={o => `${o.name} (${o.type})`}
            getOptionValue={o => o.connectorId}
            onChange={o => {
              change("enrichmentConfigurationId", null);
              o === null
                ? this.setState({ enrichmentConfigurations: [] })
                : this.loadEnrichmentConfigurationsByConnector(
                    get(o, "connectorId")
                  );
              change("connectorId", get(o, "connectorId"));
            }}
          />
        </div>

        {/* businessRulesetId	string($uuid) */}
        <div className="form-group">
          <label className="control-label">Mandatory business ruleset*</label>
          <Select
            isMulti
            closeMenuOnSelect={false}
            value={filter(
              businessRules,
              r => indexOf(get(model, "mandatoryBusinessRulesetIds", []), r.id) !== -1
            )}
            onChange={selectedRules =>
              change(
                "mandatoryBusinessRulesetIds",
                selectedRules === null
                  ? null
                  : map(selectedRules, rule => rule.id)
              )
            }
            isClearable={true}
            getOptionLabel={o => o.name}
            getOptionValue={o => o.id}
            options={businessRules}
          />
        </div>

        {/* businessRulesetId	string($uuid) */}
        <div className="form-group">
          <label className="control-label">Warning business ruleset</label>
          <Select
            isMulti
            closeMenuOnSelect={false}
            value={filter(
              businessRules,
              r =>
                indexOf(get(model, "warningBusinessRulesetIds", []), r.id) !==
                -1
            )}
            onChange={selectedRules =>
              change(
                "warningBusinessRulesetIds",
                selectedRules === null
                  ? null
                  : map(selectedRules, rule => rule.id)
              )
            }
            isClearable={true}
            getOptionLabel={o => o.name}
            getOptionValue={o => o.id}
            options={businessRules}
          />
        </div>

        {/* formatConfigurationId	string($uuid) */}
        <div className="form-group">
          <label className="control-label">Format configuration*</label>
          {get(model, "formatConfigurationId") && (
            <Link
              to={`/tools/export-format/${model.formatConfigurationId}`}
              className="btn btn-link p-0 ml-1"
            >
              &#8594; View format
            </Link>
          )}
          <SelectObject
            options={props.exportFormats}
            name="formatConfigurationId"
            value={model.formatConfigurationId}
            onChange={input}
          />
        </div>

        {/* transportConfigurationId	string($uuid) */}
        <div className="form-group">
          <label className="control-label">Transport configuration*</label>
          {get(model, "transportConfigurationId") && (
            <Link
              to={`/transport-configuration/${model.transportConfigurationId}`}
              className="btn btn-link p-0 ml-1"
            >
              &#8594; View transport
            </Link>
          )}
          <SelectObject
            options={transportConfigurations}
            name="transportConfigurationId"
            value={model.transportConfigurationId}
            onChange={input}
          />
        </div>

        {/* manufacturerIds	string($uuid) */}
        <div className="form-group">
          <label className="control-label">Manufacturers</label>
          <Select
            isMulti
            closeMenuOnSelect={false}
            options={manufacturers}
            name="manufacturerIds"
            value={selectedManufacturers}
            onChange={v =>
              change("manufacturerIds", map(v, _v => _v.value) || [])
            }
          />
        </div>

        {/* imageActions	string($uuid) */}
        <div className="form-group">
          <label className="control-label">Image actions</label>
          <Select
            isMulti
            closeMenuOnSelect={false}
            options={imageActions}
            name="exportTradeItemImageActionIds"
            getOptionValue={o => o.id}
            getOptionLabel={o => o.name}
            value={selectedImageActions}
            onChange={v =>
              change("exportTradeItemImageActionIds", map(v, o => o.id) || [])
            }
          />
        </div>

        {/* exportLanguageId	string($uuid) */}
        <div className="form-group">
          <label className="control-label">Ordered export languages*</label>
          <LanguageSelect
            closeMenuOnSelect={false}
            options={languageOptions}
            value={selectedLanguages}
            isMulti
            onChange={select("orderedExportLanguageIds")}
          />
        </div>

        {/* extraExportLanguages	[string($uuid)] */}
        <div className="form-group">
          <label className="control-label">Extra export languages</label>
          <LanguageSelect
            closeMenuOnSelect={false}
            value={selectedExtraLanguages}
            options={languageOptions}
            isMulti
            onChange={select("extraExportLanguages")}
          />
        </div>

        <div style={{ padding: "2rem", border: "1px solid #888" }}>
          {/* enrichmentConfigurationId	string($uuid) */}
          <div className="form-group">
            <label className="control-label">
              Filter Retailer Inventory list with a specific source
            </label>
            {get(model, "enrichmentConfigurationId") && (
              <Link
                to={`/enrichment-configuration/${model.enrichmentConfigurationId}`}
                className="btn btn-link p-0 ml-1"
              >
                &#8594; View configuration
              </Link>
            )}
            <Select
              isClearable={true}
              options={enrichmentConfigurations}
              getOptionLabel={o => get(o, "name")}
              getOptionValue={o => get(o, "id")}
              value={find(
                enrichmentConfigurations,
                enr =>
                  get(enr, "id") === get(model, "enrichmentConfigurationId")
              )}
              name="enrichmentConfigurationId"
              onChange={o =>
                change("enrichmentConfigurationId", o === null ? null : o.id)
              }
            />
          </div>

          {/* doEnrichment	boolean */}
          <div className="form-check">
            <label>
              <input
                className="form-check-input"
                type="checkbox"
                checked={model.doEnrichment}
                name="doEnrichment"
                onChange={input}
              />
              Use Retailer Inventory List fields to enrich exported Trade Items
            </label>
          </div>

          {/* doTradItemsFilter	boolean */}
          <div className="form-check">
            <label>
              <input
                className="form-check-input"
                type="checkbox"
                name="doTradItemsFilter"
                checked={model.doTradItemsFilter}
                onChange={input}
              />
              Filter Exported Trade item with main Retailer Inventory list
            </label>
          </div>
        </div>

        {/* doImportStatistics	boolean */}
        {/* <div className="form-check">
          <label>
            <input
              className="form-check-input"
              type="checkbox"
              name="doImportStatistics"
              checked={model.doImportStatistics}
              onChange={input}
            />
            Generate import statistics
          </label>
        </div> */}

        {/* Trigger manual precomputing */}
        {get(model, "id", null) && (
          <div className="form-group mt-3">
            <button
              onClick={e => {
                e.preventDefault();
                window.confirm(`Are you sure?`) &&
                  preComputeForExportAction(model.id);
              }}
              className="btn btn-secondary"
            >
              <i className="icon-energy" /> Pre-compute
            </button>
            <button
              onClick={e => {
                e.preventDefault();
                if (!isEmpty(get(model, "inputParameters")))
                  showInputParameters();
                else
                  window.confirm(`Are you sure?`) &&
                    launchAction(model.id, inputParamsValues);
              }}
              className="btn btn-secondary ml-2"
            >
              <i className="icon-energy" /> Launch action
            </button>
            <Link
              to={`/pre-computed-trade-items/${model.id}`}
              className="btn btn-light ml-2"
            >
              <i className="icon-list" /> View products
            </Link>
            <Link
              to={`/action-precomputing-detail/${model.id}`}
              className="btn btn-light ml-2"
            >
              <i className="icon-list" /> View details
            </Link>
          </div>
        )}

        {/* Input params when launching the action */}
        {displayInputParams && (
          <Modal title="Input parameters" onClose={() => hideInputParameters()}>
            {map(get(model, "inputParameters"), (inputParam, inputParamKey) => (
              <div key={`input-param-${inputParamKey}`} className="py-3">
                <ParamFactory
                  type={inputParam.type}
                  name={inputParam.code}
                  isArray={inputParam.isArray}
                  value={get(inputParamsValues, `${inputParam.code}`, null)}
                  onChange={value => setInputParameter(inputParam.code, value)}
                />
              </div>
            ))}

            <div className="py-4 text-center">
              <button
                onClick={e => {
                  launchAction(model.id, inputParamsValues);
                  hideInputParameters();
                }}
                className="btn btn-secondary ml-2"
              >
                <i className="icon-energy" /> Launch action
              </button>
            </div>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    exportFormats: selectors.getExportFormats(state),
    transportConfigurations: selectors.getTransportConfigurations(state),
    manufacturers: selectors.getManufacturersForSelect(state),
    connectors: selectors.getConnectors(state),
    taxonomies: selectors.getTaxonomies(state),
    imageActions: selectors.getImageActions(state),
    targetMarkets: selectors.getTargetMarkets(state),
    displayInputParams: selectors.displayInputParams(state),
    inputParamsValues: selectors.inputParamsValues(state)
  };
};

export default connect(
  mapStateToProps,
  actions
)(ExportPreComputedTradeItemActionViewModel);
