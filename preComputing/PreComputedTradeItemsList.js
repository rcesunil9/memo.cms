import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import JSONTree from "react-json-tree";
import update from "immutability-helper";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import * as selectors from "./selectors";
import * as actions from "./actions";
import PageWrapper from "../common/components/layout/PageWrapper";
import SmartDatatable from "../common/components/datatable/SmartDatatable";
import Modal from "../common/components/layout/Modal";
import Card from "../common/components/layout/Card";
import { filterStringValueLowerCase } from "../common/utils/filterString";
import PreComputingListFilters from "./PreComputingListFilters";

class PreComputedTradeItemsList extends React.Component {
  componentDidMount() {
    const { match, filters } = this.props;
    const { updateFilters } = this.props;
    const id = match.params.id;
    if (id) updateFilters(update(filters, { actionId: { $set: id } }));
  }

  componentWillUpdate(nextProps) {
    const { filters } = this.props;
    if (this.props.match.params.id !== nextProps.match.params.id) {
      if (nextProps.match.params.id)
        this.props.updateFilters(
          update(filters, { actionId: { $set: nextProps.match.params.id } })
        );
    }
  }

  componentWillUnmount() {
    const { resetPreComputedTradeItems } = this.props;
    resetPreComputedTradeItems();
  }

  showProduct(show, item) {
    const { showTradeItem, setTradeItem } = this.props;
    setTradeItem(item);
    showTradeItem(show);
  }

  filterChange = filterList => {
    const { filters, updateFilters } = this.props;

    if (!isEmpty(filterList) && find(filterList, item => item.id === "gtin")) {
      const gtin = find(filterList, item => item.id === "gtin").value;
      updateFilters(
        update(filters, { gtins: { $set: [gtin] }, pageNumber: { $set: 0 } })
      );
    } else
      updateFilters(
        update(filters, { gtins: { $set: [] }, pageNumber: { $set: 0 } })
      );
  };

  render() {
    const { match } = this.props;
    const {
      updateFilters,
      setFilter,
      resetFilters,
      getPreComputedTradeItems
    } = this.props;
    const { preComputedTradeItems, totalPages, itemShow, filters } = this.props;

    console.log(preComputedTradeItems);

    return (
      <PageWrapper>
        <div className="row mb-3">
          <div className="col">
            <Link
              to={`/action/${match.params.id}`}
              className="btn btn-secondary"
            >
              <i className="icon-action-redo" /> Go to Action
            </Link>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <Card sm className="border">
              <p className="m-0 lead">
                <strong>{`${totalPages}`}</strong> result(s) found.
              </p>
            </Card>
          </div>
        </div>
        <PreComputingListFilters
          filters={filters}
          onFilterChange={(key, val) =>
            setFilter(update(filters, { [key]: { $set: val } }))
          }
          onFiltersEmpty={() => {
            resetFilters({ actionId: match.params.id });
          }}
          onFiltersSearch={() => {
            getPreComputedTradeItems(filters);
          }}
        />
        <br />
        <div className="row">
          <div className="col-12">
            <SmartDatatable
              data={preComputedTradeItems}
              manual
              sortable={false}
              filterable={false}
              showPaginationTop={true}
              pageSizeOptions={[20, 50, 100]}
              page={filters.pageNumber}
              pages={
                totalPages > 0 ? Math.ceil(totalPages / filters.pageSize) : 0
              }
              pageSize={filters.pageSize}
              onPageSizeChange={size =>
                updateFilters(
                  update(filters, {
                    pageSize: { $set: size },
                    pageNumber: { $set: 0 }
                  })
                )
              }
              onPageChange={page =>
                updateFilters(update(filters, { pageNumber: { $set: page } }))
              }
              onFilteredChange={this.filterChange}
              showPagination={true}
              className="-striped -highlight"
              columns={[
                { Header: "ID", accessor: "tradeItemId", width: 80 },
                {
                  Header: "Manufacturer",
                  accessor: "values.manufacturer.name",
                  filterMethod: (filter, row) =>
                    filterStringValueLowerCase(filter, row)
                },
                // {
                //   Header: "Marketing Title",
                //   accessor: "values.marketing[0].values.title",
                //   filterMethod: (filter, row) =>
                //     filterStringValueLowerCase(filter, row)
                // },
                { Header: "Category Code", accessor: "values.tradeItemCategory.code" },
                { Header: "EAN", id: "gtin", accessor: "values.gtin.value" },
                {
                  Header: "Trade Item Manufacturer Code ",
                  accessor: "values.tradeItemManufacturerCode"
                }
                ,
                {
                  Header: "Actions",
                  id: "actions",
                  accessor: item => (
                    <div className="text-center">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          this.showProduct(true, item);
                        }}
                      >
                        View product
                      </button>
                    </div>
                  )
                }
              ]}
            />
            {itemShow.show && (
              <Modal
                title={`Product view`}
                onClose={e => {
                  this.showProduct(false, null);
                }}
                size={"lg"}
              >
                <div style={{ maxHeight: "650px", overflow: "auto" }}>
                  <JSONTree
                    data={itemShow.item}
                    theme={{
                      tree: ({ style }) => ({
                        style: { ...style, backgroundColor: undefined }, // removing default background color from styles
                        className: "json-tree-view mt-0 mb-0 p-2 rounded"
                      })
                    }}
                  />
                </div>
              </Modal>
            )}
          </div>
        </div>
      </PageWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    preComputedTradeItems: selectors.getPreComputedTradeItems(state),
    totalPages: selectors.getTotal(state),
    itemShow: selectors.getItemViewShow(state),
    filters: selectors.getFilters(state)
  };
};

export default withRouter(
  connect(mapStateToProps, actions)(PreComputedTradeItemsList)
);
