import React from "react";
import update from "immutability-helper";
import debounce from "lodash/debounce";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isArray from "lodash/isArray";
import Modal from "../../common/components/layout/Modal";
import DatePicker from "../../common/components/date/DatePicker";
import moment from "moment";
import Select from "react-select";
import filter from "lodash/filter";
import map from "lodash/map";
import indexOf from "lodash/indexOf";
import { getDefaultFilters, consistentStatuses } from "../utils";
import SelectString from '../../common/components/form/SelectString'

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filters: props.filters };
    this.onChangeKeywordSearch = this.onChangeKeywordSearch.bind(this);
    this.applyDebouncedKeywordFilter = debounce(
      this.applyDebouncedKeywordFilter.bind(this),
      700
    );
  }

  componentDidMount() {
    const { getManufacturers, manufacturers } = this.props;
    if (isEmpty(manufacturers)) {
      getManufacturers();
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.filters !== prevProps.filters) {
      this.setState({filters: this.props.filters})
    }
  }

  applyDebouncedKeywordFilter() {
    const { doFilteredSearch, setFilters } = this.props;
    const { filters } = this.state;
    setFilters(filters);
    doFilteredSearch();
  }

  clearFilters = () => {
    const { doFilteredSearch, setFilters } = this.props;
    setFilters(null);
    this.setState({ filters: getDefaultFilters() });
    doFilteredSearch();
  };

  onChangeKeywordSearch(e) {
    const { filters } = this.state;
    this.setState({
      filters: update(filters, { keyword: { $set: e.target.value } })
    });
    this.applyDebouncedKeywordFilter();
  }

  onFiltersChange = filters => {
    this.setState({ filters: filters });
  };

  render() {
    const { filters } = this.state;
    const {
      showFiltersModal,
      activeFiltersNumber,
      fetching,
      total,
      manufacturers
    } = this.props;
    const { setFilters, showFilters, doFilteredSearch } = this.props;

    const change = (k, v) =>
      this.onFiltersChange(update(filters, { [k]: { $set: v } }));

    return (
      <div className="row">
        <div className="col-sm-6 col-md-6">
          <div className="form-group">
            <input
              value={filters.keyword || ""}
              onChange={this.onChangeKeywordSearch}
              placeholder="Title, gtin, manufacturer code..."
              type="text"
              className="form-control"
              id="filter-keyword"
            />
          </div>
        </div>
        <div className="col-sm-6 col-md-6">
            <div className="row justify-content-end mr-0">
              {/* Number of filters */}
              <button
                onClick={e => {
                  showFilters(true);
                }}
                disabled={fetching}
                className="btn btn-primary d-inline-block"
              >
                {activeFiltersNumber > 0 && (
                  <strong>
                    {activeFiltersNumber}
                    &nbsp;
                  </strong>
                )}
                <span className="font-weight-light text-uppercase">
                  {activeFiltersNumber > 0 ? "Active Filters" : "+ Add Filter"}
                </span>
              </button>

              {/* Clear filters */}
              {activeFiltersNumber > 0 && (
                <button
                  onClick={e => {
                    this.clearFilters();
                  }}
                  disabled={fetching}
                  className="btn btn-dark d-inline-block ml-3"
                >
                  <span className="font-weight-light text-uppercase">
                    Clear Filter
                  </span>
                </button>
              )}
            </div>
        </div>

        <div className="col-sm-6 col-md-6">
            <p className="m-0 lead"><strong>{`${total}`}</strong> result(s) found.</p>
        </div>
        {showFiltersModal && (
          <Modal
            onClose={() => {
              showFilters(false);
            }}
            size="lg"
            title="Trade items filter"
          >
            <form
              onSubmit={e => {
                e.preventDefault();
                showFilters(false);
                setFilters(filters);
                doFilteredSearch();
              }}
            >
              <div className="row m-3">
                <div className="col-sm-6 col-xs-12">
                  {/* Gtin */}
                  <div className="form-group">
                    <label className="control-label">EAN</label>
                    <input
                      value={filters.gtin || ""}
                      onChange={e => change("gtin", e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Gtin"
                    />
                  </div>

                  {/* Ref */}
                  <div className="form-group">
                    <label className="control-label">
                      Manufacturer reference
                    </label>
                    <input
                      value={filters.tradeItemManufacturerCode || ""}
                      onChange={e =>
                        change("tradeItemManufacturerCode", e.target.value)
                      }
                      className="form-control form-control-lg"
                      placeholder="Code"
                    />
                  </div>

                  {/* Free search */}
                  <div className="form-group">
                    <label className="control-label">
                      Free search (title, description...)
                    </label>
                    <input
                      value={filters.keyword || ""}
                      onChange={e => change("keyword", e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Title, gtin, manufacturer code..."
                    />
                  </div>

                  {/* Release date */}
                  <div className="form-row">
                    {/* Start */}
                    <div className="form-group col-md-6">
                      <label className="control-label">
                        Release date start
                      </label>
                      <DatePicker
                        value={filters.releaseDateStart ? moment(filters.releaseDateStart) : null}
                        onChange={val => change("releaseDateStart", val ? val.format("YYYY-MM-DD") : null)}
                        inputProps={{placeholder: "YYYY-MM-DD", className: "form-control form-control-lg"}}
                        timeFormat={false}
                      />
                    </div>
                    {/* End */}
                    <div className="form-group col-md-6">
                      <label className="control-label">Release date end</label>
                      <DatePicker
                        value={filters.releaseDateEnd ? moment(filters.releaseDateEnd) : null}
                        onChange={val => change("releaseDateEnd", val ? val.format("YYYY-MM-DD") : null)}
                        inputProps={{placeholder: "YYYY-MM-DD", className: "form-control form-control-lg"}}
                        timeFormat={false}
                      />
                    </div>
                  </div>

                  {/* Updated date */}
                  <div className="form-row">
                    {/* Start */}
                    <div className="form-group col-md-6">
                      <label className="control-label">
                        Last updated start
                      </label>
                      <DatePicker
                        value={filters.updatedDateStart ? moment(filters.updatedDateStart) : null}
                        onChange={val => change("updatedDateStart", val ? val.format("YYYY-MM-DD") : null)}
                        inputProps={{placeholder: "YYYY-MM-DD", className: "form-control form-control-lg"}}
                        timeFormat={false}
                      />
                    </div>
                    {/* End */}
                    <div className="form-group col-md-6">
                      <label className="control-label">Last updated end</label>
                      <DatePicker
                        value={filters.updatedDateEnd ? moment(filters.updatedDateEnd) : null}
                        onChange={val => change("updatedDateEnd", val ? val.format("YYYY-MM-DD") : null)}
                        inputProps={{placeholder: "YYYY-MM-DD", className: "form-control form-control-lg"}}
                        timeFormat={false}
                      />
                    </div>
                  </div>
                  {/* With image */}
                  <div className="form-group position-relative pl-3 custom-control custom-checkbox">
                    <input
                      checked={get(filters, "hasImages") || false}
                      onChange={e => change("hasImages", !!e.target.checked)}
                      type="checkbox"
                      className="custom-control-input"
                      id={`has-images`}
                    />
                    <label
                      className="pointer custom-control-label control-label pt-1 pl-2"
                      htmlFor={`has-images`}
                    >
                      With pictures
                    </label>
                  </div>
                </div>

                <div className="col-sm-6 col-xs-12">
                  {/* Manufacturers */}
                  <div className="form-group">
                    <label className="control-label">Manufacturers</label>
                    <Select
                      isMulti
                      closeMenuOnSelect={false}
                      value={filter(
                        manufacturers,
                        r => {
                          //Check to apply manufacturer from url
                          return isArray(filters.manufacturers) ? indexOf(filters.manufacturers, r.name) !== -1 : r.name === filters.manufacturers
                        }
                      )}
                      onChange={v => change("manufacturers", map(v, r => r.name))}
                      isClearable={true}
                      placeholder="Manufacturers..."
                      name="manufacturers"
                      getOptionLabel={o => o.name}
                      getOptionValue={o => o.name}
                      options={manufacturers}
                    />
                  </div>

                  <div className="form-group">
                    <label className="control-label">Consistency status</label>
                    <SelectString
                      isClearable={true}
                      options={consistentStatuses}
                      value={filters.consistencyStatus}
                      onChange={v => change('consistencyStatus', v)}
                    />
                  </div>
                </div>
              </div>

              {/* Actions buttons */}
              <div className="row m-3 mt-4">
                <div className="col-6">
                  {activeFiltersNumber > 0 && (
                    <button
                      onClick={e => {
                        showFilters(false);
                        this.clearFilters();
                      }}
                      type="button"
                      className="btn btn-lg btn-dark"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
                <div className="col-6 text-right">
                  <button
                    type="button"
                    onClick={e => {
                      showFilters(false);
                    }}
                    className="btn btn-lg btn-dark mr-3"
                  >
                    Close
                  </button>
                  <button className="btn btn-lg btn-primary" type="submit">
                    Apply
                  </button>
                </div>
              </div>
            </form>
          </Modal>
        )}
      </div>
    );
  }
}

export default Filter;
