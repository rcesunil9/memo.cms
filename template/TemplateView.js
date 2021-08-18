import React, { useEffect, useState, useCallback } from "react";
import ActionsBar from "app/common/components/layout/ActionsBar";
import PageWrapper from "app/common/components/layout/PageWrapper";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import {
  updateTemplate,
  createTemplate,
  deleteTemplate,
  getTemplate
} from "app/common/services/messaging";
import SelectString from "app/common/components/form/SelectString";

const TARGETS = ["Internal", "Manufacturer", "Retailer"];

function TemplateView({ match }) {
  const [template, setTemplate] = useState({ targets: [] });

  const id = match.params.id;

  const save = useCallback(
    template => {
      if (id) updateTemplate(template);
      else
        createTemplate(template).then(
          res => (window.location.href = `/template/${res.data}`)
        );
    },
    [id]
  );

  const remove = useCallback(id => {
    deleteTemplate(id).then(res => (window.location.href = `/templates`));
  }, []);

  useEffect(() => {
    if (id) {
      getTemplate(id).then(res => setTemplate(res.data));
    }
  }, [id]);

  return (
    <div className="container-fluid">
      {/* Actions */}
      <ActionsBar>
        <div className="col-4">
          <h2 className="h4 pt-1 m-0 font-weight-light">
            {id ? "Edit" : "Create"} template
          </h2>
        </div>
        <div className="col-8 text-right">
          <Link to={`/templates`} className="btn btn-light mr-2">
            Go back to list
          </Link>
          <Link to={`/template`} className="btn btn-secondary">
            Create new template
          </Link>
        </div>
      </ActionsBar>

      {/* Table */}
      <PageWrapper>
        <div className="form-group field field-object">
          <fieldset style={{ maxWidth: "700px" }}>
            <legend>Template definition</legend>

            {/* entity data */}
            {id && (
              <div className="form-group field field-string">
                <label className="control-label">Template ID</label>
                <input className="form-control" value={id} disabled />
              </div>
            )}

            {/* name */}
            <div className="form-group field field-string">
              <label className="control-label">Name*</label>
              <input
                className="form-control"
                name="name"
                value={template.name || ""}
                required
                onChange={e =>
                  setTemplate({ ...template, name: e.target.value })
                }
              />
            </div>

            {/* targets */}
            <div className="form-group field field-string">
              <label className="control-label">Targets*</label>
              <SelectString
                closeMenuOnSelect={false}
                isClearable={false}
                options={TARGETS}
                value={template.targets}
                onChange={targets =>
                  setTemplate({ ...template, targets: targets || [] })
                }
                isMulti
              />
            </div>

            {/* subject */}
            <div className="form-group field field-string">
              <label className="control-label">Subject</label>
              <input
                className="form-control"
                name="subject"
                value={template.subject || ""}
                required
                onChange={e =>
                  setTemplate({ ...template, subject: e.target.value })
                }
              />
            </div>

            {/* body */}
            <div className="form-group field field-string">
              <label className="control-label">Body (html)</label>
              <textarea
                className="form-control"
                name="body"
                value={template.body}
                required
                rows={10}
                onChange={e =>
                  setTemplate({ ...template, body: e.target.value })
                }
              />
            </div>

            {/* button actions */}
            <div className="form-group field field-string">
              <button className="btn btn-danger" onClick={() => remove(id)}>
                Delete
              </button>
              <button
                className="btn btn-primary float-right"
                onClick={() => save(template)}
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

export default withRouter(TemplateView);
