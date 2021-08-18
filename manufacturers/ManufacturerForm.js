import React from "react"
import dotProp from "dot-prop-immutable"
import Select from "react-select"
import filter from "lodash/filter"
import find from 'lodash/find'
import indexOf from "lodash/indexOf"
import get from "lodash/get"
import map from "lodash/map"
import { inputChanger } from "./utils"
import ContactLinks from './ContactsLinks'
import CompanyPrefixes from './CompanyPrefixes'

const ManufacturerForm = ({ 
  id,
  manufacturer, 
  exportActions,
  pdfExportActions,
  // functions
  onChange, 
  onSave 
}) => {
  const save = e => {
    e.preventDefault()
    onSave()
  }

  return (
    <form onSubmit={save}>
      <div className="form-group field field-object">
        <fieldset>

          {/* onboarded */}
          <div className="form-group field field-string">
            <label className="control-label">Onboarded?</label>
            <input
              className="form-control"
              type="checkbox"
              checked={get(manufacturer, 'onBoarded') || false}
              name="onBoarded"
              onChange={inputChanger(manufacturer, onChange)}
            />
          </div>

          {manufacturer.id && (
            <div className="form-group field field-string">
              <label className="control-label">Manufacturer ID</label>
              <input className="form-control" disabled value={manufacturer.id} />
            </div>
          )}

          {/* Name */}
          <div className="form-group field field-string">
            <label className="control-label">Name*</label>
            <input
              className="form-control"
              name="name"
              value={manufacturer.name}
              required
              onChange={inputChanger(manufacturer, onChange)}
            />
          </div>

          {/* const currentOffer = useMemo(() => find(offers, o => get(o, 'id') === currentSubscriptionOfferId), [offers, currentSubscriptionOfferId]) */}


          {/* Default Export action */}
          <div className="form-group field field-string">
            <label className="control-label">Default Export Action</label>
            <Select
              closeMenuOnSelect={false}
              value={find(exportActions, o => get(o, 'id') === get(manufacturer, "defaultExportActionId"))       }
              onChange={exportActionsSelected => onChange(dotProp.set(manufacturer, "defaultExportActionId", exportActionsSelected ? exportActionsSelected.id : null))}
              isClearable={true}
              getOptionLabel={o => o.name}
              getOptionValue={o => o.id}
              options={exportActions}
            />
          </div>

          {/* Export actions */}
          <div className="form-group field field-string">
            <label className="control-label">Export actions</label>
            <Select
              isMulti
              closeMenuOnSelect={false}
              value={filter(
                exportActions,
                r => indexOf(get(manufacturer, "uiExportActionIds", []), r.id) !== -1
              )}
              onChange={exportActionsSelected => onChange(dotProp.set(manufacturer, "uiExportActionIds", exportActionsSelected ? map(exportActionsSelected, ea => ea.id) : []))}
              isClearable={true}
              getOptionLabel={o => o.name}
              getOptionValue={o => o.id}
              options={exportActions}
            />
          </div>

          {/* PDF Export actions */}
          <div className="form-group field field-string">
            <label className="control-label">PDF Export actions</label>
            <Select
              isMulti
              closeMenuOnSelect={false}
              value={filter(
                pdfExportActions,
                r => indexOf(get(manufacturer, "downloadPdfActionIds", []), r.id) !== -1
              )}
              onChange={exportActionsSelected => onChange(dotProp.set(manufacturer, "downloadPdfActionIds", exportActionsSelected ? map(exportActionsSelected, ea => ea.id) : []))}
              isClearable={true}
              getOptionLabel={o => o.name}
              getOptionValue={o => o.id}
              options={pdfExportActions}
            />
          </div>
          

          {/* External ID */}
          <div className="form-group field field-string">
            <label className="control-label">External ID</label>
            <input
              className="form-control"
              name="externalId"
              value={manufacturer.externalId || ""}
              onChange={inputChanger(manufacturer, onChange)}
            />
          </div>

          <div className="row">
            <div className="col">
                {/* Pdf download checkbox */}
                <div className="form-group field field-string">
                  <label className="control-label">Allow PDF download</label>
                  <input
                    className="form-control"
                    type="checkbox"
                    checked={get(manufacturer, 'canDownloadPdfTradeItemSheet') || false}
                    name="canDownloadPdfTradeItemSheet"
                    onChange={inputChanger(manufacturer, onChange)}
                  />
                </div>
            </div>
            <div className="col">              
              {/* Authorize Automatic Mine for Conflict */}
              <div className="form-group field field-string">
                <label className="control-label">Authorize automatic Mine for conflict</label>
                <input
                  className="form-control"
                  type="checkbox"
                  checked={get(manufacturer, 'authorizeAutomaticMineForConflict') || false}
                  name="authorizeAutomaticMineForConflict"
                  onChange={inputChanger(manufacturer, onChange)}
                />
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col">
                {/* Pdf download checkbox */}
                <div className="form-group field field-string">
                  <label className="control-label">Contacts links</label>
                  <ContactLinks
                    manufacturerId={id}
                    value={get(manufacturer, 'contactLinks')}
                    onUpdate={contactLinks => onChange({...(manufacturer || {}), contactLinks })}
                    />
                </div>
            </div>
            <div className="col">              
              {/* Company prefixes */}
              <div className="form-group field field-string">
                <label className="control-label">Company prefixes</label>
                <CompanyPrefixes
                    value={get(manufacturer, 'gs1CompanyPrefixes')}
                    onUpdate={gs1CompanyPrefixes => onChange({...(manufacturer || {}), gs1CompanyPrefixes })}
                    />                
              </div>
            </div>
          </div>

        </fieldset>
      </div>
      <button type="submit" className="btn btn-primary">{`${
        manufacturer.id ? "Save" : "Create"
      } manufacturer`}</button>
    </form>
  )
}

export default ManufacturerForm
