import React from "react"
import { connect } from "react-redux"
import isEmpty from "lodash/isEmpty"
import Select from "react-select"
import Modal from "../../common/components/layout/Modal"
import * as actions from "../actions/JSONTemplate"
import * as selectors from "../selectors/JSONTemplate"
import JSONTemplateValidationResult from "./JSONTemplateValidationResult"


class JSONTemplateValidation extends React.Component {

    componentDidMount() {
        const { tradeItemCategory } = this.props
        const { getValidationExportActions, resetValidationExportAction } = this.props
        if(tradeItemCategory) {
            resetValidationExportAction()
            getValidationExportActions(tradeItemCategory.code)
        }
    }

    render() {

        const {
            formatConfigurationId,
            tradeItemId,
            exportAction,
            exportActions,
            areExportActionsFetching,
            validationResult,
            // functions
            setValidationTradeItemId,
            setValidationExportAction,
            validateJSONFormatConfiguration,
            willValidate,
            resetValidationResult,
        } = this.props

        return (
            <React.Fragment>
        
                <div className="form-group">
                    <label className="control-label">Validate template</label>
        
                    {/* Trade item id */}
                    <input
                        value={tradeItemId || ""}
                        onChange={e => setValidationTradeItemId(e.target.value)}
                        placeholder="Trade item ID"
                        className="form-control mb-2"
                        />
        
                    {/* Action */}
                    <Select 
                        loading={areExportActionsFetching}
                        isClearable={true}
                        getOptionLabel={a => a.name}
                        getOptionValue={a => a.id}
                        options={exportActions}
                        onChange={a => setValidationExportAction(a)}
                        value={exportAction} />
                    
                    {/* Validate */}
                    <button
                        onClick={e => {
                            e.preventDefault()
                            if(willValidate) willValidate()
                            validateJSONFormatConfiguration(formatConfigurationId, tradeItemId, exportAction.id)
                        }}
                        className="mt-2 btn btn-block btn-primary"
                        >Validate JSON template</button>

                    {!isEmpty(validationResult) && <Modal 
                        size="lg"
                        title={`JSON template validation result`} 
                        onClose={resetValidationResult}>

                        <JSONTemplateValidationResult
                            validationResult={validationResult}
                            />

                    </Modal>}
        
                </div>
        
            </React.Fragment>
        )

    }

}

const mapStateToProps = state => { return {

    tradeItemId: selectors.getTradeItemId(state),
    exportAction: selectors.getExportAction(state),
    exportActions: selectors.getExportActions(state),
    areExportActionsFetching: selectors.areExportActionsFetching(state),
    validationResult: selectors.getValidationResult(state),

}}

export default connect(mapStateToProps, actions)(JSONTemplateValidation)