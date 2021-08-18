import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import * as selectors from "./selectors";
import * as actions from "./actions";
import ManufacturerEntityForm from "./ManufacturerEntityForm";
import Modal from "app/common/components/layout/Modal";
import PollingParameters from "./ResourcePolling";

class ManufacturerEntityEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      triggerPolling: false
    };
  }
  componentDidMount() {
    this.save = this.save.bind(this);
    const {
      languages,
      getTargetMarkets,
      getTaxonomies,
      getLanguages,
      getMatrixMappings,
      getBusinessRulesSets,
      getImageCategories,
      getRetailers
    } = this.props;

    getImageCategories();
    getMatrixMappings();
    getTargetMarkets();
    getTaxonomies();
    getBusinessRulesSets();
    getRetailers();
    if (isEmpty(languages)) getLanguages();
  }

  save(id) {
    const {
      saveManufacturerEntityById,
      createManufacturerEntity,
      resetManufacturerEntity,
      manufacturerEntity,
      manufacturer,
      getManufacturerEntitiesByManufacturerId
    } = this.props;
    let promise = id
      ? saveManufacturerEntityById(id, manufacturerEntity)
      : createManufacturerEntity(manufacturerEntity);
    return promise.then(data => {
      resetManufacturerEntity();
      getManufacturerEntitiesByManufacturerId(manufacturer.id);
    });
  }

  render() {
    const {
      editManufacturerEntity,
      resetManufacturerEntity,
      manufacturerEntity,
      businessRulesSets,
      matrixMappings,
      languages,
      targetMarkets,
      taxonomies,
      retailers,
      imageCategories
    } = this.props;

    const { triggerPolling } = this.state;

    const id = get(manufacturerEntity, "id", null);
    return (
      <div className="row">
        <div className="col">
          <ManufacturerEntityForm
            entity={manufacturerEntity}
            {...{
              matrixMappings,
              languages,
              targetMarkets,
              taxonomies,
              businessRulesSets,
              retailers,
              imageCategories
            }}
            onChange={editManufacturerEntity}
            onCancel={resetManufacturerEntity}
            onSave={() => this.save(id)}
            onPollingRequested={() => this.setState({ triggerPolling: true })}
          />

          {triggerPolling && (
            <Modal
              title={`Trigger polling`}
              onClose={() => this.setState({ triggerPolling: false })}
            >
              <PollingParameters manufacturerEntityId={id} />
            </Modal>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    manufacturerEntity: selectors.getManufacturerEntityToEdit(state),
    matrixMappings: selectors.getMatrixMappings(state),
    targetMarkets: selectors.getTargetMarkets(state),
    taxonomies: selectors.getTaxonomies(state),
    languages: selectors.getLanguages(state),
    businessRulesSets: selectors.getBusinessRulesSets(state),
    imageCategories: selectors.getImageCategories(state),
    retailers: selectors.retailers(state),
    manufacturer: selectors.getManufacturerToEdit(state)
  };
};

export default withRouter(
  connect(mapStateToProps, actions)(ManufacturerEntityEdit)
);
