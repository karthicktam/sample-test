import React from "react";
// import "./_simpleSearchDropDown.scss";
import PropTypes from "prop-types";
import _ from "lodash";

 // newly added from here
import "./_search.scss";
import SelectSearch from "react-select-search";
import { renderFriendNew, fuse } from "./searchHelpers";

class SimpleSearchTraitsNew extends React.Component {
  constructor(props) {
    super(props);
    
    let stateObj = this.populateInitialState(this.props);
    this.state = {
      ...stateObj
    };

    this.ref = React.createRef(); // newly added
  }

  populateInitialState = props => {
    let value_for_traits = "",
      selectedTraits = "",
      traitsValue = "",
      key_for_traits = "",
      selectedKey = "",
      traitsKey = ""; // newly added

      if (Object.keys(props.value).length !== 0) {
        selectedTraits = props.value.type;
        traitsValue = props.value.val;

        if (selectedTraits === "-- custom value --") {
          value_for_traits = "-- custom value --";
        } else if (selectedTraits === "-- custom field --") {
          value_for_traits = "-- custom field --";
        } else {
          if (typeof props.listData[traitsValue] === "object") {
            value_for_traits = props.listData[traitsValue]["name"];
          } // newly added
        }
      }

      if (Object.keys(props.value_field).length !== 0) {
        selectedKey = props.value_field.key_type;
        traitsKey = props.value_field.key_value;

        if (selectedKey === "-- custom field --") {
            key_for_traits = "-- custom field --";
        } else {
            key_for_traits = traitsKey;
        }
      } // process

    let stateObj = {
      listData: this.renderData(props.listData),
      selectedTraits: selectedTraits,
      traitsValue: traitsValue,
      value_for_traits: value_for_traits,
      showCancel: false, // new
      stylePre: "",
      preData: this.renderDataNew(props.preData), // process from here
      key_for_traits: key_for_traits,
      traitsKey: traitsKey,
      selectedKey: selectedKey,
      showCancelNew: false,
      styleError: ""
    };
    return stateObj;
  };

  componentDidMount() {

    let opt = [];
    opt = this.renderData(this.props.listData);

    let option = [];
    option = this.renderDataNew(this.props.preData); // process

    this.setState({
      preData: option,
      listData: opt
    }); // process

    let { value, value_field } = this.props;

    if (value && value.isValid === false) {
      this.setState({ 
        selectedTraits: "",
        traitsValue: "",
        value_for_traits: "",
        stylePre: " error_border",
        showCancel: false,
      }, this.onChange);
    }

    if (this.state.selectedTraits !== "") {
      this.setState({ showCancel: true });
    }

    // process from here

    if (value_field && value_field.isValid === false) {
        this.setState({ 
          key_for_traits: "",
          traitsKey: "",
          selectedKey: "",
          showCancelNew: false,
          styleError: " error_border"
        }, this.onChange);
      }

    if (value_field && value_field.isValid === false) {
      this.setState({ showCancelNew: true }); 
    }
  }

  componentDidUpdate(prevProps) {
    const sameProps = _.isEqual(prevProps, this.props);

    if (!sameProps) {
      let { value, value_field } = this.props;

      if (value && value.isValid === false) {
        this.setState({ 
          stylePre: " error_border",
        });
      }

      // process from here

      if (value_field && value_field.isValid === false) {
        this.setState({ 
          styleError: " error_border",
        });
      }
    }
  } // newly added to test

  clearValue = () => {
    this.setState({ selectedTraits: "", value_for_traits: "", traitsValue: "", showCancel: false }, this.onChange);
    // this.props.onChange("");
  };

  clearValueNew = () => {
    this.setState({ selectedKey: "", key_for_traits: "", traitsKey: "", showCancelNew: false }, this.onChange);
    // this.props.onValueChange("");
  } // process

