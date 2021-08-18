import React from 'react'
import dotProp from "dot-prop-immutable"
import { withRouter, Link } from 'react-router-dom'
import Select from 'react-select'
import get from 'lodash/get'
import find from 'lodash/find'
import { getEnrichmentConfigurationsById, getAllRetailers, createEnrichmentConfiguration, updateEnrichmentConfiguration, deleteEnrichmentConfiguration } from '../common/services/retailer';
import { getMatrixMappings } from '../common/services/matrixMapping';

class EnrichmentConfiguration extends React.Component {

    state = {
        enrichmentConfiguration: {},
        matrixMappings: [],
        retailers: [],        
    }

    componentDidMount() {
        if (this.props.retailerId) this.setState({ enrichmentConfiguration: dotProp.set(this.state.enrichmentConfiguration, 'retailerId', this.props.retailerId) })
        this.refresh()
    }

    refresh() {

        const { match, id, isStandalone } = this.props

        const enrichmentConfigurationId = isStandalone === true ? id : (match.params.id || null)

        // get enrichment configuration
        enrichmentConfigurationId && getEnrichmentConfigurationsById(enrichmentConfigurationId).then(res => {
            this.setState({ enrichmentConfiguration: get(res, 'data', {}) })
        })

        // set all retailers
        getAllRetailers().then(res => {
            this.setState({ retailers: get(res, 'data', []) })
        })

        // matrixMappings
        getMatrixMappings().then(res => {
            this.setState({ matrixMappings: get(res, 'data', []) })
        })

    }

    change(key, value) {
        this.setState({ enrichmentConfiguration: dotProp.set(this.state.enrichmentConfiguration, key, value) })
    }

    save() {

        const { enrichmentConfiguration } = this.state

        const { onCreate, onUpdate } = this.props

        // update
        if (get(enrichmentConfiguration, 'id')) {
            updateEnrichmentConfiguration(get(enrichmentConfiguration, 'id'), enrichmentConfiguration)
                .then(res => (onUpdate && onUpdate(enrichmentConfiguration)) || alert('Enrichment configuration updated!'))
                .catch(err => alert('Error'))
        }

        // create
        else {
            createEnrichmentConfiguration(enrichmentConfiguration)
                .then(res => {
                    this.change('id', get(res, 'data'))
                    if(onCreate) {
                        onCreate(dotProp.set(enrichmentConfiguration, 'id', get(res, 'data')))
                    }
                    else alert('Enrichment configuration created!')
                })
                .catch(err => {
                    alert('Error')
                })
        }

    }

    delete() {
        
        const { enrichmentConfiguration } = this.state

        const { onDelete } = this.props

        if (window.confirm(`Are you sure?`)) {
            deleteEnrichmentConfiguration(get(enrichmentConfiguration, 'id'))
                .then(res => onDelete && onDelete(enrichmentConfiguration))
        }

    }

    render() {

        const { enrichmentConfiguration, matrixMappings, retailers } = this.state

        return (
            <div className="card p-4" style={{ maxWidth: "800px" }}>
                
                {get(enrichmentConfiguration, "id") && <h2 className="mb-2"><small className="float-right" style={{fontSize: '.4em'}}>{get(enrichmentConfiguration, "id")}</small></h2>}

                {/* Name */}
                <div className="form-group">
                    <label className="control-label">Name *</label>
                    <input
                        className="form-control"
                        value={get(enrichmentConfiguration, 'name') || ''}
                        required
                        onChange={e => this.change('name', e.currentTarget.value)}
                        />
                </div>

                {/* Description */}
                <div className="form-group">
                    <label className="control-label">Description</label>
                    <textarea
                        rows={5}
                        className="form-control"
                        value={get(enrichmentConfiguration, 'description') || ''}
                        required
                        onChange={e => this.change('description', e.currentTarget.value)}
                        />
                </div>

                {/* Retailer */}
                <div className="form-group">
                    <label className="control-label">Retailer *</label>
                    {get(enrichmentConfiguration, 'retailerId') && <Link to={`/retailer/${enrichmentConfiguration.retailerId}`} className="btn btn-link p-0 ml-1">&#8594; View retailer</Link>}
                    <Select
                        required
                        value={find(retailers, r => r.id === get(enrichmentConfiguration, 'retailerId'))}
                        options={retailers}
                        isClearable={false}
                        getOptionLabel={o => get(o, 'name')}
                        getOptionValue={o => get(o, 'id')}
                        onChange={o => this.change('retailerId', o === null ? null : get(o, 'id'))}
                        />
                </div>

                {/* Matrix mapping */}
                <div className="form-group">
                    <label className="control-label">Matrix mapping *</label>
                    <Select
                        required
                        value={find(matrixMappings, r => r.id === get(enrichmentConfiguration, 'matrixMappingId'))}
                        options={matrixMappings}
                        isClearable={false}
                        getOptionLabel={o => get(o, 'mappingTitle')}
                        getOptionValue={o => get(o, 'id')}
                        onChange={o => this.change('matrixMappingId', o === null ? null : get(o, 'id'))}
                        />
                    <br/>
                    <label className="control-label">Is CSV?&nbsp;</label> 
                    <input
                        type="checkbox"
                        checked={get(enrichmentConfiguration, 'isCsv')}
                        onChange={e => this.change('isCsv', e.currentTarget.checked)}
                        />
                </div>

                {/* FTP connection */}                
                <div className="row mb-3">
                    <div className="col-6">
                        <h4>FTP connection settings</h4>
                    </div>
                </div>

                <div className="row">
                    <div className="col-6">

                        {/* URL */}
                        <div className="form-group">
                            <label className="control-label">URL *</label>
                            <input
                                className="form-control"
                                value={get(enrichmentConfiguration, 'ftpConnectionSettings.url') || ''}
                                required
                                onChange={e => this.change('ftpConnectionSettings.url', e.currentTarget.value)}
                                />
                        </div>

                        {/* Path */}
                        <div className="form-group">
                            <label className="control-label">Path *</label>
                            <input
                                className="form-control"
                                value={get(enrichmentConfiguration, 'ftpConnectionSettings.path') || ''}
                                required
                                onChange={e => this.change('ftpConnectionSettings.path', e.currentTarget.value)}
                                />
                        </div>

                    </div>

                    <div className="col-6">

                        {/* username */}
                        <div className="form-group">
                            <label className="control-label">Username *</label>
                            <input
                                className="form-control"
                                value={get(enrichmentConfiguration, 'ftpConnectionSettings.username') || ''}
                                required
                                onChange={e => this.change('ftpConnectionSettings.username', e.currentTarget.value)}
                                />
                        </div>

                        {/* password */}
                        <div className="form-group">
                            <label className="control-label">Password *</label>
                            <input
                                className="form-control"
                                value={get(enrichmentConfiguration, 'ftpConnectionSettings.password') || ''}
                                required
                                onChange={e => this.change('ftpConnectionSettings.password', e.currentTarget.value)}
                                />
                        </div>

                    </div>
                </div>

                {/* Actions */}
                <div className="row">
                    <div className="col text-right">

                        {/* Delete */}
                        {get(enrichmentConfiguration, 'id') && <button
                            className='btn btn-danger mr-3'
                            onClick={e => this.delete()}
                            >
                            Delete
                        </button>}

                        {/* Save */}
                        <button
                            className='btn btn-primary'
                            onClick={e => this.save()}
                            >
                            {get(enrichmentConfiguration, 'id') ? 'Update' : 'Create'}
                        </button>

                    </div>
                </div>

            </div>
        )

    }


}

export default withRouter(EnrichmentConfiguration)
