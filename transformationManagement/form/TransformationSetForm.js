import React from "react"
import { connect } from "react-redux"
import get from "lodash/get"
import map from "lodash/map"
import find from "lodash/find"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import * as selectors from "../selectors/edit"
import * as actions from "../actions/edit"
import Select from "react-select";
import TransformationForm from "./TransformationForm"
import Sticky from "react-stickynode"


const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? '#3e8ef7' : '',
    width: "100%",
  })

const TransformationRow = ({name, onClick, onRemove, selected}) => (
    <div 
        onClick={onClick}
        style={{cursor: "pointer"}}
        className={`col-12 border p-2 ${selected ? "bg-surprise text-white" : ""}`}>
        { name || "No name" }
        <button 
            onClick={e => {
                e.preventDefault()
                onRemove()
            }}
            className={`btn btn-link btn-sm p-0 float-right ${selected ? "bg-surprise text-white" : "text-danger"}`}>Remove</button>
    </div>
)


const TransformationSetForm = ({
    id,
    name,
    taxonomyId,
    taxonomies,
    tradeItemCategory,
    tradeItemCategories,
    areTradeItemCategoriesLoading,
    areTaxonomiesLoading,
    transformations,
    selectedTransformation,
    updateTransformationSet,
    updateTransformationSetTradeItemCategory,
    updateTransformationSetTaxonomyId,
    addNewTransformation,
    selectTransformation,
    deleteTransformation,
    switchTransformations,
}) => {
    
    return <React.Fragment>
        <div className="row mb-3">
        
            {/* Name */}
            <div className="col-4">
                <div className="form-group">
                    <label>Name *:</label>
                    <input 
                        onChange={e => updateTransformationSet("name", e.target.value)}
                        value={name || ""}
                        className="form-control" />
                </div>
            </div>

            {/* Taxonomy */}
            <div className="col-4">
                <div className="form-group">
                    <label>Taxonomy *:</label>
                    <Select
                        disabled={!!id}
                        options={taxonomies}
                        value={find(taxonomies, s => s.id === taxonomyId) || null}
                        name={"taxonomyId"}
                        getOptionLabel={o => o.name}
                        getOptionValue={o => o.id}
                        isLoading={areTaxonomiesLoading}
                        onChange={taxonomy => {
                            updateTransformationSetTaxonomyId(taxonomy.id)
                        }}
                    />
                </div>
            </div>

            {/* Trade Item Category */}
            <div className="col-4">
                <div className="form-group">
                    <label>Trade Item Category *:</label>
                    <Select
                        disabled={!!id}
                        options={tradeItemCategories}
                        value={find(tradeItemCategories, s => tradeItemCategory && s.code.code === tradeItemCategory.code) || null}
                        name={"tradeItemCategoryCode"}
                        getOptionLabel={o => `${o.code.code} - ${o.name} (${o.unspsc})`}
                        getOptionValue={o => o.code.code}
                        isLoading={areTradeItemCategoriesLoading}
                        onChange={tradeItemCategory => {
                            updateTransformationSetTradeItemCategory(tradeItemCategory.code.code)
                        }}
                    />
                </div>
            </div>

        </div>

        <div className="row">

            {/* List of transformations */}
            {taxonomyId && tradeItemCategory && name && <div className="col-3">

                <h5 className="mb-4">Transformations</h5>
                
                {/* Add new transformation */}
                <button 
                    onClick={e => addNewTransformation()}
                    className="btn btn-light mb-3">+ Add new transformation</button>

                {/* Transformations */}                
                <DragDropContext
                onDragEnd={e => {
                    if(e.destination && e.destination.index !== e.source.index) switchTransformations(e.source.index, e.destination.index)
                }}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}>
                        {map(transformations, (transformation, tIndex) => (
                        <Draggable 
                            key={`transformation-${tIndex}`} 
                            draggableId={`transformation-${tIndex}`} 
                            index={tIndex}>
                            {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}>
                                <TransformationRow 
                                    key={`transformation-mgmt-transformation-${tIndex}`} 
                                    selected={transformation === selectedTransformation}
                                    onClick={e => selectTransformation(tIndex)}
                                    onRemove={e => deleteTransformation(tIndex)}
                                    name={get(transformation, "name")}/>
                            </div>
                            )}
                        </Draggable>
                        ))}
                    </div>
                    )}
                </Droppable>
                </DragDropContext>          

            </div>}
            
                {/* Transformation form */}
                <div className="col-9">
                    <Sticky top={100}>
                        { selectedTransformation && <TransformationForm /> }
                    </Sticky>
                </div>
        </div>
    </React.Fragment>
}


const mapStateToProps = (state) => {
    return {
        id: selectors.getTransformationSet(state).id,
        name: selectors.getTransformationSet(state).name,
        taxonomyId: selectors.getTransformationSet(state).taxonomyId,
        tradeItemCategory: selectors.getTransformationSet(state).tradeItemCategory,
        taxonomies: selectors.getTaxonomies(state),
        tradeItemCategories: selectors.getTradeItemCategories(state),
        areTradeItemCategoriesLoading: selectors.areTradeItemCategoriesLoading(state),
        areTaxonomiesLoading: selectors.areTaxonomiesLoading(state),
        transformations: selectors.getTransformations(state),
        selectedTransformation: selectors.getSelectedTransformation(state),
    }
}
export default connect(mapStateToProps, actions)(TransformationSetForm)