  handleChange = (value) => {
    let selectedTraits = value && value["value"];
    console.log("selectedTraits", selectedTraits);
    Object.keys(this.props.listData).forEach(key => {
      if (this.props.listData[key]["name"] === selectedTraits) { 
        console.log("okok", key);
        this.setState(
          {
            selectedTraits: "predefined",
            traitsValue: key,
            value_for_traits: this.props.listData[key]["name"], // test,
            showCancel: true, // test
            stylePre: "" // new test
          },
          this.onChange
        );
      } else if (selectedTraits === "-- custom value --") {
        this.setState(
          {
            selectedTraits: "-- custom value --",
            traitsValue: "",
            value_for_traits: "-- custom value --", // test
            showCancel: true // test
          },
          this.onChange
        );
      } else if (selectedTraits === "-- custom field --") {
        this.setState(
          {
            selectedTraits: "-- custom field --",
            traitsValue: "",
            value_for_traits: "-- custom field --", // test
            showCancel: true // test
          },
          this.onChange
        );
      }
    });
  };

  handleChangeHandler = (value) => {
    let selectedKey = value && value["value"];
    console.log("selectedKey", selectedKey);
    // Object.keys(this.props.preData).forEach(key => {
    //   if (key === selectedKey) { 
    //     console.log("okok", key);
    //     this.setState(
    //       {
    //         selectedKey: "predefined",
    //         traitsKey: key,
    //         key_for_traits: this.props.preData[key]["name"], // test,
    //         showCancelNew: true, // test
    //         styleError: "" // new test
    //       },
    //       this.onValueChange
    //     );
    //   } else if (selectedKey === "-- custom field --") {
    //     this.setState(
    //       {
    //         selectedKey: "-- custom field --",
    //         traitsKey: "",
    //         key_for_traits: "-- custom field --", // test
    //         showCancelNew: true // test
    //       },
    //       this.onValueChange
    //     );
    //   }
    // });

    if (selectedKey !== "-- custom field --") {
      this.setState(
        {
          selectedKey: "predefined",
          traitsKey: selectedKey,
          key_for_traits: selectedKey, // test,
          showCancelNew: true, // test
          styleError: "" // new test
        },
        this.onChange
      );
    } else {
      this.setState(
        {
          selectedKey: "-- custom field --",
          traitsKey: "",
          key_for_traits: selectedKey, // test
          showCancelNew: true // test
        },
        this.onChange
      );
    } // process
  }; // process

  handleChangeInput = event => {
    let traitsValue = event.target.value;
    this.setState({ traitsValue }, this.onChange);
    if (traitsValue.trim() !== "") {
      this.setState({ stylePre: "" }, this.onChange);
    }
  }; // newly added

  handleChangeInputHandler = event => {
    let traitsKey = event.target.value;
    this.setState({ traitsKey }, this.onChange);
    if (traitsKey.trim() !== "") {
      this.setState({ styleError: "" }, this.onChange);
    }
  }; // process

  onChange = () => {
    let { traitsValue, selectedTraits } = this.state;

    let { traitsKey, selectedKey } = this.state;

    if (selectedTraits === undefined) {
      selectedTraits = "";
    }

    if (selectedKey === undefined) {
      selectedKey = "";
    }

    let selectedTraitsVal = { type: selectedTraits, val: traitsValue ? traitsValue : "" };
    let selectedKeyVal = { key_type: selectedKey, key_value: traitsKey ? traitsKey : "" };
    console.log("onChangeonChangeonChange", selectedTraitsVal);
    this.props.onChange(selectedTraitsVal, selectedKeyVal);
  }; // newly added

  onValueChange  = () => {
    let { traitsKey, selectedKey } = this.state;
    if (selectedKey === undefined) {
      selectedKey = "";
    }

    let selectedKeyVal = { key_type: selectedKey, key_value: traitsKey ? traitsKey : "" };
    console.log("onValueChangeonValueChange", selectedKeyVal);
    this.props.onValueChange(selectedKeyVal);
  } // process

  validatedUserTypedWord = event => {
    let { listData } = this.props;
    let enteredWord = event.target.value;
    if (!this.isValuePresentInList(enteredWord, listData)) {
      this.setState({value_for_traits: "", selectedTraits: "", traitsValue: "", showCancel: false}, this.onChange);
    }
  };

  isValuePresentInList = (word, listData) => {
    let isPresent = false;
    Object.keys(listData).forEach(key => {
      if (listData[key]["name"] === word  || word === "-- custom value --" || word === "-- custom field --") {
        isPresent = true;
      }
    });
    return isPresent;
  };

