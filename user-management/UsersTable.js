import React from "react";
import SmartDatatable from "../common/components/datatable/SmartDatatable";
import * as utils from "./utils";
import { filterStringValueLowerCase } from "../common/utils/filterString";

const UsersTable = ({ list, onEditClick, onDeleteClick }) => {
  const actionsCell = d => (
    <div className="text-center">
      <button
        className="btn btn-link p-0 mr-2"
        type="button"
        onClick={() => onEditClick(d)}
      >
        Edit
      </button>
      <button
        className="btn btn-link text-danger p-0"
        type="button"
        onClick={() => onDeleteClick(d)}
      >
        Delete
      </button>
    </div>
  );

  const columns = [
    {
      Header: "ID",
      accessor: "id",
      width: 50
    },
    {
      Header: "First name",
      accessor: "firstname"
    },
    {
      Header: "Last name",
      accessor: "lastname"
    },
    {
      Header: "Email",
      accessor: "email",
      width: 300
    },
    {
      Header: "Last connection date",
      id: "lastLoginTimestamp",
      accessor: user => utils.getLastConnectionDate(user)
    },
    {
      Header: "Terms version",
      accessor: "salesTermsVersion",
      className: "text-center"
    },
    {
      Header: "Actions",
      id: "actions",
      filterable: false,
      accessor: actionsCell
    }
  ];

  return (
    <SmartDatatable
      data={list}
      showPagination={true}
      sortable={true}
      filterable={true}
      defaultFilterMethod={filterStringValueLowerCase}
      className="-striped -highlight"
      columns={columns}
      defaultPageSize={100}
      pageSizeOptions={[50, 100, 200, 500, 1000]}
    />
  );
};

export default UsersTable;
