import axios from "axios";
import * as env from "../../environment/index.js";
import "./index";

const BASE = `${env.CDM_COLLECTION_SERVICE_URI}/api/Cms`;

export const getPagedCollections = (pageNumber, pageSize) =>
  axios.get(`${BASE}/${pageNumber}/${pageSize}`);

export const getCollection = collectionId =>
  axios.get(`${BASE}/${collectionId}`);

export const updateCollection = collection =>
  axios.put(`${BASE}`, collection, {
    params: { id: collection.id }
  });

export const createCollection = collection => axios.post(`${BASE}`, collection);

export const deleteCollection = id => axios.delete(`${BASE}/${id}`);
