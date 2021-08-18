import axios from "axios";
import * as env from "../../environment/index.js";

// Set the services URIs
//
const makeURL = path => `${env.CDM_TRADE_ITEM_PROPERTIES_URI}/api/Taxonomy${path}`;
const GET_TAXONOMIES = makeURL("");


// Get trade item properties by scope
// scopes: LicencedProducts, Toys...
//
export const getTaxonomies = () =>
  axios.get(`${GET_TAXONOMIES}`);
