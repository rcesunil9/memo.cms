import React from "react"
import { connect } from "react-redux"
import { Link, withRouter } from "react-router-dom"
import ActionsBar from "../common/components/layout/ActionsBar"
import PageWrapper from "../common/components/layout/PageWrapper"
import * as actions from "./actions"
import * as selectors from "./selectors"
import FormatForm from "./FormatForm"
import { keyed } from "./utils"

class ExportFormatsEdit extends React.Component {

  componentDidMount() {
    this.init()
  }

  async init() {
    const {
      loadFormat,
      loadNewFormat,
      match,
      loadTaxonomies,
      loadTradeItemCategories,
      loadBusinessRulesets,
      loadPropertyGroups,
      loadProperties
    } = this.props

    const id = match.params.id
    if (id) {
      await loadFormat(id)
    } else {
      await loadNewFormat()
    }

    loadTaxonomies()
    loadTradeItemCategories()
    //loadBusinessRules()
    loadBusinessRulesets()
    loadPropertyGroups()
    loadProperties()
  }

  componentWillUnmount() {
    const { resetFormat } = this.props
    resetFormat()
  }

  edit = obj => {
    const { editFormat } = this.props
    editFormat(obj)
  }

  create = async () => {
    const { format, history, createFormat } = this.props
    const id = await createFormat(format)
    history.push("/tools/export-format/" + id)
  }

  update = async () => {
    const { format, updateFormat } = this.props
    updateFormat(format)
    
  }

  duplicate = async () => {
    const { format, history, duplicateFormat } = this.props
    const id = await duplicateFormat(format)
    history.push("/tools/export-format/" + id)
  }

  save = async () => {
    const { match } = this.props
    const id = match.params.id
    if (id) this.update()
    else this.create()
  }

  delete = () => {
    if (!window.confirm("Are you sure to delete this format?")) return
    const { match, history, deleteFormatById } = this.props
    const id = match.params.id
    deleteFormatById(id)
      .then(res => history.push("/tools/export-formats"))    
  }

  render() {
    const { format, taxonomies, tradeItemCategories, businessRules, businessRulesets, match, propertyGroups, loadTransformationSetsByTradeItemCategoryCodeAndTaxonomyId, transformationSets, loadProperties  } = this.props
    if (!format) return null

    const id = match.params.id

    return (
      <div className="container-fluid">
        {/* Actions */}
        <ActionsBar>
          <div className="col-4">
            <h2 className="h4 pt-1 m-0 font-weight-light">
              {id ? format.name : "New export format"}
            </h2>
          </div>
          <div className="col-8 text-right">
            <Link to={`/tools/export-formats`} className="btn btn-light mr-2">
              Go back to list
            </Link>
            {id && (
              <Link to={`/tools/export-format`} className="btn btn-success mr-2">
                + Create new format
              </Link>
            )}
            {id && (
              <React.Fragment>                
                <button className="btn btn-light mr-2" onClick={e => this.duplicate()}>
                  Duplicate format
                </button>                
                <button className="btn btn-danger mr-2" onClick={this.delete}>
                  Delete format
                </button>
              </React.Fragment>
            )}
            <button className="btn btn-primary" onClick={this.save}>
              Save
            </button>
          </div>
        </ActionsBar>

        {/* Content */}
        <PageWrapper>
          <div className="row mb-3">
            <div className="col">
              {format && (
                <FormatForm
                  onSave={this.save}
                  onChange={this.edit}
                  {...{ format, taxonomies, tradeItemCategories, businessRules, businessRulesets, propertyGroups, loadTransformationSetsByTradeItemCategoryCodeAndTaxonomyId, transformationSets, loadProperties }}
                />
              )}
            </div>
          </div>
        </PageWrapper>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    format: selectors.getFormatObject(state),
    taxonomies: selectors.getTaxonomiesList(state),
    tradeItemCategories: selectors.getTradeItemCategoriesList(state),
    businessRules: selectors.getBusinessRulesList(state),
    businessRulesets: selectors.getBusinessRulesetsList(state),
    propertyGroups: selectors.getPropertyGroupsList(state),
    transformationSets: selectors.getTransformationSetsList(state),
  }
}

export default withRouter(
  keyed(
    connect(
      mapStateToProps,
      actions
    )(ExportFormatsEdit)
  )
)
