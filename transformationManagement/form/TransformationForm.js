import React from "react"
import { connect } from "react-redux"
import get from "lodash/get"
import map from "lodash/map"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import * as selectors from "../selectors/edit"
import * as actions from "../actions/edit"
import ActionSetForm from "./ActionSetForm"

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? '#3e8ef7' : '',
    width: "100%",
  })

const ActionSetRow = ({name, onClick, onRemove, selected}) => (
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
    name,
    transformation,
    actionSets,
    actionSet,
    updateTransformation,
    addNewActionSet,
    selectActionSet,
    switchActionsSets,
    deleteActionSet,
}) => (
    <React.Fragment>

        <h5 className="mb-4">Edit transformation ({get(transformation, "name")})</h5>

        <div className="row mb-3">
            {/* Name */}
            <div className="col-6">
                <div className="form-group">
                    <label>Name *:</label>
                    <input 
                        onChange={e => updateTransformation("name", e.target.value)}
                        value={name || ""}
                        className="form-control" />
                </div>
            </div>
        </div>

        <div className="row mb-3">
            <div className="col-3">
                {/* Add new action set */}
                <button 
                    onClick={e => addNewActionSet()}
                    className="btn btn-light mb-3">+ Add new action set</button>
                
                {/* Orderable list */}
                <DragDropContext
                onDragEnd={e => {
                    if(e.destination && e.destination.index !== e.source.index) switchActionsSets(e.source.index, e.destination.index)
                }}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}>
                        {map(actionSets, (aSet, tIndex) => (
                        <Draggable 
                            key={`action-set-${tIndex}`} 
                            draggableId={`action-set-${tIndex}`} 
                            index={tIndex}>
                            {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}>
                                <ActionSetRow 
                                    key={`transformation-mgmt-action-set-${tIndex}`} 
                                    selected={actionSet === aSet}
                                    onClick={e => selectActionSet(tIndex)}
                                    onRemove={e => deleteActionSet(tIndex)}
                                    name={get(aSet, "actionSet.name")} 
                                    id={`action-set-${tIndex}`} />
                            </div>
                            )}
                        </Draggable>
                        ))}
                    </div>
                    )}
                </Droppable>
                </DragDropContext>
            </div>

            {/* Action set form */}
            {actionSet && <div className="col-9">
                <ActionSetForm />
            </div>}
            
        </div>

    </React.Fragment>
)


const mapStateToProps = (state) => {
    return {
        name: selectors.getSelectedTransformation(state).name,
        transformation: selectors.getSelectedTransformation(state),
        actionSets: selectors.getActionSets(state),
        actionSet: selectors.getSelectedActionSet(state),
    }
}
export default connect(mapStateToProps, actions)(TransformationSetForm)