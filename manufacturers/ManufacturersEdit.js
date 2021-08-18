import React from "react"
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import get from "lodash/get"
import size from "lodash/size"
import * as selectors from "./selectors"
import * as actions from "./actions"
import ActionsBar from "../common/components/layout/ActionsBar"
import Card from "../common/components/layout/Card"
import ManufacturerEntityEdit from "./ManufacturerEntityEdit"
import SmartDatatable from "../common/components/datatable/SmartDatatable"
import ManufacturerForm from "./ManufacturerForm";
import Subscription from '../subscription/subscription/Subscription'

class ManufacturersEdit extends React.Component {

  componentWillUnmount() {
    const { resetManufacturerEntity, resetManufacturer, resetExportActions, resetPdfExportActions } = this.props
    resetManufacturer()
    resetManufacturerEntity()
    resetExportActions()
    resetPdfExportActions()
  }

  componentDidMount() {
    const { getManufacturerById, getManufacturerEntitiesByManufacturerId, getExportActions, getPdfExportActions, match } = this.props
    getManufacturerById(match.params.id)
    getManufacturerEntitiesByManufacturerId(match.params.id)
    getExportActions()
    getPdfExportActions()
  }

  save(id) {
    const { saveManufacturerById, createManufacturer, manufacturer, history } = this.props
    let promise = id ? saveManufacturerById(id, manufacturer) : createManufacturer(manufacturer)
    if(!id) promise.then(id => {
      history.push(`/manufacturer/${id}`)
    })
  }

  delete(id) {
    const { deleteManufacturerById, manufacturer, history } = this.props
    if(!window.confirm(`Are you sure to delete ${get(manufacturer, "name")}?`)) return
    let promise = deleteManufacturerById(id)
    return promise.then(data => {
      history.push(`/manufacturers`)
    })
  }

  deleteManufacturerEntity(manufacturerEntity) {
    const { deleteManufacturerEntityById } = this.props
    if(!window.confirm(`Are you sure to delete ${get(manufacturerEntity, "name")}?`)) return
    let promise = deleteManufacturerEntityById(manufacturerEntity.id)
    return promise.then(data => {

    })
  }

  render() {
    const { editManufacturer,
      manufacturer,
      exportActions,
      pdfExportActions,
      manufacturerEntities,
      manufacturerEntityUnderEdit,
      editManufacturerEntity,
      match } = this.props

    const id = get(match, "params.id", null)

    return (
      <div className="container-fluid">

        {/* Actions */}
        <ActionsBar>
            <div className="col-4">
              <h2 className="h4 pt-1 m-0 font-weight-light">{ get(manufacturer, "name") }</h2>
            </div>
            <div className="col-8 text-right">
              <Link to={`/manufacturers`} className="btn btn-light mr-2">Go back to list</Link>
              {id && <Link to={`/manufacturer`} className="btn btn-success mr-2">+ Create new manufacturer</Link>}
              {id && <button className="btn btn-danger" onClick={() => this.delete(id)}>Delete manufacturer</button>}
            </div>
        </ActionsBar>

        {/* Edit */}
        <div className="row py-3">
          <div className="col-5">
            <div className='row'>
              <div className='col-12'>
                <Card>
                  <ManufacturerForm
                    id={id} 
                    exportActions={exportActions}
                    pdfExportActions={pdfExportActions}
                    manufacturer={manufacturer} 
                    onChange={editManufacturer} 
                    onSave={() => this.save(id)}
                    />
                </Card>
              </div>
            </div>

            <br/>
              
            {/* Subscription */}
            <div className="row">
              <div className="col-12">
                <Card>
                  <h5>Subscription</h5>
                      <Subscription
                          manufacturerId={id}
                          onSubscriptionCreated={res => alert('Subscription created !')}
                          onSubscriptionUpdated={res => alert('Subscription updated !')}
                          onSubscriptionDeleted={res => {
                              alert('Subscription deleted !')
                            }}
                          />
                </Card>
              </div>
            </div>
          </div>
          {id && <div className="col-7">
              {!manufacturerEntityUnderEdit && <Card title={`${get(manufacturer, "name")}'s entities`}>
                  {/* Create new entity */}
                  <button
                    onClick={() => editManufacturerEntity(selectors.getDefaultManufacturerEntity(id, get(manufacturer, "name")))}
                    className="btn btn-success mb-3">+ Create new entity</button>

                  {/* List entities */}
                  <SmartDatatable
                    data={manufacturerEntities}
                    sortable={false}
                    filterable={true}
                    showPagination={false}
                    pageSize={size(manufacturerEntities)}
                    className="-striped -highlight"
                    columns={[
                      {
                          Header: "Id",
                          accessor: "id",
                          width: 50
                      },
                      {
                          Header: "Name",
                          accessor: "name"
                      },
                      {
                        Header: "FTP",
                        columns: [
                          {
                            Header: "URL",
                            accessor: "importSettings.ftpConnectionSettings.url"
                          },
                          {
                            Header: "Path",
                            accessor: "importSettings.ftpConnectionSettings.path"
                          }
                        ]
                      },
                      {
                        Header: "Actions",
                        id: "actions",
                        accessor: d => (
                          <div className="text-center">
                            <button className="btn btn-link p-0 mr-2" onClick={() => editManufacturerEntity(d)}>Edit</button>
                            <button className="btn btn-link text-danger p-0" onClick={() => this.deleteManufacturerEntity(d)}>Delete</button>
                          </div>
                        )
                      }
                    ]} />
              </Card>}


              {/* Edit entity */}
              {manufacturerEntityUnderEdit && <Card title={get(manufacturerEntityUnderEdit, "name")}>
                {manufacturerEntityUnderEdit && <ManufacturerEntityEdit />}
              </Card>}
          </div>}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
    return {
      manufacturer: selectors.getManufacturerToEdit(state) || {name: ''},
      manufacturerEntities: selectors.getManufacturerEntitiesOrderByName(state),
      manufacturerEntityUnderEdit: selectors.getManufacturerEntityToEdit(state),
      exportActions: selectors.getExportActions(state),
      pdfExportActions: selectors.getPdfExportActions(state),
    }
}

export default withRouter(connect(mapStateToProps, actions)(ManufacturersEdit))
