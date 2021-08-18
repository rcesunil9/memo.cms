import ExportPreComputedTradeItemActionViewModel from "./ExportPreComputedTradeItemActionViewModel";
import SendEmailActionViewModel from "./SendEmailActionViewModel";
import ExportTradeItemImageActionViewModel from "./ExportTradeItemImageActionViewModel";
import ExportTradeItemsWithImagesActionViewModel from "./ExportTradeItemsWithImagesActionViewModel";
import SynchronizeImagesActionViewModel from "./SynchronizeImagesActionViewModel";
import ExportPreComputedTradeItemImageMetadataActionViewModel from "./ExportPreComputedTradeItemImageMetadataActionViewModel";
import SendEnrichmentRequestToManufacturerActionViewModel from "./SendEnrichmentRequestToManufacturerActionViewModel";
import SendMessageSummaryActionViewModel from "./SendMessageSummaryActionViewModel";
import UpdateIcecatTaxonomyActionViewModel from "./UpdateIcecatTaxonomyActionViewModel";

const forms = {
  ExportPreComputedTradeItemActionViewModel,
  SendEmailActionViewModel,
  ExportTradeItemImageActionViewModel,
  ExportTradeItemsWithImagesActionViewModel,
  SynchronizeImagesActionViewModel,
  ExportPreComputedTradeItemImageMetadataActionViewModel,
  SendEnrichmentRequestToManufacturerActionViewModel,
  SendMessageSummaryActionViewModel,
  UpdateIcecatTaxonomyActionViewModel
};

export default actionType => {
  const form = forms[actionType];
  if (!form) throw new Error("No action form for action type ''"); 
  return form;
};
