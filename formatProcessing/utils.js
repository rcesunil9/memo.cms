const TYPE_REJECTION_STATUS = ['Error', 'Warning', 'Info']
const TYPE_VALIDATION_TYPE = ['Xsd', 'JsonSchema', 'AmazonJson']

const REJECTION_DEFAULT_FILTERS = {
    exportActionId: null,
    rejectionStatus: null,
    validationType: null
}

export { TYPE_REJECTION_STATUS, TYPE_VALIDATION_TYPE, REJECTION_DEFAULT_FILTERS }