import React from 'react'
import { withRouter } from 'react-router-dom'
import get from 'lodash/get'
import size from 'lodash/size'
import filter from 'lodash/filter'
import { getEnrichmentConfigurationsByRetailerId, deleteEnrichmentConfiguration } from '../common/services/retailer';
import { filterStringValueLowerCase } from '../common/utils/filterString';
import SmartDatatable from '../common/components/datatable/SmartDatatable';
import EnrichmentConfiguration from './EnrichmentConfiguration';
import Modal from '../common/components/layout/Modal';

class EnrichmentConfigurations extends React.Component {

    state = {
        enrichmentConfigurations: [],
        isCreatingEnrichment: false,
        underUpdateEnrichmentId : null
    }

    componentDidMount() {
        this.refresh()
    }

    componentDidUpdate(prevProps) {
        if (this.props.retailerId !== prevProps.retailerId) this.refresh()
    }

    refresh() {

        const { retailerId } = this.props

        if (!retailerId) return

        getEnrichmentConfigurationsByRetailerId(retailerId).then(res => {
            this.setState({ enrichmentConfigurations: get(res, 'data', []) })
        })

    }

    deleteEnrichmentConfiguration(id) {
        this.setState({ enrichmentConfigurations: filter(this.state.enrichmentConfigurations, ec => ec.id !== id) })
    }

    render() {

        const { enrichmentConfigurations, isCreatingEnrichment, underUpdateEnrichmentId } = this.state

        const { retailerId } = this.props

        return (
            <React.Fragment>

                <h4>Inventory/Enrichment Source</h4>
                <br/><br/>

                {/* add new */}
                <div className="row mb-3">
                    <div className="col">
                        <button
                            className="btn btn-secondary mr-2"
                            type="button"
                            onClick={() => this.setState({isCreatingEnrichment: true})}
                            >
                            + Create New Source
                        </button>
                    </div>
                </div>

                {/* list of enrichment configurations */}
                <div className="row">
                    <div className="col">
                        <SmartDatatable
                            // manual
                            // loading={retailers.isFetching}
                            data={enrichmentConfigurations}
                            // pages={retailers.totalPages}
                            // onFetchData={this.fetchData}
                            showPagination={false}
                            sortable={false}
                            filterable={false}
                            defaultFilterMethod={filterStringValueLowerCase}
                            className="-striped -highlight"
                            columns={[
                                {
                                    Header: "Id",
                                    accessor: "id",
                                    width: 30
                                },
                                {
                                    Header: "Name",
                                    accessor: "name",
                                },
                                {
                                    Header: "Description",
                                    accessor: "description",
                                },
                                {
                                    Header: "Actions",
                                    id: "actions",
                                    filterable: false,
                                    accessor: d => (
                                        <div className="text-center">
                                            <button
                                                className="btn btn-link p-0"
                                                type="button"
                                                onClick={() => this.setState({underUpdateEnrichmentId: d.id})}
                                                >
                                                Edit
                                            </button>
                                            &nbsp;&nbsp;
                                            <button
                                                className="btn btn-link text-danger p-0"
                                                type="button"
                                                onClick={() => {
                                                    if(!window.confirm(`Are you sure?`)) return
                                                    deleteEnrichmentConfiguration(d.id)
                                                        .then(res => this.deleteEnrichmentConfiguration(d.id))
                                                        .catch(err => alert('Error'))
                                                    
                                                }}
                                                >
                                                Delete
                                            </button>
                                        </div>
                                )
                                }
                            ]}
                            pageSize={size(enrichmentConfigurations)}
                            />

                    </div>
                </div>

                {isCreatingEnrichment && <Modal
                    size={"md"} 
                    title={`New Inventory/Enrichment Source`} 
                    onClose={() => this.setState({isCreatingEnrichment: false})}
                    >
                    {<EnrichmentConfiguration isStandalone={true} retailerId={retailerId} onCreate={ec => this.setState({ enrichmentConfigurations: [ec, ...enrichmentConfigurations], isCreatingEnrichment: false})}/>}
                </Modal>}

                {underUpdateEnrichmentId && <Modal
                    size={"md"} 
                    onClose={() => this.setState({underUpdateEnrichmentId: null})}
                    >
                    {<EnrichmentConfiguration
                        isStandalone={true}
                        id={underUpdateEnrichmentId} 
                        onCreate={ec => this.setState({ enrichmentConfigurations: [ec, ...enrichmentConfigurations], underUpdateEnrichmentId: null})}
                        onDelete={ec => {
                            this.setState({underUpdateEnrichmentId: null})
                            this.deleteEnrichmentConfiguration(get(ec, 'id'))
                        }}
                        />}
                </Modal>}

            </React.Fragment>
        )

    }

}

export default withRouter(EnrichmentConfigurations)
