import React, { useEffect, useState, useCallback } from 'react'
import update from 'immutability-helper'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import get from 'lodash/get'
import map from 'lodash/map'
import PageWrapper from "../../common/components/layout/PageWrapper"
import Card from "../../common/components/layout/Card"
import { getOffer, createOffer, updateOffer, deleteOffer } from '../../common/services/subscription'
import ActionsBar from "../../common/components/layout/ActionsBar"
import { SharedLocalizableStrings } from '../../common/components/lang/LocalizableStrings'
import useLanguages from '../../common/hooks/useLanguages'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import move from "lodash-move/lib/index";

const Offer = props => {

    const { match, history } = props

    const id = match.params.id

    const [offer, setOffer] = useState({})

    const languages = useLanguages()

    const save = useCallback(offerToSave => {
      if (!id) {
        createOffer(offerToSave)
          .then(res => {
            if(res.data) history.push(`/subscription/offer/${res.data}`)
          })
          .catch(res => alert('Error'))
      } else {
        updateOffer(offerToSave)
          .catch(res => alert('Error'))
      }
    }, [id, history])

    useEffect(() => {

      if(id) getOffer(id).then(res => setOffer(get(res, 'data') || null))
      else setOffer({})

    }, [id])

    const services = get(offer, 'services')

    const reorderServices = (fromIndex, toIndex) => {
        setOffer({...offer, services: move(services,fromIndex,toIndex)})
    }

    const getListStyle = isDraggingOver => ({
        background: isDraggingOver ? '#3e8ef7' : '',
        width: "100%",
    })

    return (
      <div className="container-fluid">
        {/* Actions */}
        <ActionsBar>
          <div className="col-4">
            <h2 className="h4 pt-1 m-0 font-weight-light">{id ? "Edit offer" : "New offer"}</h2>
          </div>
          <div className="col-8 text-right">
            <Link to={`/subscription/offers`} className="btn btn-light mr-2">
              Go back to list
            </Link>
            {id && (
              <Link to={`/subscription/offer`} className="btn btn-success mr-2">
                + Create new offer
              </Link>
            )}
            <button className="btn btn-primary mr-2" onClick={() => save(offer)}>
              {id ? 'Save' : 'Create'}
            </button>
            {id && (
              <button className="btn btn-danger" onClick={() => window.confirm('Are you sure to delete this offer?') && deleteOffer(id).then(res => {
                  history.push(`/subscription/offers`)
                })}>
                Delete offer
              </button>
            )}
          </div>
        </ActionsBar>

        <PageWrapper>
          
          <div className="row">
              <div className="col-6">
                <Card>

                  {id && (
                    <>
                      <label className="control-label">ID</label>
                      <input className="form-control disabled" value={id} readOnly={true}/>
                      <br/><br/>
                    </>
                  )}
                 

                  {/* Order */}
                  <label className="control-label">Order</label>
                  <input 
                    className="form-control"
                    onChange={e => setOffer({...offer, order: e.currentTarget.value})}
                    value={get(offer, 'order')}
                    />
                  <br/><br/>

                  <SharedLocalizableStrings
                    integrated
                    languages={languages}
                    localizableStrings={['name', 'description']}
                    labels={{
                      name: 'Name',
                      description: 'Description'
                    }}
                    components={{
                      description: 'textarea'
                    }}
                    input={offer}
                    onChange={(property, value) => setOffer(update(offer, {[property]: {$set: value}}))}
                    />
                    

                </Card>
              </div>

              <div className="col-6">
                <Card>

                    <h5>Services</h5>

                    <button 
                      className="btn btn-primary"
                      onClick={e => setOffer({
                        ...offer,
                        services: [
                          ...(get(offer, 'services') || []),
                          {}
                        ]
                      })}
                      >
                      + Add new service
                      </button>

                    <div>

                    <br/>

                        {/* Services */}
                        <DragDropContext
                            onDragEnd={e => {
                                if(e.destination && e.destination.index !== e.source.index) reorderServices(e.source.index, e.destination.index)
                            }}>
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}>

                                        {map(services, (service, serviceIndex) => (
                                            <Draggable
                                                key={`draggable-service-${serviceIndex}`}
                                                draggableId={`draggable-service-${serviceIndex}`}
                                                index={serviceIndex}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}>
                                                        <div 
                                                          key={`service-${serviceIndex}`}
                                                          style={{marginBottom: '2rem', padding: '1rem', borderBottom: '1px solid #c8e0ff', borderTop: '1px solid #c8e0ff', backgroundColor: '#f7fbff'}}
                                                          >
                                                          <SharedLocalizableStrings
                                                              integrated
                                                              languages={languages}
                                                              localizableStrings={['service']}
                                                              labels={{
                                                                  service: 'Service short title'
                                                              }}
                                                              input={{service}}
                                                              onChange={(property, value) => {
                                                                  setOffer({
                                                                      ...offer,
                                                                      services: [
                                                                          ...(services || []).slice(0, serviceIndex),
                                                                          value,
                                                                          ...(services || []).slice(serviceIndex+1)
                                                                      ]
                                                                  })
                                                              }}
                                                          />
                                                      </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}

                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>

                </Card>
              </div>

            </div>

        </PageWrapper>

      </div>
    )

}

export default withRouter(Offer)