  renderData = listData => {
    let options = [{type: 'group', name: "Predefined", items: []}];
    Object.keys(listData).forEach(key => {
      options[0].items.push({name: listData[key]["name"], value: listData[key]["name"], show: listData[key]["value"]});
    });
    if (!this.props.customEnabled) {
      options.push(
        {type: 'group', name: "Custom", items: [
          {name: "-- custom value --", value: "-- custom value --", show: "Assign a custom value"},
          {name: "-- custom field --", value: "-- custom field --", show: "Assign a custom field"}
        ]}  
      )
    }
    return options;
  }; // newly added

  renderDataNew = list => {
    let options = [{type: 'group', name: "Predefined", items: []}];
    Object.keys(list).forEach(key => {
      options[0].items.push({name: key, value: key, show: list[key]});
    });
    if (!this.props.customEnabled) {
      options.push(
        {type: 'group', name: "Custom", items: [
          {name: "-- custom field --", value: "-- custom field --", show: "Assign a custom field"}
        ]}  
      )
    }
    return options;
  }; // newly added

  render() {
    let { listData, preData } = this.props;
    // let opt = [];
    // opt = this.renderData(listData);

    // let option = [];
    // option = this.renderDataNew(preData);
    
    return (
      // <div className="mapgroup-sec6">
      <div className="whole_grid2">

        <div id="userId">
          {/*<input
            type="text"
            className={this.props.class}
            value={this.props.value_field}
            placeholder={this.props.placeholder}
            onChange={this.props.onTextChange}
          />*/}
          <div className={"width-100" + this.state.styleError}>
            <SelectSearch
              key="list"
              value={this.state.key_for_traits}
              fuse={fuse}
              // options={option}
              options={this.state.preData}
              onChange={this.handleChangeHandler}
              renderOption={renderFriendNew}
              placeholder={this.props.name}
              search
            />
          </div>

          {this.state.showCancelNew ? (
            <span className="searchbox__closebtn" onClick={this.clearValueNew}>
              &times;
            </span>
          ) : null}
        </div>

        {this.state.selectedKey === "-- custom field --"
            ? 
              <div>
                <input
                    type="text"
                    className={"contextdropdown__input-text_1" + this.state.styleError}
                    onChange={this.handleChangeInputHandler}
                    // onBlur={this.validatedUserTypedWord}
                    value={this.state.traitsKey}
                    placeholder={"enter a field..."}
                />
              </div>
            : null  
        }

        <div id="userId">
          <div className={"width-100" + this.state.stylePre}>
            <SelectSearch
              key="listData"
              value={this.state.value_for_traits}
              fuse={fuse}
              // options={opt}
              options={this.state.listData}
              onChange={this.handleChange}
              renderOption={renderFriendNew}
              placeholder={this.props.name}
              search
            />
          </div>

          {this.state.showCancel ? (
            <span className="searchbox__closebtn_1" onClick={this.clearValue}>
              &times;
            </span>
          ) : null}
        </div>
        {this.state.selectedTraits === "-- custom value --" || this.state.selectedTraits === "-- custom field --"
            ? 
              <div className="displayib">
                <input
                    type="text"
                    className={"contextdropdown__input-text_1" + this.state.stylePre}
                    onChange={this.handleChangeInput}
                    // onBlur={this.validatedUserTypedWord}
                    value={this.state.traitsValue}
                    placeholder={this.state.selectedTraits === "-- custom value --" ? "enter a value..." : "enter a field..."}
                />
              </div>
            : null  
          }

          <div className="fieldmapper-remove_1">
            <button
              onClick={this.props.onClick}
              type="button"
              className="field-mapper__remove-btn margin-top-0"
            >
              <img
                src={require("../../assets/icons/minus.svg")}
                alt="minus-img"
                id="field-mapper__remove-img"
              />
            </button>
          </div>
      </div>
    );
  }
}

SimpleSearchTraitsNew.propTypes = {
  listData: PropTypes.object.isRequired,
  name: PropTypes.string,
  className: PropTypes.string.isRequired,
  style: PropTypes.object
};

export default SimpleSearchTraitsNew;

