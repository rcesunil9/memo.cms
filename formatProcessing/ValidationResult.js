import React from 'react'
import { Link } from 'react-router-dom'
import { Formula } from 'app/common/components/formula/Formula'

const style = {
    borderTop: '1px solid #eee' ,
    paddingTop: '16px'
}

const ValidationResult = ({ validationResult, onPreComputedTradeItemClick }) => {
    return (
        <div className='row mb-3' style={style}>
            <div className='col-5'>
                <Link target='_blank' className='mb-1 mr-2 btn btn-sm btn-light' to={`/trade-item/${validationResult.tradeItemId}`}>
                    View product
                    <i className='ml-2 icon-action-redo'/>
                </Link>
                <button className='mb-1 btn btn-sm btn-light' onClick={() => onPreComputedTradeItemClick(validationResult.tradeItemId)}>
                    View pre-computed product
                    <i className='ml-2 icon-action-redo'/>
                </button>
                <small className='mb-1 d-block'>{validationResult.path}</small>
                <div>{validationResult.description}</div>
            </div>
            <div className='col-7'>
                <Formula>{validationResult.rawMessage}</Formula>
            </div>
        </div>
    )
}

export default React.memo(ValidationResult)
