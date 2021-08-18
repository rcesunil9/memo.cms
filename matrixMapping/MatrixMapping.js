import React from "react"
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import Sticky from 'react-stickynode'
import update from 'immutability-helper'
import Select from 'react-select'
import isEmpty from "lodash/isEmpty"
import get from "lodash/get"
import * as selectors from "./selectors"
import * as actions from "./actions"
import * as utils from './utils'
import PageWrapper from "../common/components/layout/PageWrapper"
import Card from "../common/components/layout/Card"
import Modal from "../common/components/layout/Modal"
import EditMatrixMapping from "./EditMatrixMapping"
import MatrixAnalysisTable from "./MatrixAnalysisTable"
import DuplicateMatrixMapping from "./DuplicateMatrixMapping"
import CreateMatrixMapping from "./CreateMatrixMapping"
import EditMatrixAnalysis from "./EditMatrixAnalysis"
import UploadNewMatrixFile from "./UploadNewMatrixFile"


class MatrixMapping extends React.Component {

  componentDidMount() {
    const { getExistingMappings } = this.props
    getExistingMappings()
  }

  selectMapping(mapping) {
    const { hasChanged } = this.props
    const { initMappingById, resetMapping, setMappingDiscriminator } = this.props
    if(isEmpty(mapping)) resetMapping()
    else if(hasChanged){
      if(window.confirm(`Current mapping have changed, are you sure?`)) {
        setMappingDiscriminator(utils.mappingDiscriminatorKeyGroup[mapping.discriminator])
        initMappingById(mapping.id)
      }
      return
    }
    else {
      setMappingDiscriminator(utils.mappingDiscriminatorKeyGroup[mapping.discriminator])
      initMappingById(mapping.id)
    }
  }

  duplicate(mappingTitle, mapping) {
    const { createNonStandardMapping, createStandardMapping, showDuplicateView } = this.props

    const _createMapping = get(mapping, 'discriminator') === "NonStandardMappingViewModel" ? createNonStandardMapping : createStandardMapping

    _createMapping(Object.assign({}, mapping, {id: "", mappingTitle})).then(newMapping => showDuplicateView(false))
  }

