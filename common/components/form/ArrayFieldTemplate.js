import React from "react"

const arrayItemStyle = {
	// border: "1px solid #ddd",
	padding: "15px 30px",
	// boxShadow: "rgba(0, 0, 0, 0.3) -2px 6px 28px"
}

const ArrayFieldTemplate = (props) => (
	<div>
		<label>{props.title || ""}</label>
    <div className={props.className} style={arrayItemStyle}>
      {props.items &&
        props.items.map(element => (
          <div className="row mb-3" key={element.index}>
            <div className="col-6">{element.children}</div>
						<div className="col-6">

							<div className="btn-group btn-group-sm float-right" role="group" aria-label="Basic example">
								{/* Move down */}
		            {element.hasMoveDown && (
		              <button className="btn btn-sm btn-secondary"
		                onClick={element.onReorderClick(
		                  element.index,
		                  element.index + 1
		                )}>
		                Down
		              </button>
		            )}

								{/* Move up */}
		            {element.hasMoveUp && (
		              <button className="btn btn-sm btn-secondary"
		                onClick={element.onReorderClick(
		                  element.index,
		                  element.index - 1
		                )}>
		                Up
		              </button>
		            )}

								{/* Delete */}
		            <button className="btn btn-sm btn-danger" onClick={element.onDropIndexClick(element.index)}>
		              Delete
		            </button>
							</div>

          	</div>
          </div>
        ))}

      {props.canAdd && (
        <div className="row">
          <p className="col array-item-add">
            <button className="btn btn-sm btn-block btn-primary" onClick={props.onAddClick} type="button">
              Add
            </button>
          </p>
        </div>
      )}
    </div>
	</div>
)

export default ArrayFieldTemplate
