import update from "immutability-helper";
import React from "react";
import Select from "react-select";

export const triggerDiscriminators = () => [
  "NewFileOnFTPTriggerViewModel",
  "PeriodicTriggerViewModel",
  "TradeItemPreComputed",
  "TradeItemExported",
  "NewUserCreated",
  "UserPasswordGenerated"
];

export const actionDiscriminators = () => [
  "ExportPreComputedTradeItemActionViewModel",
  "SendEmailActionViewModel",
  "ExportTradeItemImageActionViewModel",
  "ExportTradeItemsWithImagesActionViewModel",
  "SynchronizeImagesActionViewModel",
  "ExportPreComputedTradeItemImageMetadataActionViewModel",
  "SendEnrichmentRequestToManufacturerActionViewModel",
  "SaveSendMessageSummaryActionViewModel",
  "UpdateIcecatTaxonomyActionViewModel"
];

export const getNewImageProcessExportAction = () => {
  return {
    name: "",
    discriminator: "ExportTradeItemImageActionViewModel",
    imageResolutions: [],
    imageCategories: [],
    colorSpaces: [],
    transportConfigurationIds: []
  };
};

export const getNewSynchronizeImagesAction = () => {
  return {
    name: "",
    discriminator: "SynchronizeImagesActionViewModel",
    manufacturerEntityId: null,
    onlyFullDirectoryImages: true
  };
};

export const getNewImageMetadataExportAction = () => {
  return {
    name: "",
    discriminator: "ExportPreComputedTradeItemImageMetadataActionViewModel",
    exportPreComputedTradeItemActionId: null,
    formatConfigurationId: null,
    transportConfigurationId: null
  };
};

export const getNewImageResolution = () => {
  return {
    width: null,
    height: null,
    name: null
  };
};

export const getNewImageCategoryFilter = () => {
  return {
    imageCategory: null,
    number: null
  };
};

export const getActivationPeriodPlaceholder = () => {
  return {
    periodStart: {
      rawValue: ""
    },
    periodEnd: {
      rawValue: ""
    }
  };
};

export const inputChanger = (original, onChange) => e => {
  let k = e.target.name;
  if (k === "$wordpass") k = "password";

  let v = e.target.value;
  if (e.target.type === "checkbox") v = e.target.checked;
  const n = update(original, { [k]: { $set: v } });
  onChange(n);
};

// options is a list of {id, name} fields.
// value is the current value for id.
// onChange mimics the native change event.
export const SelectObject = ({ name, options, value, onChange, ...props }) => {
  const makeOptions = objects =>
    objects.map(o => ({ label: o.name, value: o.id }));
  const adaptedOptions = makeOptions(options);
  const selectedOption = adaptedOptions.find(o => o.value === value);
  const select = option =>
    onChange(
      option === null ? null : { target: { name, value: option.value } }
    );
  return (
    <Select
      options={adaptedOptions}
      value={selectedOption}
      onChange={select}
      {...props}
    />
  );
};

// This wrapper makes the form unmount when navigation state changes.
// Otherwise we would have to dispatch the reset action also when navigating
// from "Edit something" to "Create something".
export const keyed = Component =>
  class Keyed extends React.Component {
    render() {
      return (
        <Component key={this.props.match.params.id || "new"} {...this.props} />
      );
    }
  };
