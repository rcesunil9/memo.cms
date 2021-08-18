import React from "react"
import { connect } from "react-redux"
import { Link, withRouter } from 'react-router-dom'
import * as selectors from "./selectors"
import * as actions from "./actions"
import Select from "react-select"
import Modal from "../common/components/layout/Modal"
import PageWrapper from "../common/components/layout/PageWrapper"
import Card from "../common/components/layout/Card"
import TradeItemPropertyEdit from "./TradeItemPropertyEdit"
import ValueGroupEdit from "./ValueGroupEdit"
import NewValuesGroup from "./NewValuesGroup"
import PropertiesMosaic from "./PropertiesMosaic"
import {
  tradeItemPropertyPlaceholder,
  tradeItemValueGroupPlaceholder,
} from "./utils"
import RetailersAssociations from './RetailersAssociations'

const dummyProperty = tradeItemPropertyPlaceholder()
const dummyValueGroup = tradeItemValueGroupPlaceholder()

class TradeItemsList extends React.Component {
  constructor (props) {
    super(props)
    this.selectGroup = this.selectGroup.bind(this)
    this.selectTradeItemCategory = this.selectTradeItemCategory.bind(this)
    this.selectTaxonomy = this.selectTaxonomy.bind(this)
  }


  componentDidMount() {
    const { getTaxonomies, getTradeItemCategories, getGroups, getValueGroups, getLanguages, getBusinessRuleSets, getMandatoryLevels } = this.props
    getTaxonomies();
    getTradeItemCategories()
    getGroups()
    getValueGroups()
    getLanguages()
    getBusinessRuleSets()
    getMandatoryLevels()
  }

  searchProperties(propertyGroup, tradeItemCategory, taxonomy) {
    if (taxonomy) {
      var taxonomyId = taxonomy.id;
      
      var tradeItemCategoryCode;
      if(tradeItemCategory)
        tradeItemCategoryCode = tradeItemCategory.code.code;
      
      var propertyGroupCode;
      if(propertyGroup)
        propertyGroupCode = propertyGroup.name;

      this.props.getProperties({taxonomyId, propertyGroupCode, tradeItemCategoryCode})
    }
  }

  selectTaxonomy(taxonomy) {
    const { groupSelected, tradeItemCategorySelected, selectTaxonomy } = this.props
    selectTaxonomy(taxonomy)
    this.searchProperties(groupSelected, tradeItemCategorySelected, taxonomy)
  }

  selectTradeItemCategory(tradeItemcategory) {
    const { groupSelected, taxonomySelected, selectTradeItemCategory } = this.props
    selectTradeItemCategory(tradeItemcategory)
    this.searchProperties(groupSelected, tradeItemcategory, taxonomySelected)
  }

  selectGroup(group) {
    const { tradeItemCategorySelected, taxonomySelected, selectGroup } = this.props
    selectGroup(group)
    this.searchProperties(group, tradeItemCategorySelected, taxonomySelected)
  }

  selectProperty(prop) {
    this.props.selectProperty(prop)
  }

