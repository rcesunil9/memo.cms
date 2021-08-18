import React from "react";
import { connect } from "react-redux";
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import * as actions from "../actions";
import * as selectors from "../selectors";
import Card from '../../common/components/layout/Card'
import MultipleDocumentForm from './MultipleDocumentForm'
import * as utils from '../utils'
import Channel from './Channel'

class DocumentManagement extends React.Component {

  componentDidMount() {
    this.init();
  }

  async init() {
    const { tradeItem, getDocuments } = this.props;
    getDocuments(get(tradeItem, 'tradeItemId'));
  }

  render() {
    const { tradeItem, editDocument, channels, targetMarkets, retailers, multipleDocuments, documents, isDocumentFetching } = this.props;
    const {setMultipleDocumentsForm, changeMultipleDocumentFormProperty, removeMultipleDocumentFormItem, uploadButchDocuments, deleteDocument, setDocumentEdit, setTradeItemProperty} = this.props;

    return <React.Fragment>
      <Card title="Documents actions" sm>
        <div className="row">
          <div className="col">
            <button
              onClick={() => {
                setMultipleDocumentsForm([]);
              }}
              className="btn btn-secondary ml-2"
            >
              +++ Add multiple documents
            </button>
          </div>
        </div>
      </Card>
      {multipleDocuments && (
        <MultipleDocumentForm
          multipleDocuments={multipleDocuments}
          uploadButchDocuments={uploadButchDocuments}
          tradeItem={tradeItem}
          setMultipleDocumentsForm={setMultipleDocumentsForm}
          changeMultipleDocumentFormProperty={changeMultipleDocumentFormProperty}
          removeMultipleDocumentFormItem={removeMultipleDocumentFormItem}
        />
      )}
      <Card title="Documents" sm>
        <ul className="list-group">
          {!isEmpty(documents) && map(documents, (doc, index) => {
            return <li
              className="list-group-item d-flex align-items-center flex-wrap"
              key={`documents-${index}`}
            >
              {get(doc, 'manuallyImported') && <span className='badge badge-warning d-block mb-2'>Manually imported</span>}
              <div className="col-9">{get(doc, 'filename')}</div>
              <div className="col-1">
                <button
                  className="btn btn-danger btn-sm"
                  disabled={isDocumentFetching}
                  onClick={e => {
                    e.preventDefault()
                    deleteDocument(get(doc, 'id'))
                  }}
                >
                  x
                </button>
              </div>
              <button
                className="btn btn-link btn-sm col-2"
                onClick={e => {
                  e.preventDefault()
                  if (get(editDocument, 'id') === doc.id) {
                    setDocumentEdit()
                  } else setDocumentEdit(doc)
                }}
              >
                {get(editDocument, 'id') === doc.id ? 'Hide' : 'Show channels'}
              </button>
              {get(editDocument, 'id') === doc.id &&
              <div className="col-12">
                <Channel
                  channels={channels}
                  targetMarkets={targetMarkets}
                  retailers={retailers}
                  onChange={value => setTradeItemProperty(utils.getTradeItemChannelKey('Documents', index), value)}
                />
              </div>}
            </li>
          })}
        </ul>
      </Card>
    </React.Fragment>
  }
}

const mapStateToProps = state => {
  return {
    tradeItem: selectors.getTradeItemToEdit(state),
    editDocument: selectors.getDocumentEdit(state),
    channels: selectors.getEditDocumentChannels(state),
    groupSelected: selectors.getGroupSelected(state),
    multipleDocuments: selectors.getMultipleDocuments(state),
    documents: selectors.getDocuments(state),
    isDocumentFetching: selectors.isDocumentFetching(state),
    targetMarkets: selectors.getTargetMarkets(state),
    retailers: selectors.getRetailers(state),
  };
};

export default connect(
  mapStateToProps,
  actions
)(DocumentManagement);
