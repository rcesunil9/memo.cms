import React, { useEffect, useState } from 'react'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import { getTradeItemsPrecomputingStatus } from '../common/services/preComputing'
import { TradeItemPreComputingStatusElement } from './TradeItemPreComputingStatus'


function TradeItemsPreComputingStatus({ style, tradeItemIds, name }) {
    const [tradeItemPreComputingStatuses, setTradeItemPreComputingStatuses] = useState([])

    useEffect(() => {
        if (isEmpty(tradeItemIds)) return

        getTradeItemsPrecomputingStatus(tradeItemIds).then(res => setTradeItemPreComputingStatuses(get(res, 'data') || []))

    }, [ tradeItemIds ])

    return (
        <div style={style}>
            {map(get(tradeItemPreComputingStatuses, 'tradeItemPreComputingStatus'), (tradeItemStatus, k) => (
                <TradeItemPreComputingStatusElement key={`tradeitemstatus-${k}-${name || 'noname'}`} tradeItemStatus={get(tradeItemStatus, 'status')}/>
            ))}
        </div>
    )

}

export default TradeItemsPreComputingStatus