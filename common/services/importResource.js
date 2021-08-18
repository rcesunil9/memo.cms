import axios from "axios";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import * as env from "../../environment/index.js";

//========================== BEGIN CDM_IMPORT_RESOURCE_SERVICE =====================================
// Set the services URIs
const BASE_IMPORT_RESOURCE = `${env.CDM_IMPORT_RESOURCE_SERVICE_URI}/api/ImportResource`;
const GET_IMAGE_CATEGORIES = `${BASE_IMPORT_RESOURCE}/GetImageCategories`;
const GET_COLOR_SPACES = `${BASE_IMPORT_RESOURCE}/GetColorSpaces`;
const GET_DOCUMENTS = `${BASE_IMPORT_RESOURCE}/GetDocumentsByTradeItemId`;
const IMPORT_IMAGE_RESOURCE = `${BASE_IMPORT_RESOURCE}/ImportImageResource`;
const UPDATE_IMAGE_RESOURCE = `${BASE_IMPORT_RESOURCE}/UpdateImageMetadata`;
const IMPORT_DOCUMENT_RESOURCE = `${BASE_IMPORT_RESOURCE}/ImportDocumentResource`;
const IMPORT_VIDEO_RESOURCE = `${BASE_IMPORT_RESOURCE}/ImportVideoMetadatas`;
const IMPORT_JOBS = `${env.CDM_IMPORT_RESOURCE_SERVICE_URI}/api/ResourceImportJob/GetResourceImportJobs`;
const FAILED_JOBS = `${env.CDM_IMPORT_RESOURCE_SERVICE_URI}/api/ResourceImportJob/GetFailedImportResources`;
const POLL = `${BASE_IMPORT_RESOURCE}/PollByManufacturerEntityId`;

// get import jobs
export const getResourceImportJobs = (pageNumber, pageSize) =>
  axios.get(`${IMPORT_JOBS}`, {
    params: {
      pageNumber,
      pageSize
    }
  });

// get failed resource import jopbs
export const getResourceImportFailedJobs = (
  resourceImportJobId,
  pageNumber,
  pageSize,
  search
) =>
  axios.get(`${FAILED_JOBS}`, {
    params: {
      resourceImportJobId,
      pageNumber,
      pageSize,
      search
    }
  });

// trigger polling
export const pollByManufacturerEntityId = (
  manufacturerEntityId,
  startPollingTimestamp,
  endPollingTimestamp
) =>
  axios.put(
    `${POLL}`,
    {},
    {
      params: {
        manufacturerEntityId,
        startPollingTimestamp,
        endPollingTimestamp
      }
    }
  );

// import videos
export const importVideosResources = (startDate, endDate) =>
  axios.post(
    `${IMPORT_VIDEO_RESOURCE}`,
    {},
    {
      params: {
        startDate,
        endDate
      }
    }
  );

// get image categories
//
export const getImageCategories = () => axios.get(`${GET_IMAGE_CATEGORIES}`);

// get image color spaces
//
export const getImageColorSpaces = () => axios.get(`${GET_COLOR_SPACES}`);

// get plunge angles
//
export const getPlungeAngles = () =>
  axios.get(`${BASE_IMPORT_RESOURCE}/GetPlungeAngles`);

// get plunge angles
//
export const getFacingTypes = () =>
  axios.get(`${BASE_IMPORT_RESOURCE}/GetFacingTypes`);

// create image
//
export const createImage = image => {
  const params = {
    tradeItemId: get(image, "tradeItemId"),
    fileName: get(image, "filename"),
    index: get(image, "index"),
    imageCategory: get(image, "imageCategory"),
    notDefinitive: get(image, "notDefinitive"),
    notExportable: get(image, "notExportable"),
    plungeAngle: get(image, "plungeAngle"),
    facingType: get(image, "facingType"),
    languageCodes: isEmpty(get(image, "languageCodes"))
      ? null
      : get(image, "languageCodes"),
    retailerCodes: isEmpty(get(image, "retailerCodes"))
      ? null
      : get(image, "retailerCodes")
  };
  const fileData = new FormData();
  fileData.append("Image", get(image, "file"));
  return axios.post(IMPORT_IMAGE_RESOURCE, fileData, { params: params });
};

// create image
//
export const updateImage = params =>
  axios.put(UPDATE_IMAGE_RESOURCE, { ...params });

// delete resource
//
export const deleteResource = id =>
  axios.delete(BASE_IMPORT_RESOURCE, { params: { metadataId: id } });

// get documents
//
export const getDocuments = tradeItemId =>
  axios.get(GET_DOCUMENTS, { params: { tradeItemId: tradeItemId } });

// create document
//
export const createDocument = document => {
  const params = {
    tradeItemId: get(document, "tradeItemId"),
    fileName: get(document, "filename"),
    index: get(document, "index"),
    languageCodes: isEmpty(get(document, "languageCodes"))
      ? null
      : get(document, "languageCodes"),
    retailerCodes: isEmpty(get(document, "retailerCodes"))
      ? null
      : get(document, "retailerCodes")
  };
  const fileData = new FormData();
  fileData.append("Document", get(document, "file"));
  return axios.post(IMPORT_DOCUMENT_RESOURCE, fileData, { params: params });
};
//========================== END CDM_IMPORT_RESOURCE_SERVICE =======================================
