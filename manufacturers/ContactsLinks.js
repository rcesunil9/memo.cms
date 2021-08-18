import React, { memo, useEffect, useState, useMemo } from 'react'
import Select from 'react-select'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import slice from 'lodash/slice'
import map from 'lodash/map'
import find from 'lodash/find'
import { getAllUsersByManufacturerId, getAllUsers } from '../common/services/userManagement'

const DEFAULT_CONTACT = {
    userId: null,
    description: "",
    active: true
}

const ContactLink = ({
    contact,
    users,
    isEditing,
    // functions
    onSubmit,
    onCancel
}) => {

    const [underEditionUser, setUnderEditionUser] = useState(isEmpty(contact) ? {...DEFAULT_CONTACT} : contact)

    // memoized value
    const selectedUser = useMemo(() => isEditing ? find(users, u => get(u, 'id') === underEditionUser.userId) : find(users, u => u.id === get(contact, 'userId')), [isEditing, users, underEditionUser.userId, contact])

    return isEditing ? (
        <div className="row">

            <div className="col-9">        
                <label className="form-label">User *</label>
                <Select
                    value={selectedUser}
                    onChange={newUser => setUnderEditionUser({...underEditionUser, userId: newUser ? newUser.id : null})}
                    getOptionLabel={u => u.name}
                    getOptionValue={u => u.id}
                    options={users}
                    />
            </div>

            <div className="col-3">
                <label className="form-label">Active</label>   
                <input
                    className="form-control"
                    type="checkbox"
                    checked={underEditionUser.active}
                    onChange={e => setUnderEditionUser({...underEditionUser, active: !!e.target.checked})}
                    />
                <br/>
            </div>

            <div className="col-12">            
                <label className="form-label">Description</label>            
                <textarea 
                    className="form-control"
                    value={underEditionUser.description}
                    onChange={e => setUnderEditionUser({...underEditionUser, description: e.target.value})}
                    />
                <br/>
            </div>

            <div className="col-12"> 
                <button onClick={e => {e.preventDefault(); onCancel && onCancel()}} className="btn btn-secondary btn-sm">Cancel</button>&nbsp;
                <button onClick={e => {e.preventDefault(); onSubmit && onSubmit(underEditionUser)}} className="btn btn-secondary btn-sm">Ok</button>
            </div>

        </div>
    ) : (
        <span>{get(selectedUser, 'name')}</span>
    )

}

const ContactsLinks = ({
    manufacturerId,
    value,
    // function
    onUpdate
}) => {

    const [users, setUsers] = useState([])
    const [underEditContact, setUnderEditContact] = useState(null)
    const [editIndex, setEditIndex] = useState(null)

    useEffect(() => {
        const getUsersPromise = manufacturerId ? getAllUsersByManufacturerId(manufacturerId) : getAllUsers()
        getUsersPromise
            .then(res => setUsers(map(get(res, 'data'), u => ({
                id: get(u, 'id'),
                name: `${get(u, 'firstname')} ${get(u, 'lastname')}`,
                email: get(u, 'email')
            }))))
    }, [manufacturerId])

    return (
        <div style={{ backgroundColor: '#f5f5f5', padding: '1rem' }}>

            {underEditContact === null && <button onClick={e => {e.preventDefault(); setEditIndex(null); setUnderEditContact({})}} className="btn btn-primary btn-sm btn-block">Add new contact</button>}
            
            {underEditContact !== null && <ContactLink
                    isEditing={true}
                    users={users}
                    onCancel={e => setUnderEditContact(null)}
                    onSubmit={contact => {
                        onUpdate([...(value || []), contact])
                        setUnderEditContact(null)
                        }}
                    />}

            {map(value, (v, k) => (
                <span key={`contact-${k}`} className="mt-3" style={{ cursor: 'pointer' }}>
                    <span 
                        className={editIndex === k ? '' : 'badge badge-secondary'}
                        onClick={e => {
                            if (editIndex !== null) return
                            setUnderEditContact(null)
                            setEditIndex(k)
                        }}
                        >
                        <ContactLink 
                            isEditing={editIndex === k}
                            users={users}
                            contact={v}
                            onCancel={e => setEditIndex(null)}
                            onSubmit={contact => {
                                onUpdate([
                                    ...slice((value || []), 0, k),
                                    contact,
                                    ...slice((value || []), k + 1)
                                ])
                                setEditIndex(null)
                                }}
                            />
                    </span>

                    {editIndex !== k && <span 
                        className="badge badge-danger mr-2"
                        onClick={e => {
                            e.preventDefault()
                            onUpdate([
                                ...slice((value || []), 0, k),
                                ...slice((value || []), k + 1)
                            ])
                            setUnderEditContact(null)
                        }}
                        >
                        X
                    </span>}
                </span>
            ))}

        </div>
    )

}

function areEqual(prevProps, nextProps) {
    return prevProps.value === nextProps.value
}

export default memo(ContactsLinks, areEqual)
