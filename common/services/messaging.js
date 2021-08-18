import axios from "axios";
import * as env from "../../environment/index.js";
import "./index";

const BASE = `${env.CDM_MESSAGING_SERVICE_URI}/api/Cms`;

// TEMPLATES
export const getPagedTemplates = (pageNumber, pageSize) =>
  axios.get(`${BASE}/GetTemplates/${pageNumber}/${pageSize}`);

export const getTemplate = id => axios.get(`${BASE}/GetTemplate/${id}`);

export const updateTemplate = template =>
  axios.put(`${BASE}/UpdateTemplate`, template, {
    params: { id: template.id }
  });

export const createTemplate = template =>
  axios.post(`${BASE}/CreateTemplate`, template);

export const deleteTemplate = id =>
  axios.delete(`${BASE}/DeleteTemplate/${id}`);
