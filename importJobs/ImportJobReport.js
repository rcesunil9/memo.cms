import React from "react";
import * as utils from "./utils";
import get from "lodash/get";
import PageWrapper from "../common/components/layout/PageWrapper";
import Card from "../common/components/layout/Card";
import ReportGroupsNavigation from "./ReportGroupNavigation";
import update from "immutability-helper";
import * as actions from "./actions";
import { connect } from "react-redux";
import * as selectors from "./selectors";
import { withRouter } from "react-router-dom";
import Modal from '../common/components/layout/Modal'
import ImportJobDetails from './ImportReportDetails'
import PersistenceTable from './datatables/PersistenceTable'
import BusinessRulesTable from './datatables/BusinessRulesTable'
import MappingTable from './datatables/MappingTable'
import debounce from 'lodash/debounce'

export const Datatable = ({groupSelected}) => {
  switch (groupSelected) {
    case 'Business Rules':
      return <BusinessRulesTable/>
    case 'Persistence':
      return <PersistenceTable/>
    default:
      return <MappingTable/>
  }
}

class ImportJobReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterByTradeItem: this.props.filterByTradeItem,
      mappingFilter: this.props.mappingFilter
    };
    this.onChangeTradeItemSearch = this.onChangeTradeItemSearch.bind(this);
    this.onChangeMappingSearch = this.onChangeMappingSearch.bind(this);
    this.applyDebouncedFilter = debounce(this.applyDebouncedFilter.bind(this), 700);
  }

  componentDidMount() {
    this.init()
  }

  async init() {
    const {
      match,
      setContextId,
      getPagedPersistence,
      getPagedBusinessRule,
      getPagedMapping
    } = this.props;
    const id = match.params.id;
    if (id) {
      setContextId(id);
      getPagedPersistence(id, 0, 30);
      getPagedBusinessRule(id, 0, 30);
      getPagedMapping(id, utils.getDefaultMappingFilters());
    }
  }

  applyDebouncedFilter (filterName) {
    const {setFilterByTradeItem, setMappingFilter} = this.props
    const {filterByTradeItem, mappingFilter} = this.state
    if (filterName === 'mapping') {
      return setMappingFilter(mappingFilter)
    } else
      return setFilterByTradeItem(filterByTradeItem)
  }

  onChangeTradeItemSearch (e) {
    this.setState({filterByTradeItem: e.target.value})
    this.applyDebouncedFilter('tradeItemId')
  }

  onChangeMappingSearch (e) {
    const {name, value} = e.target
    this.setState((state) => {
      return {mappingFilter: update(state.mappingFilter, {[name]: {$set: value}})};
    })
    this.applyDebouncedFilter('mapping')
  }

  componentWillUpdate(nextProps) {
    const { setContextId } = this.props;
    if (this.props.match.params.id !== nextProps.match.params.id) {
      if (nextProps.match.params.id) setContextId(nextProps.match.params.id);
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.mappingFilter !== prevProps.mappingFilter) {
      this.setState({mappingFilter: this.props.mappingFilter})
    }
  }

  componentWillUnmount() {
    const {
      setContextId,
      resetPagedPersistence,
      resetPagedBusinessRule,
      resetPagedMapping
    } = this.props;

    setContextId();
    resetPagedPersistence();
    resetPagedMapping();
    resetPagedBusinessRule();
  }

  render() {
    const { filterByTradeItem, mappingFilter } = this.state
    const {
      groupSelected,
      detailReport,
      persistenceTotal,
      businessRuleTotal,
      mappingTotal
    } = this.props;
    const { setGroup, setDetailReport } = this.props;

    return (
      <PageWrapper>
        <h3>Import job report</h3>
        <Card sm className="mb-3 p-1">
          <div className="form-row">
              {/* Search */}
                <div className="form-group col-md-6">
                  <h4 className="mb-4">Search by trade item id</h4>
                  <input
                    value={filterByTradeItem || ""}
                    onChange={this.onChangeTradeItemSearch}
                    placeholder="Trade item Id..."
                    type="text"
                    className="form-control"
                  />
                </div>
          </div>
          <ReportGroupsNavigation
            groups={utils.getReportGroups()}
            groupSelected={groupSelected}
            persistenceTotal={persistenceTotal}
            businessRuleTotal={businessRuleTotal}
            mappingTotal={mappingTotal}
            onSelect={setGroup}
          />
          <div className="form-row mt-1">
          {groupSelected === "Mapping" && (
            <React.Fragment>
              <div className="form-group col-md-3">
                <label className="control-label">
                  Search by ean
                </label>
                <input
                  value={get(mappingFilter, "gtin") || ""}
                  onChange={e => this.onChangeMappingSearch(e)}
                  name="gtin"
                  placeholder="Ean..."
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="form-group col-md-3">
                <label className="control-label">
                  Search by manufacturer code
                </label>
                <input
                  value={get(mappingFilter, "tradeItemManufacturerCode") || ""}
                  onChange={e => this.onChangeMappingSearch(e)}
                  name="tradeItemManufacturerCode"
                  placeholder="Manufacturer code..."
                  type="text"
                  className="form-control"
                />
              </div>
            </React.Fragment>
          )}
          </div>
        </Card>
        <Datatable groupSelected={groupSelected} />
        {detailReport && <Modal title={`${groupSelected} detail report`} onClose={e => setDetailReport()}>
          <ImportJobDetails/>
        </Modal>}
      </PageWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    groupSelected: selectors.getGroupSelected(state),
    contextId: selectors.getContextId(state),
    mappingFilter: selectors.getMappingFilters(state),
    filterByTradeItem: selectors.getFilterByTradeItem(state),
    detailReport: selectors.getDetailReport(state),
    persistenceTotal: selectors.getPersistenceTotal(state),
    businessRuleTotal: selectors.getBusinessRuleTotal(state),
    mappingTotal: selectors.getMappingTotal(state),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(ImportJobReport)
);
