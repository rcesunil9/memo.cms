const ANALYSIS_STATUS = [ "Pending", "AnalysisOnGoing", "Analysed", "AnalysisFailed" ]
const ENRICHMENT_STATUS = [ "NotComplete", "Complete" ]
const MATCHING_STATUS = [ "NotComplete", "NotExisting", "Complete" ]
const EXPORT_STATUS = [ "NotExported", "Exported" ]

const ENRICHMENT_REQUEST_FILTERS = {
    analysisStatus: [],
    enrichmentStatus: null,
    retailerId: null
}

const ENRICHMENT_TRADE_ITEM_RESULTS_FILTERS = {
    gtin: null,
    manufacturerReference: null,
    manufacturerId: null,
    matchingStatus: [],
    exportStatus: null
}

export { ANALYSIS_STATUS,
    ENRICHMENT_STATUS,
    MATCHING_STATUS,
    EXPORT_STATUS,
    ENRICHMENT_REQUEST_FILTERS,
    ENRICHMENT_TRADE_ITEM_RESULTS_FILTERS
}
