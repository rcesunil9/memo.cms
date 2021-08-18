import React from 'react'
import Card from "app/common/components/layout/Card"
import { FormatProcessingRejections } from 'app/formatProcessing/FormatProcessingRejectionsView'

const ExportActionFormatProcessingRejections = ({ exportActionId }) => {
    return (
        <Card>
            <h3>Format Rejections</h3>
            <br/>
            <FormatProcessingRejections defaultFilters={{ exportActionId }}/>
        </Card>
    )
}

export default ExportActionFormatProcessingRejections
