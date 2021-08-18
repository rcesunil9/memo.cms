import React from "react"

const Pagination = ({}) => (
  <nav aria-label="Page navigation example">
    <ul className="pagination">
      <li className="page-item">
        <a className="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">«</span>
          <span className="sr-only">Previous</span>
        </a>
      </li>
      <li className="page-item"><a className="page-link" href="#">1</a></li>
      <li className="page-item">
        <a className="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">»</span>
          <span className="sr-only">Next</span>
        </a>
      </li>
    </ul>
  </nav>
)

export default Pagination