  render() {
    const {
      taxonomies,
      tradeItemCategories,
      groups,
      match,
      valueGroups,
      taxonomySelected,
      tradeItemCategorySelected,
      groupSelected,
      properties,
      propertySelected,
      propertyNew,
      valueGroupEdited,
      languages,
      currentLanguage,
      propertyNewValid,
      propertySelectedValid,
      newValueGroup,
    } = this.props
    const { setSelectedProperty, setNewProperty, setEditedValueGroup, setCurrentLanguage, resetNewValuesGroup, receiveNewValuesGroup, importNewValuesGroup } = this.props;
    const { createProperty, updateProperty, deleteProperty, saveValueGroup, editValueGroup } = this.props;

    let defaultTab = 'view-all'
    if (match.params && match.params.id && match.params.id === 'retailers-associations') {
      defaultTab = 'retailers-associations'
    }
    const valueGroupEditedTitle = () => {
      if (!valueGroupEdited) return null;
      if (!valueGroupEdited.id) return 'New value group'
      return valueGroupEdited.name
    }
    
    return (
      <PageWrapper>

        {propertyNew && (
          <Modal title="New property" onClose={() => setNewProperty(null)}>
            <TradeItemPropertyEdit
              tradeItemProperty={propertyNew}
              {...{ taxonomies, tradeItemCategories, groups, valueGroups }}
              valid={propertyNewValid}
              onCancel={() => setNewProperty(null)}
              onChange={setNewProperty}
              onSave={() => createProperty(propertyNew)}
              onCreateValueGroupClick={() => setEditedValueGroup(dummyValueGroup)}
              onEditValueGroupClick={valueGroup => editValueGroup(valueGroup.id)}
            />
          </Modal>
        )}

        {newValueGroup && (
          <Modal title="New values group" onClose={() => resetNewValuesGroup()} size={`lg`}>
            <NewValuesGroup
              className="form-control"
              onSave={() => importNewValuesGroup(newValueGroup)}
              onCancel={() => resetNewValuesGroup()}
              onChange={value => receiveNewValuesGroup(value)}>
              {newValueGroup}
            </NewValuesGroup>
          </Modal>
        )}

        {valueGroupEdited && <Modal title={valueGroupEditedTitle()} size="lg" onClose={() => setEditedValueGroup(null)}>
          <ValueGroupEdit
            valueGroup={valueGroupEdited}
            languages={languages}
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            onCancel={() => setEditedValueGroup(null)}
            onChange={setEditedValueGroup}
            onSave={() => saveValueGroup(valueGroupEdited)}
            />
        </Modal>}

        <div className="row mb-3">
          <div className="col-12">
            <button className="btn btn-light float-right"
              onClick={() => receiveNewValuesGroup("Copy paste CSV values groups")}>+ Add new values groups</button>
            <button className="btn btn-light float-right mr-2"
              onClick={() => setNewProperty(dummyProperty)}>+ Add new property</button>
            <Link className="btn btn-light float-right mr-2"
                    to="/trade-items-properties-new-association">+ Add new association</Link>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-3">
          <Card title="Taxonomy">
            <Select
              value={taxonomySelected}
              onChange={taxonomy => this.selectTaxonomy(taxonomy)}
              isClearable={true}
              getOptionLabel={o => o.name}
              getOptionValue={o => o.id}
              options={taxonomies || []}
             />
            </Card>
            <br/>
            <Card title="Trade Item Category">
            <Select
              value={tradeItemCategorySelected}
              onChange={tradeItemCategory => this.selectTradeItemCategory(tradeItemCategory)}
              isClearable={true}
              getOptionLabel={o => `${o.code.code} - ${o.name} (${o.unspsc})`}
              getOptionValue={o => o.code.code}
              options={tradeItemCategories || []}
             />
            </Card>
            <br/>
            <Card title="Group">

            <Select
                value={groupSelected}
                onChange={group => this.selectGroup(group)}
                isClearable={true}
                getOptionLabel={o => o.name}
                getOptionValue={o => o.name}
                options={groups || []}
               />
            </Card>
          </div>
          {(taxonomySelected) &&
          <div className="col-9">
            <div className="mb-1">
              <Link to={`/trade-items-properties/view-all`}
                    className={`btn ${defaultTab === 'view-all' ? 'btn-dark' : 'btn-secondary'}`}>View all</Link>
              <Link to={`/trade-items-properties/retailers-associations`}
                    className={`btn ${defaultTab === 'retailers-associations' ? 'btn-dark' : 'btn-secondary'} ml-2`}>Retailers
                associations</Link>
            </div>
            {defaultTab === 'retailers-associations' ?
              <RetailersAssociations/>
              :
              <Card>

                <div className="row">
                  <PropertiesMosaic
                    tradeItemProperties={properties}
                    onSelect={p => this.selectProperty(p)}/>
                </div>

                {propertySelected && <Modal title="Edit property" onClose={() => setSelectedProperty(null)}>
                  <TradeItemPropertyEdit
                    tradeItemProperty={propertySelected} {...{taxonomies, tradeItemCategories, groups, valueGroups}}
                    valid={propertySelectedValid}
                    onCancel={() => setSelectedProperty(null)}
                    onChange={setSelectedProperty}
                    onSave={() => updateProperty(propertySelected)}
                    onDelete={() => deleteProperty(propertySelected)}
                    onCreateValueGroupClick={() => setEditedValueGroup(dummyValueGroup)}
                    onEditValueGroupClick={valueGroup => editValueGroup(valueGroup.id)}/>
                </Modal>}

              </Card>}
          </div>}
        </div>
      </PageWrapper>
    )
  }
}

const mapStateToProps = (state) => {
    return {
      properties: selectors.getFilteredPropertiesList(state),
      taxonomies: selectors.getTaxonomiesList(state),
      tradeItemCategories: selectors.getTradeItemCategoriesList(state),
      groups: selectors.getGroupsList(state),
      valueGroups: selectors.getValueGroupsList(state),
      taxonomySelected: selectors.getTaxonomySelected(state),
      tradeItemCategorySelected: selectors.getTradeItemCategorySelected(state),
      groupSelected: selectors.getGroupSelected(state),
      propertySelected: selectors.getPropertySelected(state),
      propertySelectedValid: selectors.selectedPropertyIsValid(state),
      propertyNew: selectors.getPropertyNew(state),
      propertyNewValid: selectors.newPropertyIsValid(state),
      associationNew: selectors.getNewRetailersAssociation(state),
      valueGroupEdited: selectors.getEditedValueGroup(state),
      languages: selectors.getLanguages(state),
      currentLanguage: selectors.getCurrentLanguage(state),
      newValueGroup: selectors.getNewValuesGroup(state),
    }
}

export default withRouter(connect(mapStateToProps, actions)(TradeItemsList))
