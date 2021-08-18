import React from "react"
import SmartDatatable from "../common/components/datatable/SmartDatatable"

const GroupsTable = ({ list, onEditClick, onDeleteClick }) => {
  const actionsCell = d => (
    <div className="text-center">
      <button className="btn btn-link p-0 mr-2" type="button" onClick={() => onEditClick(d)}>
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
  )

  const columns = [
    {
      Header: "ID",
      accessor: "id"
    },
    {
      Header: "Name",
      accessor: "name"
    },
    {
      Header: "Actions",
      id: "actions",
      accessor: actionsCell
    }
  ]

  return (
    <SmartDatatable
      data={list}
      showPagination={true}
      sortable={true}
      filterable={true}
      className="-striped -highlight"
      columns={columns}
      defaultPageSize={100}
    />
  )
}

export default GroupsTable
