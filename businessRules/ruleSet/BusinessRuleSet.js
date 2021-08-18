import React from "react";
import Select from "react-select";
import update from "immutability-helper";
import get from "lodash/get";
import map from "lodash/map";
import find from "lodash/find";
import Card from "../../common/components/layout/Card";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import Popover from "../../common/components/layout/Popover";
import CreatableSelect from "react-select/creatable";
import LocalizableStrings from "../../common/components/lang/LocalizableStrings";
require("codemirror/mode/sql/sql");

const CODE_MIRROR_EDITOR_OPTIONS = {
  mode: "text/x-mysql",
  theme: "dracula",
  lineNumbers: true,
  autoFocus: true,
  autorefresh: true
};

class BusinessRuleSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: null
    };
  }

  onEditorChange(editor, data, value) {
    this.props.onChange(
      update(this.props.ruleSet, { userFriendlyFormula: { $set: value } })
    );
    editor.focus();
  }

  render() {
    const {
      onSave,
      onChange,
      onCancel,
      ruleSet,
      rulesSets,
      rules,
      taxonomies,
      groups,
      tradeItemCategories
    } = this.props;

    const _taxonomies = map(taxonomies, g => {return {value: g.id, label: g.name}})
    const _groups = map(groups, g => {return {value: g.id, label: g.name}})
    const _tradeItemCategories = map(tradeItemCategories, s => {return {value: s.code.code, label: `${s.code.code} - ${s.name} (${s.unspsc})`}})
    const _tags = map(get(ruleSet, "tags"), t => {
      return { value: t, label: t };
    });
    const _operators = [
      { value: "and", label: "AND" },
      { value: "or", label: "OR" }
    ];

    return (
      <React.Fragment>
        <div className="row">
          <div className="col">
            {/* Rule name */}
            <div className="form-group">
              <label>Rule set name</label>
              <input
                value={get(ruleSet, "name") || ""}
                className="form-control"
                onChange={e =>
                  onChange(update(ruleSet, { name: { $set: e.target.value } }))
                }
              />
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="row">
          <div className="col">
            <LocalizableStrings
              integrated
              localizableStrings={["shortDescription", "description"]}
              labels={{
                shortDescription: "Short description",
                description: "Description"
              }}
              components={{
                description: "textarea"
              }}
              input={ruleSet}
              onChange={(property, value) =>
                onChange(update(ruleSet, { [property]: { $set: value } }))
              }
            />
            <br />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <label>Tags</label>
            <CreatableSelect
              isMulti
              onChange={values =>
                onChange(
                  update(ruleSet, {
                    tags: { $set: map(values, v => get(v, "value")) }
                  })
                )
              }
              value={_tags}
              options={_tags}
            />
          </div>
        </div>

        <div className="row mt-3">
          {/* Taxonomy */}
          <div className="col">
            <div className="form-group">
              <label>Taxonomy</label>
              <Select
                value={find(_taxonomies, s => s.value === get(ruleSet, "taxonomyId", null)) || null}
                onChange={group => onChange(update(ruleSet, {taxonomyId: {$set: group.value}}))}
                name="edit-business-rule-taxonomy"
                options={_taxonomies}/>
            </div>
          </div>
          {/* Trade Item Category */}
          <div className="col">
            <div className="form-group">
              <label>Trade Item Category</label>
              <Select
                value={find(_tradeItemCategories, s => s.value === get(ruleSet, "tradeItemCategory.code", null)) || null}
                onChange={tradeItemCategory => onChange(update(ruleSet, {tradeItemCategory: { code: {$set: tradeItemCategory.value}}}))}
                name="edit-business-rule-trade-item-category"
                options={_tradeItemCategories}/>
            </div>
          </div>
          {/* Groups */}
          <div className="col">
            <div className="form-group">
              <label>Group</label>
              <Select
                value={find(_groups, g => g.value === get(ruleSet, "propertyGroupId", null)) || null}
                onChange={group => onChange(update(ruleSet, {propertyGroupId: {$set: group.value}}))}
                name="edit-business-rule-groups"
                options={_groups}/>
            </div>
          </div>
        </div>

        <Card className="bg-light">
          <div className="row">
            {/* Rules */}
            <div className="col">
              <div className="form-group">
                <label>Rules</label>
                <Select
                  value={null}
                  onChange={rule =>
                    this.state.editor.doc.replaceRange(
                      ` { ${rule.name} } `,
                      this.state.editor.doc.getCursor()
                    )
                  }
                  getOptionLabel={rule => rule.name}
                  getOptionValue={rule => rule.id}
                  name="edit-business-ruleSet-rule"
                  options={rules}
                />
              </div>
            </div>
            {/* Groups */}
            <div className="col">
              <div className="form-group">
                <label>Rule set</label>
                <Select
                  value={null}
                  onChange={ruleSet =>
                    this.state.editor.doc.replaceRange(
                      ` [ ${ruleSet.name} ] `,
                      this.state.editor.doc.getCursor()
                    )
                  }
                  getOptionLabel={ruleSet => ruleSet.name}
                  getOptionValue={ruleSet => ruleSet.id}
                  name="edit-business-ruleSet-ruleSet"
                  options={rulesSets}
                />
              </div>
            </div>
            {/* Operators */}
            <div className="col">
              <div className="form-group">
                <label>Operators</label>
                <Select
                  value={null}
                  onChange={operator =>
                    this.state.editor.doc.replaceRange(
                      ` ${operator.value} `,
                      this.state.editor.doc.getCursor()
                    )
                  }
                  name="edit-business-ruleSet-operator"
                  options={_operators}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col" style={{ zIndex: 0 }}>
              <CodeMirror
                editorDidMount={editor => this.setState({ editor })}
                value={get(ruleSet, "userFriendlyFormula", "")}
                onBeforeChange={(editor, data, value) =>
                  this.onEditorChange(editor, data, value)
                }
                options={CODE_MIRROR_EDITOR_OPTIONS}
              />
            </div>
          </div>
          <br />
          <div className="row">
            <Popover
              title="Define if an instance of a group should be filtered or if the trade item should be rejected"
              position="top"
              trigger="mouseenter"
            >
              <div className="col" style={{ zIndex: 0 }}>
                <div className="form-group">
                  <label>Type</label>
                  <br />
                  <div
                    className="btn-group btn-group-toggle"
                    data-toggle="buttons"
                  >
                    <label>
                      <input
                        type="radio"
                        name="options"
                        value="Filter"
                        autoComplete="off"
                        checked={
                          get(ruleSet, "businessRuleSetType") === "Filter" || ""
                        }
                        onChange={e =>
                          onChange(
                            update(ruleSet, {
                              businessRuleSetType: { $set: e.target.value }
                            })
                          )
                        }
                      />{" "}
                      Filter
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="options"
                        value="Reject"
                        autoComplete="off"
                        checked={
                          get(ruleSet, "businessRuleSetType") === "Reject"
                        }
                        onChange={e =>
                          onChange(
                            update(ruleSet, {
                              businessRuleSetType: { $set: e.target.value }
                            })
                          )
                        }
                      />{" "}
                      Reject
                    </label>
                  </div>
                </div>
              </div>
            </Popover>
          </div>
        </Card>

        {/* Actions button */}
        <div className="row">
          <div className="col pt-5">
            <div className="text-right">
              <button
                className="btn btn-secondary mr-2"
                onClick={e => onCancel()}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={e => onSave(ruleSet)}
              >
                {get(ruleSet, "id") ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default BusinessRuleSet;