  render() {

    const { fetchingExistingMappings,
      existingMappings,
      mappingSelected,
      matrixAnalysis,
      isMatrixAnalysisDetailMode,
      mappedColumns,
      discriminator,
      isDuplicating,
      duplicateName,
      isDuplicateNameValid,
      isCreatingNewMatrix,
      matrixUnderEdition,
      uploadedFileData,
      createMappingShow,
      createMappingMapping,
      createMappingTradeItemCategories,
      createMappingTaxonomies,
      isMappingCreationNameValid,
      isMatrixAnalysisUploadDisplayed } = this.props

    const { setMatrixAnalysisDetailMode,
      setSelectedMapping,
      showDuplicateView,
      setDuplicateName,
      deleteMappingById,
      creatingNewMatrixAnalysis,
      setFileUploadReceive,
      uploadNewFileForAnalysis,
      setMatrixAnalysisUnderEdition,
      saveStandardMatrixAnalysis,
      saveNonStandardMatrixAnalysis,
      startCreatingNewMapping,
      createNewMapping,
      setNewMapping,
      uploadMatrixAnalysis,
      setMappingDiscriminator} = this.props

    return (
      <PageWrapper>
        <div className="row mb-3">
          <div className="col-3">
            {/* Select existing mappings */}
            <Sticky top={70}>
              <Card title={`Existing mappings`}>
                <Select
                  value={mappingSelected || null}
                  onChange={mapping => this.selectMapping(mapping)}
                  getOptionLabel={option => option.mappingTitle}
                  getOptionValue={option => option.id}
                  isDisabled={isEmpty(existingMappings)}
                  isLoading={fetchingExistingMappings}
                  isClearable={true}
                  isSearchable={true}
                  name="existing-mapping"
                  options={existingMappings}/>
                <div>
                  <button className="btn btn-link px-0 mt-2"
                          onClick={e => {
                            startCreatingNewMapping('', 'StandardMappingViewModel')
                            setMappingDiscriminator('StandardMappingViewModel')
                          }}>Create new standard mapping
                  </button>
                </div>
                <div>
                  <button className="btn btn-link px-0 mt-2"
                          onClick={e => {
                            creatingNewMatrixAnalysis(true)
                            setMappingDiscriminator('NonStandardMappingViewModel')
                          }}>Create new custom mapping
                  </button>
                </div>

                <div>
                  <hr/>
                  <div>
                    <button className="btn btn-link px-0" onClick={e => {
                      creatingNewMatrixAnalysis(true)
                      setMappingDiscriminator('StandardMappingViewModel')
                    }}>Configure standard matrix analysis</button>
                  </div>
                </div>


                  {/* Actions links on selected mapping */}
                  {mappingSelected && <div>
                    <div><button className="btn btn-link px-0" onClick={e => showDuplicateView(true)}>Duplicate mapping</button></div>
                    <div><button className="btn btn-link text-danger px-0" onClick={e => {
                      e.preventDefault()
                      window.confirm(`Are you sure?`) && deleteMappingById(mappingSelected.id)
                    }}>Delete mapping</button></div>
                  </div>}
                  {matrixAnalysis && <div><hr/>
                    <div><button className="btn btn-link px-0" onClick={e => setMatrixAnalysisDetailMode(true)}>View matrix analysis</button></div>
                    <div><button className="btn btn-link px-0" onClick={e => setMatrixAnalysisUnderEdition(matrixAnalysis)}>Update matrix analysis</button></div>
                  </div>}

                  {/* Duplicate view */}
                  {isDuplicating && <Modal title={`Duplicate mapping ${get(mappingSelected, "mappingTitle")}`} onClose={e => showDuplicateView(false)}>
                    <DuplicateMatrixMapping
                      onDuplicateNameChanged={name => setDuplicateName(name)}
                      onDuplicate={() => isDuplicateNameValid && this.duplicate(duplicateName, mappingSelected)}
                      onCancel={() => showDuplicateView(false)}
                      isDuplicateNameValid={isDuplicateNameValid}
                      duplicateName={duplicateName} />
                  </Modal>}

                  {/* Matrix analysis */}
                  {isMatrixAnalysisDetailMode && <Modal title={`Matrix analysis`} onClose={e => setMatrixAnalysisDetailMode(false)} size={`lg`}>
                    <MatrixAnalysisTable
                      matrixAnalysis={matrixAnalysis}
                      mappedColumns={mappedColumns} />
                  </Modal>}

                  {/* Edit matrix analysis */}
                  {matrixUnderEdition && <Modal title={`Edit ${discriminator === 'StandardMappingViewModel' ? 'standard' : 'non standard'} matrix analysis`} onClose={e => setMatrixAnalysisUnderEdition(null)}>
                    <EditMatrixAnalysis
                      matrixAnalysis={matrixUnderEdition}
                      onUploadNewFileRequest={() => uploadMatrixAnalysis(true)}
                      onCancel={() => setMatrixAnalysisUnderEdition(null)}
                      onSave={() => {
                        if (discriminator === 'StandardMappingViewModel') {
                          saveStandardMatrixAnalysis(matrixUnderEdition)
                        } else saveNonStandardMatrixAnalysis(matrixUnderEdition).then(_ma => isCreatingNewMatrix
                          ? startCreatingNewMapping(_ma.id, discriminator)
                          : setSelectedMapping(update(mappingSelected, {matrixAnalysisId: {$set: _ma.id}})))
                      }}
                      onChange={m => setMatrixAnalysisUnderEdition(m)} />
                  </Modal>}

                  {/* Upload new file for matrix analysis */}
                  {isMatrixAnalysisUploadDisplayed && <Modal
                    title={`Configure new ${discriminator === 'StandardMappingViewModel' ? 'standard' : 'non standard'} matrix analysis`}
                    onClose={e => {
                      creatingNewMatrixAnalysis(false)
                      uploadMatrixAnalysis(false)}}>
                    <UploadNewMatrixFile
                      fileData={uploadedFileData}
                      onChange={data => setFileUploadReceive(data)}
                      onUpload={() => {
                        uploadNewFileForAnalysis(uploadedFileData)
                          .then(m => setMatrixAnalysisUnderEdition(m))
                        uploadMatrixAnalysis(false)}}
                      onCancel={() => {
                        setFileUploadReceive(null)
                        uploadMatrixAnalysis(false)
                        creatingNewMatrixAnalysis(false)
                        setMappingDiscriminator(null)
                      }}/>
                  </Modal>}

                  {/* Mapping name and trade item categories */}
                  {createMappingShow && <Modal title={`Create new mapping`}>
                    <CreateMatrixMapping
                      onChange={m => setNewMapping(m)}
                      onCreate={() => createNewMapping(createMappingMapping)}
                      defaultMapping={createMappingMapping}
                      isNameValid={isMappingCreationNameValid}
                      tradeItemCategories={createMappingTradeItemCategories}
                      taxonomies={createMappingTaxonomies} 
                      />
                  </Modal>}

              </Card>
            </Sticky>
          </div>
          <div className="col-9">
            { mappingSelected && <EditMatrixMapping />}
          </div>
        </div>
      </PageWrapper>
    )
  }
}

const mapStateToProps = (state) => {
    return {
      originalMapping: selectors.getOriginalMapping(state),
      existingMappings: selectors.getExistingMappingsForListing(state),
      fetchingExistingMappings: selectors.getExistingMappingsFetching(state),
      mappingSelected: selectors.getSelectedMapping(state),
      matrixAnalysis: selectors.getCurrentMatrixAnalysis(state),
      discriminator: selectors.getMappingDiscriminator(state),
      isMatrixAnalysisDetailMode: selectors.isMatrixAnalysisDetailMode(state),
      hasChanged: selectors.hasMappingChanged(state),
      mappedColumns: selectors.getMappedColumnsByTabAndGroup(state),
      isDuplicating: selectors.isDuplicating(state),
      duplicateName: selectors.getDuplicateName(state),
      isDuplicateNameValid: selectors.isDuplicateNameValid(state),
      matrixUnderEdition: selectors.getCurrentMatrixAnalysisUnderEdition(state),
      isCreatingNewMatrix: selectors.isCreatingMatrixAnalysis(state),
      uploadedFileData: selectors.getFileUploadData(state),
      createMappingShow: selectors.getCreateMappingShow(state),
      createMappingMapping: selectors.getCreateMappingMapping(state),
      createMappingGroups: selectors.getCreateMappingGroups(state),
      createMappingTradeItemCategories: selectors.getCreateMappingTradeItemCategories(state),
      createMappingTaxonomies: selectors.getCreateMappingTaxonomies(state),
      isMappingCreationNameValid: selectors.isMappingCreationNameValid(state),
      isMatrixAnalysisUploadDisplayed: selectors.isMatrixAnalysisUploadDisplayed(state)
    }
}

export default withRouter(connect(mapStateToProps, actions)(MatrixMapping))
