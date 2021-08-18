import React, { useEffect, useState, useCallback } from "react";
import DatePicker from "app/common/components/date/DatePicker";
import ActionsBar from "app/common/components/layout/ActionsBar";
import PageWrapper from "app/common/components/layout/PageWrapper";
import { withRouter } from "react-router";
import {
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection
} from "app/common/services/collection ";
import { Link } from "react-router-dom";

function CollectionView({ match }) {
  const [collection, setCollection] = useState({ startDate: null });

  const id = match.params.id;

  const save = useCallback(
    collection => {
      if (id) updateCollection(collection);
      else
        createCollection(collection).then(
          res => (window.location.href = `/collection/${res.data}`)
        );
    },
    [id]
  );

  const remove = useCallback(id => {
    deleteCollection(id).then(res => (window.location.href = `/collections`));
  }, []);

  useEffect(() => {
    if (id) {
      getCollection(id).then(res => setCollection(res.data));
    }
  }, [id]);

  return (
    <div className="container-fluid">
      {/* Actions */}
      <ActionsBar>
        <div className="col-4">
          <h2 className="h4 pt-1 m-0 font-weight-light">
            {id ? "Edit" : "Create"} collection
          </h2>
        </div>
        <div className="col-8 text-right">
          <Link to={`/collections`} className="btn btn-light mr-2">
            Go back to list
          </Link>
          <Link to={`/collection`} className="btn btn-secondary">
            Create new collection
          </Link>
        </div>
      </ActionsBar>

      {/* Table */}
      <PageWrapper>
        <div className="form-group field field-object">
          <fieldset style={{ maxWidth: "500px" }}>
            <legend>General information</legend>

            {/* Entity data */}
            {id && (
              <div className="form-group field field-string">
                <label className="control-label">Collection ID</label>
                <input className="form-control" value={id} disabled />
              </div>
            )}
            <div className="form-group field field-string">
              <label className="control-label">Name*</label>
              <input
                className="form-control"
                name="name"
                value={collection.name}
                required
                onChange={e =>
                  setCollection({ ...collection, name: e.target.value })
                }
              />
            </div>

            <div className="form-group field field-string">
              <label className="control-label">Start date*</label>
              <DatePicker
                onChange={d =>
                  setCollection({
                    ...collection,
                    startDate: d ? d.format("YYYY-MM-DD") : null
                  })
                }
                timeFormat={false}
                value={collection.startDate}
              />
            </div>

            <div className="form-group field field-string">
              <label className="control-label">End date*</label>
              <DatePicker
                onChange={d =>
                  setCollection({
                    ...collection,
                    endDate: d ? d.format("YYYY-MM-DD") : null
                  })
                }
                timeFormat={false}
                value={collection.endDate}
              />
            </div>

            <div className="form-group field field-string">
              <button className="btn btn-danger" onClick={() => remove(id)}>
                Delete
              </button>
              <button
                className="btn btn-primary float-right"
                onClick={() => save(collection)}
              >
                Save
              </button>
            </div>
          </fieldset>
        </div>
      </PageWrapper>
    </div>
  );
}

export default withRouter(CollectionView);
