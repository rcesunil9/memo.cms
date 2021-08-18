import update from "immutability-helper";
import filter from "lodash/filter";
import find from "lodash/find";
import includes from "lodash/includes";
import map from "lodash/map";
import indexOf from "lodash/indexOf";
import get from "lodash/get";
import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import { Col, Row, makeOption } from "./utils";
import { getTargetMarkets } from "app/common/services/targetMarket";

const RetailerForm = ({
  groups,
  manufacturers,
  retailer,
  exportActions,
  // functions
  onChange,
  onSave,
  onCancel,
  onDelete,
  onNewGroupClick,
  onEditGroupClick
}) => {
  const manufacturerOptions = map(manufacturers, makeOption);
  const selectedManufacturerOptions = filter(manufacturerOptions, o =>
    includes(retailer.authorizedManufacturerIds, o.value)
  );
  const getManufacturers = options =>
    map(options, o => find(manufacturers, ["id", o.value]));

  const groupOptions = map(groups, makeOption);
  const selectedGroupOption = find(
    groupOptions,
    o => o.value === retailer.groupId
  );
  const getGroup = option => find(groups, g => g.id === option.value);

  const change = key => value =>
    onChange(update(retailer, { [key]: { $set: value } }));
  const save = e => {
    e.preventDefault();
    onSave();
  };

  const [targetMarkets, setTargetMarkets] = useState();

  useEffect(() => {
    getTargetMarkets().then(res => setTargetMarkets(get(res, "data", [])));
  }, []);

  // memoized values
  const currentTargetMarketIds = get(retailer, "targetMarketIds");
  const selectedTargetMarkets = useMemo(
    () =>
      filter(
        targetMarkets,
        tm => !!find(currentTargetMarketIds, tmId => tm.id === tmId)
      ),
    [targetMarkets, currentTargetMarketIds]
  );

  return (
    <form onSubmit={save}>
      {/* Name */}
      <div className="form-group">
        <label className="control-label">Name*</label>
        <input
          className="form-control"
          value={retailer.name}
          required
          onChange={e => change("name")(e.target.value)}
        />
      </div>

      {/* Code */}
      <div className="form-group">
        <label className="control-label">Code*</label>
        <input
          className="form-control"
          value={retailer.code}
          required
          onChange={e => change("code")(e.target.value)}
        />
      </div>

      {/* Group */}
      <div className="form-group">
        <label className="control-label">Group*</label>
        <Select
          value={selectedGroupOption}
          options={groupOptions}
          onChange={e => change("groupId")(getGroup(e).id)}
        />
        <Row>
          <Col>
            {selectedGroupOption && (
              <button
                className="btn btn-link p-0"
                type="button"
                onClick={onEditGroupClick}
              >
                edit
              </button>
            )}
          </Col>
          <Col className="text-right">
            <button
              className="btn btn-link p-0"
              type="button"
              onClick={onNewGroupClick}
            >
              + add new group
            </button>
          </Col>
        </Row>
      </div>

      {/* target markets */}
      <div className="form-group">
        <label className="control-label">Target markets</label>
        <Select
          value={selectedTargetMarkets}
          onChange={e =>
            e === null
              ? change("targetMarketIds")([])
              : change("targetMarketIds")(map(e, "id"))
          }
          isMulti
          closeMenuOnSelect={false}
          options={targetMarkets}
          getOptionLabel={o => get(o, "name")}
          getOptionValue={o => get(o, "id")}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </div>

      {/* Authorized manufacturers */}
      <div className="form-group">
        <label className="control-label">Authorized manufacturers</label>
        <Select
          value={selectedManufacturerOptions}
          onChange={e =>
            change("authorizedManufacturerIds")(map(getManufacturers(e), "id"))
          }
          isMulti
          closeMenuOnSelect={false}
          options={manufacturerOptions}
          className="basic-multi-select"
          classNamePrefix="select"
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
            r => indexOf(get(retailer, "uiExportActionIds", []), r.id) !== -1
          )}
          onChange={exportActionsSelected =>
            change("uiExportActionIds")(
              exportActionsSelected
                ? map(exportActionsSelected, ea => ea.id)
                : []
            )
          }
          isClearable={true}
          getOptionLabel={o => o.name}
          getOptionValue={o => o.id}
          options={exportActions}
        />
      </div>

      {/* External id */}
      <div className="form-group">
        <label className="control-label">External ID</label>
        <input
          type="number"
          className="form-control"
          value={retailer.externalId || ""}
          onChange={e =>
            change("externalId")(
              e.target.value ? parseInt(e.target.value) : null
            )
          }
        />
      </div>

      {/* Resource base URL*/}
      <div className="form-group">
        <label className="control-label">Resource base URL</label>
        <input
          className="form-control"
          value={retailer.baseUrl}
          onChange={e => change("baseUrl")(e.target.value)}
        />
      </div>

      {/* can export videos */}
      <div className="form-check">
        <label>
          <input
            className="form-check-input"
            type="checkbox"
            checked={get(retailer, "allowVideos")}
            name="allowVideos"
            onChange={e => change("allowVideos")(e.target.checked)}
          />
          Allow videos
        </label>
      </div>

      <Row>
        {onDelete && (
          <Col>
            <button className="btn btn-danger" type="button" onClick={onDelete}>
              Delete
            </button>
          </Col>
        )}
        <Col className="d-flex justify-content-end">
          <button
            className="btn btn-secondary mr-2"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </Col>
      </Row>
    </form>
  );
};

export default RetailerForm;
