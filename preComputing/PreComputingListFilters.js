import React, { useState, useEffect, useMemo } from "react";
import find from "lodash/find";
import Select from "react-select";
import { getManufacturers } from "app/common/services/manufacturer";

function PreComputingListFilters({
  filters,
  onFilterChange,
  onFiltersEmpty,
  onFiltersSearch
}) {
  // state
  const [manufacturers, setManufacturers] = useState([]);

  // memoized values
  const gtin = useMemo(
    () => (filters.gtins && filters.gtins.length ? filters.gtins[0] : ""),
    [filters.gtins]
  );
  const currentTradeItemManufacturerCode = useMemo(
    () =>
      filters.tradeItemManufacturerCode &&
      filters.tradeItemManufacturerCode.length
        ? filters.tradeItemManufacturerCode[0]
        : "",
    [filters.tradeItemManufacturerCode]
  );

  const selectedManufacturer = useMemo(
    () =>
      filters.manufacturerId === null
        ? null
        : find(manufacturers, m => m.id === filters.manufacturerId),
    [manufacturers, filters.manufacturerId]
  );

  // initialization
  useEffect(() => {
    getManufacturers().then(res => setManufacturers(res.data));
  }, []);

  return (
    <div className="row">
      {/* Gtin */}
      <div className="col-2">
        <label className="control-label">Gtins</label>
        <input
          className="form-control"
          type="text"
          autoComplete={false}
          value={gtin}
          onChange={e => onFilterChange("gtins", [e.currentTarget.value])}
        />
      </div>
      {/* Trade item manufacturer code */}
      <div className="col-2">
        <label className="control-label">Manufacturer code</label>
        <input
          className="form-control"
          type="text"
          autoComplete={false}
          value={currentTradeItemManufacturerCode}
          onChange={e =>
            onFilterChange("tradeItemManufacturerCode", [e.currentTarget.value])
          }
        />
      </div>
      {/* Manufacturer */}
      <div className="col-2">
        <label className="control-label">Manufacturer</label>
        <Select
          value={selectedManufacturer}
          options={manufacturers}
          getOptionLabel={o => o.name}
          getOptionValue={o => o.id}
          onChange={o => onFilterChange("manufacturerId", o ? o.id : null)}
        />
      </div>
      {/* Default language code */}
      <div className="col-2">
        <label className="control-label">Default language code</label>
        <input
          className="form-control"
          type="text"
          autoComplete={false}
          value={filters.defaultLanguageCode || ""}
          onChange={e =>
            onFilterChange("defaultLanguageCode", e.currentTarget.value)
          }
        />
      </div>
      {/* Actions */}
      <div className="col-3">
        <label className="control-label d-block">&nbsp;</label>
        {/* Empty filters  */}
        <button
          className="btn btn-secondary btn-small mr-2"
          onClick={onFiltersEmpty}
        >
          Empty filters
        </button>
        {/* Search with filters  */}
        <button className="btn btn-primary btn-small" onClick={onFiltersSearch}>
          Search
        </button>
      </div>
    </div>
  );
}

export default PreComputingListFilters;
