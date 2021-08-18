// import React, {
//   useRef,
//   useState,
//   useEffect,
//   useCallback,
//   useMemo
// } from "react";
// import Select from "react-select";
// import get from "lodash/get";
// import map from "lodash/map";
// import reduce from "lodash/reduce";
// import orderBy from "lodash/orderBy";
// import indexOf from "lodash/indexOf";
// import {
//   getTradeItemPropertiesLightByTaxonomyIdAndPropertyGroupIdAndTradeItemCategoryCode,
//   getTradeItemPropertiesGroups,
//   getMandatoryLevels,
//   createPropertyRetailerAssociationsInMass,
//   deleteRetailerAssociationInMass,
//   getPropertiesAssociationsByConnectorIdsAndMandatoryLevel
// } from "../common/services/tradeItemProperties";
// import PageWrapper from "app/common/components/layout/PageWrapper";
// import { getAllConnectors } from "app/common/services/subscription";
// import { getBusinessRulesSets } from "app/common/services/businessRules";
// import SelectString from "app/common/components/form/SelectString";
// import Modal from "app/common/components/layout/Modal";
// import Loader from "app/common/components/loaders/Loader";

// const multiSelectStyles = {
//   height: "calc(100vh - 200px)",
//   width: "100%"
// };

function TradeItemPropertiesMassTool() {
//   const [propertiesGroups, setPropertiesGroups] = useState([]);
//   const [selectedPropertiesGroup, setSelectedPropertiesGroup] = useState(null);
//   const [tradeItemProperties, setTradeItemProperties] = useState([]);
//   const [connectors, setConnectors] = useState([]);
//   const [selectedProperties, setSelectedProperties] = useState([]);
//   const [selectedConnectors, setSelectedConnectors] = useState([]);
//   const [isCreating, setIsCreating] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const propertiesSelect = useRef(null);

//   const getTradeItemPropertiesForGroup = useCallback(taxonomyId, propertyGroupCode, tradeItemCategoryCode => {
//     getTradeItemPropertiesLightByTaxonomyIdAndPropertyGroupIdAndTradeItemCategoryCode({
//       taxonomyId: taxonomyId,
//       propertyGroupCode: propertyGroupCode,
//       tradeItemCategoryCode: tradeItemCategoryCode
//     }).then(res =>
//       setTradeItemProperties(orderBy(res.data, ["code"], ["asc"]))
//     );
//   }, []);

//   const selectProperties = useCallback(propertyIds => {
//     setSelectedProperties(propertyIds);
//     map(propertiesSelect.current.options, o => {
//       if (indexOf(propertyIds, o.value) !== -1) o.selected = true;
//       else o.selected = false;
//     });
//   }, []);

//   const selectedPropertyGroupValue = useMemo(
//     () => get(selectedPropertiesGroup, "value") || null,
//     [selectedPropertiesGroup]
//   );

//   // initialize state
//   useEffect(() => {
//     // get properties groups
//     getTradeItemPropertiesGroups().then(res => {
//       const groupsOptions = map(res.data, g => {
//         return { label: g, value: g };
//       });
//       setPropertiesGroups(groupsOptions);
//       setSelectedPropertiesGroup(groupsOptions[0]);
//       getTradeItemPropertiesForGroup(groupsOptions[0].value);
//       getAllConnectors().then(res =>
//         setConnectors(orderBy(res.data, ["name"], ["asc"]))
//       );
//     });
//   }, [getTradeItemPropertiesForGroup]);

//   // render component
//   return (
//     <PageWrapper>
//       <div className="row">
//         {/* properties */}
//         <div className="col-3">
//           <h4>Properties</h4>

//           {/* group */}
//           <Select
//             options={propertiesGroups}
//             value={selectedPropertiesGroup}
//             onChange={o => {
//               setSelectedPropertiesGroup(o);
//               getTradeItemPropertiesForGroup(o.value);
//             }}
//           />

//           {/* properties list */}
//           <select
//             ref={propertiesSelect}
//             style={multiSelectStyles}
//             multiple
//             onChange={e => {
//               setSelectedProperties(
//                 reduce(
//                   e.currentTarget.options,
//                   (results, value) => {
//                     if (!value.selected) return results;
//                     return [...results, value.value];
//                   },
//                   []
//                 )
//               );
//             }}
//           >
//             {map(tradeItemProperties, (o, k) => (
//               <option key={`trade-item-properties-${k}`} value={o.id}>
//                 {get(o, "code")}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* connectors */}
//         <div className="col-2">
//           <h4>Connectors</h4>
//           <br />
//           <br />
//           <select
//             style={multiSelectStyles}
//             multiple
//             onChange={e => {
//               setSelectedConnectors(
//                 reduce(
//                   e.currentTarget.options,
//                   (results, value) => {
//                     if (!value.selected) return results;
//                     return [...results, value.value];
//                   },
//                   []
//                 )
//               );
//             }}
//           >
//             {map(connectors, (o, k) => (
//               <option key={`connector-${k}`} value={o.id}>
//                 {get(o, "name")}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* actions */}
//         <div className="col-3">
//           <h4>Actions</h4>
//           <br />
//           <br />
//           {/* create */}
//           <button
//             className="btn btn-block btn-primary"
//             onClick={() => setIsCreating(true)}
//           >
//             Create
//           </button>
//           {/* delete */}
//           <button
//             className="btn btn-block btn-danger mt-2"
//             onClick={() =>
//               window.confirm(`Are you sure?`) && setIsDeleting(true)
//             }
//           >
//             Delete
//           </button>

//           <br />

//           {/* Properties selection */}
//           <h4>Properties duplication</h4>
//           {/* Select Mandatory properties */}
//           <button
//             className="btn btn-block btn-light btn-outline-primary"
//             onClick={() => {
//               if (!selectedConnectors.length) return;
//               getPropertiesAssociationsByConnectorIdsAndMandatoryLevel(
//                 selectedConnectors,
//                 "Mandatory",
//                 selectedPropertyGroupValue
//               ).then(res => {
//                 const changedProperties = map(
//                   res.data,
//                   property => property.productPropertyId
//                 );
//                 selectProperties(changedProperties);
//               });
//             }}
//           >
//             Select MANDATORY properties
//           </button>
//           {/* Select Warning properties */}
//           <button
//             className="btn btn-block btn-light btn-outline-primary"
//             onClick={() => {
//               if (!selectedConnectors.length) return;
//               getPropertiesAssociationsByConnectorIdsAndMandatoryLevel(
//                 selectedConnectors,
//                 "Warning",
//                 selectedPropertyGroupValue
//               ).then(res => {
//                 const changedProperties = map(
//                   res.data,
//                   property => property.productPropertyId
//                 );
//                 selectProperties(changedProperties);
//               });
//             }}
//           >
//             Select WARNING properties
//           </button>
//           {/* Select Optional properties */}
//           <button
//             className="btn btn-block btn-light btn-outline-primary"
//             onClick={() => {
//               if (!selectedConnectors.length) return;
//               getPropertiesAssociationsByConnectorIdsAndMandatoryLevel(
//                 selectedConnectors,
//                 "Optional",
//                 selectedPropertyGroupValue
//               ).then(res => {
//                 const changedProperties = map(
//                   res.data,
//                   property => property.productPropertyId
//                 );
//                 selectProperties(changedProperties);
//               });
//             }}
//           >
//             Select OPTIONAL properties
//           </button>
//         </div>
//       </div>

//       {/* creation modal */}
//       {isCreating && (
//         <Modal onClose={() => setIsCreating(false)}>
//           <CreateRetailerPropertiesAssociations
//             connectorsIds={selectedConnectors}
//             propertiesIds={selectedProperties}
//             group={selectedPropertyGroupValue}
//             onClose={() => setIsCreating(false)}
//           />
//         </Modal>
//       )}

//       {/* delete modal */}
//       {isDeleting && (
//         <Modal onClose={() => setIsDeleting(false)}>
//           <DeleteRetailerPropertiesAssociations
//             connectorsIds={selectedConnectors}
//             propertiesIds={selectedProperties}
//             group={selectedPropertyGroupValue}
//             onClose={() => setIsDeleting(false)}
//           />
//         </Modal>
//       )}
//     </PageWrapper>
//   );
// }

// function DeleteRetailerPropertiesAssociations({
//   connectorsIds,
//   propertiesIds,
//   group,
//   onClose
// }) {
//   const [loading, setLoading] = useState(false);

//   const deleteAssociations = useCallback(
//     (group, connectorsIds, propertiesIds) => {
//       setLoading(true);
//       return deleteRetailerAssociationInMass(
//         group,
//         connectorsIds,
//         propertiesIds
//       );
//     },
//     []
//   );

//   return (
//     <>
//       <div className="row">
//         <div className="col-12 text-center">
//           <button
//             className="btn btn-lg btn-danger"
//             onClick={() =>
//               deleteAssociations(group, connectorsIds, propertiesIds).then(
//                 res => onClose && onClose()
//               )
//             }
//           >
//             Confirm suppression of {connectorsIds.length} connectors x{" "}
//             {propertiesIds.length} properties?
//           </button>
//           {loading && <Loader />}
//         </div>
//       </div>
//     </>
//   );
// }

// function CreateRetailerPropertiesAssociations({
//   connectorsIds,
//   propertiesIds,
//   group,
//   onClose
// }) {
//   const [businessRuleSets, setBusinessRuleSets] = useState([]);
//   const [mandatoryLevels, setMandatoryLevels] = useState([]);
//   const [enrichmentMandatoryLevel, setEnrichmentMandatoryLevel] = useState(
//     null
//   );
//   const [conditionalMandatoryLevels, setConditionalMandatoryLevels] = useState(
//     []
//   );
//   const [currentMandatoryLevel, setCurrentMandatoryLevel] = useState(null);
//   const [currentBusinessRuleSet, setCurrentBusinessRuleSet] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const createAssociations = useCallback(
//     (
//       connectorsIds,
//       propertiesIds,
//       group,
//       conditionalMandatoryLevels,
//       enrichmentMandatoryLevel
//     ) => {
//       setLoading(true);
//       return createPropertyRetailerAssociationsInMass(
//         connectorsIds,
//         propertiesIds,
//         group,
//         conditionalMandatoryLevels,
//         enrichmentMandatoryLevel
//       ).then(res => {
//         setLoading(false);
//       });
//     },
//     []
//   );

//   useEffect(() => {
//     getBusinessRulesSets().then(res => setBusinessRuleSets(res.data));
//     getMandatoryLevels().then(res => setMandatoryLevels(res.data));
//   }, []);

//   return (
//     <>
//       <div className="row">
//         {/* mandatory level */}
//         <div className="col-6">
//           <label className="control-label">Mandatory level *</label>
//           <SelectString
//             value={currentMandatoryLevel}
//             options={mandatoryLevels}
//             onChange={o => setCurrentMandatoryLevel(o)}
//           />
//         </div>
//         {/* business rule set */}
//         <div className="col-6">
//           <label className="control-label">Business rule set</label>
//           <Select
//             isClearable={true}
//             getOptionLabel={o => o.name}
//             getOptionValue={o => o.id}
//             value={currentBusinessRuleSet}
//             options={businessRuleSets}
//             onChange={o => setCurrentBusinessRuleSet(o)}
//           />
//         </div>
//         {/* add */}
//         <div className="col-12 mt-2">
//           <button
//             onClick={e =>
//               setConditionalMandatoryLevels([
//                 ...conditionalMandatoryLevels,
//                 {
//                   mandatoryLevel: currentMandatoryLevel,
//                   businessRuleSetId: get(currentBusinessRuleSet, "id") || null,
//                   businessRuleSetName:
//                     get(currentBusinessRuleSet, "name") || null
//                 }
//               ])
//             }
//             className="btn btn-secondary btn-lg float-right"
//           >
//             Add
//           </button>
//         </div>
//         {map(conditionalMandatoryLevels, (brs, i) => (
//           <div className="col-12" key={`brs-added-${i}`}>
//             <span
//               onClick={() =>
//                 setConditionalMandatoryLevels([
//                   ...conditionalMandatoryLevels.slice(0, i),
//                   ...conditionalMandatoryLevels.slice(
//                     i + 1,
//                     conditionalMandatoryLevels.length
//                   )
//                 ])
//               }
//               style={{ cursor: "pointer" }}
//               className="text-danger font-weight-bold pointer mr-3"
//             >
//               X
//             </span>
//             {brs.mandatoryLevel}
//             {` ## BRS: ${
//               brs.businessRuleSetId ? brs.businessRuleSetName : "no"
//             }`}
//           </div>
//         ))}
//       </div>
//       {/* enrichment mandatory level */}
//       <div className="row mt-4">
//         <div className="col-6">
//           <label className="control-label">Enrichment mandatory level</label>
//           <SelectString
//             isClearable={true}
//             value={enrichmentMandatoryLevel}
//             options={mandatoryLevels}
//             onChange={o => setEnrichmentMandatoryLevel(o)}
//           />
//         </div>
//       </div>
//       {/* create */}
//       <div className="row mt-4">
//         <div className="col-12 text-center">
//           <hr />
//           {conditionalMandatoryLevels.length === 0 && (
//             <i>Please add at least one mandatory level.</i>
//           )}
//           {!loading && conditionalMandatoryLevels.length > 0 && (
//             <button
//               onClick={() =>
//                 createAssociations(
//                   connectorsIds,
//                   propertiesIds,
//                   group,
//                   conditionalMandatoryLevels,
//                   enrichmentMandatoryLevel
//                 ).then(res => onClose())
//               }
//               className="btn btn-primary btn-lg"
//             >
//               Create
//             </button>
//           )}
//           {loading && <Loader />}
//         </div>
//       </div>
//     </>
//   );
}

export default TradeItemPropertiesMassTool;
