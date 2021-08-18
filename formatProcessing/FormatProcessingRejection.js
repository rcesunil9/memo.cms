import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { withRouter, Link } from 'react-router-dom'
import Select from 'react-select'
import JSONTree from "react-json-tree";
import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import find from 'lodash/find'
import PageWrapper from 'app/common/components/layout/PageWrapper'
import Card from 'app/common/components/layout/Card'
import { getFormatProcessingRejection } from 'app/common/services/exportFormatProcessing'
import ValidationResult from './ValidationResult'
import { getPreComputedTradeItemByTradeItemIdAndExportActionId } from 'app/common/services/preComputing'
import Modal from "../common/components/layout/Modal";
import { getManufacturers } from 'app/common/services/manufacturer';

const FormatProcessingRejection = ({ match }) => {
    const [rejection, setRejection] = useState(null)
    const [preComputedTradeItem, setPreComputedTradeItem] = useState(null)
    const [gtin, setGtin] = useState(null)
    const [manufacturerId, setManufacturerId] = useState(null)
    const [manufacturers, setManufacturers] = useState([])

    const fetchPreComputedTradeItem = useCallback(tradeItemId => {
        getPreComputedTradeItemByTradeItemIdAndExportActionId(tradeItemId, rejection.exportActionId).then(res => setPreComputedTradeItem(get(res, 'data') || null))
    }, [rejection])

    useEffect(() => {
        getFormatProcessingRejection(match.params.id).then(res => setRejection(get(res, 'data')))
        getManufacturers().then(res => setManufacturers(res.data))

    }, [ match.params.id ])

    // memoized values
    const selectedManufacturer = useMemo(() => manufacturerId ? find(manufacturers, m => get(m, 'id') === manufacturerId) : null, [manufacturers, manufacturerId])

    if (!rejection) return '...'

    return (
        <PageWrapper>

            <h3>Format Processing Rejection Detail</h3>
            <small className='d-block mb-2'>{match.params.id}</small>
            <Link className='btn btn-light' to='/format-processing-rejections'>Go back to list</Link>
            <br/><br/>

            <div className='row'>
                <div className='col-4'>
                    <Card title='General Information'>

                        {/* Format configuration */}
                        <label className='control-label d-block'>Format Configuration</label>
                        <Link target='_blank' className='mb-4 btn btn-sm btn-light' to={`/tools/export-format/${rejection.formatConfigurationId}`}>
                            {rejection.formatConfigurationName}
                            <i className='ml-2 icon-action-redo'/>
                        </Link>
                        

                        {/* Export action */}
                        <label className='control-label d-block'>Export Action</label>
                        <Link target='_blank' className='mb-4 mr-2 btn btn-sm btn-light' to={`/action/${rejection.exportActionId}`}>
                            {rejection.exportActionName}
                            <i className='ml-2 icon-action-redo'/>
                        </Link>
                        <Link target='_blank' className='mb-4 btn btn-sm btn-light' to={`/action-precomputing-detail/${rejection.exportActionId}`}>
                            Detail
                            <i className='ml-2 icon-action-redo'/>
                        </Link>

                        {/* Rejection status */}
                        <label className='control-label d-block'>Rejection Status</label>
                        <span className={`mb-4 badge badge-${rejection.rejectionStatus === 'Error' ? 'danger' : (rejection.rejectionStatus === 'Warning' ? 'warning' : 'secondary')}`}>                                
                            {rejection.rejectionStatus} 
                            </span>

                        {/* Validation Type */}
                        <label className='control-label d-block'>Validation Type</label>
                        <span className={`mb-4 badge badge-light`}>                                
                            {rejection.validationType} 
                            </span>

                        {/* Creation Timestamp */}
                        <label className='control-label d-block'>Created at</label>                            
                        <small>{rejection.creationTimestamp}</small>

                    </Card>
                </div>

                <div className='col-8'>
                    <Card title={`Validation Results`}>

                        <span className='mb-4 badge badge-secondary'>Total: {size(rejection.validationResults)}</span>

                        <div className='row mb-4'>
                            <div className='col-3'>
                                <label className='control-label d-block'>Gtin</label>
                                <input className='form-control'
                                    value={gtin}
                                    onChange={e => setGtin(e.target.value || null)}
                                    />
                            </div>
                            <div className='col-3'>
                                <label className='control-label d-block'>Manufacturer</label>
                                <Select
                                    isClearable={true}
                                    value={selectedManufacturer}
                                    onChange={o => setManufacturerId(o ? get(o, 'id') : null)}
                                    getOptionValue={o => get(o, 'id')}
                                    getOptionLabel={o => get(o, 'name')}
                                    options={manufacturers}
                                    />
                            </div>
                        </div>

                        {map(rejection.validationResults, (validationResult, idx) => (gtin === null || get(validationResult, 'tradeItem.gtin') === gtin) && (manufacturerId === null || get(validationResult, 'tradeItem.manufacturer.id') === manufacturerId) && (
                            <ValidationResult 
                                key={`validation-result-${idx}`}
                                validationResult={validationResult}
                                onPreComputedTradeItemClick={fetchPreComputedTradeItem}
                                />
                        ))}

                    </Card>
                </div>


                {preComputedTradeItem && (
                    <Modal
                        title={`Product view`}
                        onClose={() => setPreComputedTradeItem(null)}
                        size={"lg"}
                        >
                        <div style={{ maxHeight: "650px", overflow: "auto" }}>
                        <JSONTree
                            data={preComputedTradeItem}
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

        </PageWrapper>
    )
}

export default withRouter(FormatProcessingRejection)
