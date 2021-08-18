import React, { useMemo } from 'react'
import TradeItemsPreComputingStatus from './TradeItemsPreComputingStatus'


function getClassForStatus(tradeItemStatus) {
    switch (tradeItemStatus) {
        case 'PreComputed':
            return 'success'
        default:
            return 'primary'
    }
}

function TradeItemPreComputingStatus({ tradeItemId, ...otherProps }) {
    const memoizedTradeItemIds = useMemo(() => [tradeItemId], [tradeItemId]) 

    return <TradeItemsPreComputingStatus tradeItemIds={memoizedTradeItemIds} {...otherProps} />

}

function TradeItemPreComputingStatusElement({tradeItemStatus, ...props}) {
    return (
        <div className={`badge badge-${getClassForStatus(tradeItemStatus)}`} {...props}>
            {tradeItemStatus}
        </div>
    )
}

export { TradeItemPreComputingStatusElement }

export default TradeItemPreComputingStatus