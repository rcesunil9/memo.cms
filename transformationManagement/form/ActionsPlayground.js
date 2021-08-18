import React from "react"
import { connect } from "react-redux"
import dotProp from "dot-prop-immutable"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import map from "lodash/map"
import get from "lodash/get"
import isEmpty from "lodash/isEmpty"
import * as selectors from "../selectors/edit"
import * as actions from "../actions/edit"
import * as utils from "../utils"
import Editor from "../../common/components/editor/Editor"
import Modal from "../../common/components/layout/Modal"

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? '#3e8ef7' : '',
  width: "100%",
})

const ActionRow = ({className, id, action, name, onClick, onDelete}) => (
  <div 
    onClick={e => onClick()}
    className={`text-white px-2 py-2 ${className || ""}`}>
    {name}
    <button className="btn btn-link p-0 float-right text-white" onClick={e => onDelete()}>Remove</button>
  </div>
)

class ActionsPlayground extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showFullscreen: false
        }
    }

    toggleFullscreen() {
        this.setState(dotProp.set(this.state, "showFullscreen", !this.state.showFullscreen))
    }


    render() {

        const {
            actionSet,
            selectedActionIndex,
            actionsDefinitions,
            playgroundTradeItemId,
            playgroundResult,
            // functions
            editAction,
            switchActions,
            deleteAction,
            setPlaygroundTradeItemId,
            doPlayground,
        } = this.props

        const { showFullscreen } = this.state

        return (
            <React.Fragment>    
                
                {/* Actions row */}
                {!isEmpty(get(actionSet, "actionSet.orderedParametrizedActions")) && <div className="row">
                    <div className="col-12">
                        <h5>Actions playground</h5>
        
                        {/* Input value */}
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label className="control-label">Select a product to test:</label>
                                    <input 
                                        className="form-control"
                                        value={playgroundTradeItemId || ""}
                                        onChange={e => setPlaygroundTradeItemId(e.target.value)}
                                        />
                                    {playgroundTradeItemId && <button
                                        onClick={e => doPlayground(playgroundTradeItemId, actionSet)}
                                        className="btn btn-block btn-primary mt-2"
                                        >Go!</button>}
                                </div>
                            </div>
                        </div>
        
                        {/* Manage actions */}
                        <div className="row mb-3">
                        <div className="col">
                            <DragDropContext
                            onDragEnd={e => {
                                if(e.destination && e.destination.index !== e.source.index) switchActions(e.source.index, e.destination.index)
                            }}>
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}>
                                    {map(get(actionSet, "actionSet.orderedParametrizedActions"), (a, k) => (
                                    <Draggable 
                                        key={`action-${k}`} 
                                        draggableId={`action-${k}`} 
                                        index={k}>
                                        {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}>
                                            <ActionRow
                                                name={utils.isBuiltInAction(a) ? get(actionsDefinitions, `${a.builtInActionDefinitionId}.name`, a.discriminator) : `Template`}
                                                onClick={() => editAction(a,k)}
                                                onDelete={() => deleteAction(k)}
                                                selected={k === selectedActionIndex}
                                                action={a}
                                                className={`${k === selectedActionIndex ? "bg-surprise" : "bg-secondary"} mb-2`}
                                                id={`action-${k}`} />
                                        </div>
                                        )}
                                    </Draggable>
                                    ))}
                                </div>
                                )}
                            </Droppable>
                            </DragDropContext>
                        </div>
                        </div>
        
                        {/* Output */}
                        <div className="row">
                            <div className="col">

                                <Editor
                                    options={{
                                        readOnly: true
                                    }}
                                    value={isEmpty(playgroundResult) ? "" : JSON.stringify(playgroundResult, null, 2)}
                                    type="JSON"
                                    />

                                {playgroundResult && <button 
                                    onClick={e => this.toggleFullscreen()}
                                    className="btn btn-primary mt-3"
                                    >Toggle fullscreen</button>}

                                {showFullscreen && <Modal title={`Playground result`} size="lg" onClose={() => this.toggleFullscreen()}>
                                    <Editor
                                        height="1000px"
                                        options={{
                                            readOnly: true
                                        }}
                                        value={isEmpty(playgroundResult) ? "" : JSON.stringify(playgroundResult, null, 2)}
                                        type="JSON"
                                        />
                                    </Modal>}
                            </div>
                        </div>
                    </div>
                </div>}
        
            </React.Fragment>
        )
    }
}



const mapStateToProps = (state) => {
  return {
    actionSet: selectors.getSelectedActionSet(state),
    action: selectors.action(state),
    selectedActionIndex: selectors.selectedActionIndex(state),
    actionsDefinitions: selectors.getActionsDefinitionsKeyedById(state),
    playgroundTradeItemId: selectors.getPlaygroundTradeItemId(state),
    playgroundResult: selectors.getPlaygroundResult(state),
  }
}

export default connect(mapStateToProps, actions)(ActionsPlayground)
