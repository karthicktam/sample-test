import React from "react";
import "./_mapDropDown.scss";
import PropTypes from "prop-types";

class CustomContextDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: this.props.listData,
      dynamicListData: this.props.dynamicListData,
      type: "predefined",
      keyValue: "",
      customValue: "",
      dynamicValue: ""
    };
  }

  onChange = () => {
    let { type, keyValue, customValue, dynamicValue } = this.state;

    let selectedValues = { type, value_field: dynamicValue };
    selectedValues["key"] = type === "custom" ? customValue : keyValue;

    this.props.onChange(selectedValues);
  };

  renderOptions = (list, addCustomAndDynamic) => {
    let options = [];
    if (addCustomAndDynamic) {
    }
    Object.keys(list).forEach(key => {
      options.push(
        <option key={key} value={key}>
          {list[key]}
        </option>
      );
    });
    return options;
  };
  handleKeyValueChange = event => {
    let value = event.target.value;
    if (value === "custom") {
      this.setState({ keyValue: "custom", type: "custom" }, this.onChange);
    } else if (value !== "custom") {
      this.setState({ keyValue: value }, this.onChange);
    }
  };

  handleCustomValueChange = event => {
    let customValue = event.target.value;
    this.setState({ customValue }, this.onChange);
  };
  handleDynamicValueChange = event => {
    let dynamicValue = event.target.value;
    this.setState({ dynamicValue }, this.onChange);
  };

  render() {
    let { listData, dynamicListData } = this.state;

    return (
      <div>
        <div className="input-sec3">
          <select
            className={this.props.className}
            onChange={this.handleKeyValueChange}
            value={this.state.keyValue}
            required
          >
            <option value="" disabled={true}>
              {this.props.name}
            </option>
            {this.renderOptions(listData, true)}
            <option value="custom">{"Custom"}</option>
          </select>

          {this.state.type === "custom" ? (
            <div id="input">
              <input
                type="text"
                defaultValue={this.state.value}
                className="input-text"
                onChange={this.handleCustomValueChange}
                placeholder="Give it a name here..."
              />
            </div>
          ) : null}
          <select
            className="select-box10"
            defaultValue={this.state.dynamicValue}
            onChange={this.handleDynamicValueChange}
            required
          >
            <option value="" disabled={true}>
              {this.props.name}
            </option>
            {this.renderOptions(dynamicListData, false)}
          </select>
        </div>
      </div>
    );
  }
}

CustomContextDropDown.propTypes = {
  dropdownName: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

export default CustomContextDropDown;
