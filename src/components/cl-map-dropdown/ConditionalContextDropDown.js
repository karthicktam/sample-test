import React from "react";
import "./_conditionalDropDown.scss";
import "./_mapDropDown.scss";
import Datepicker from "react-date-picker";
import PropTypes from "prop-types";
import moment from "moment";
import _ from "lodash";

// newly added from here
import "./_search.scss";
import SelectSearch from "react-select-search";
import { renderFriendWithoutValue, fuse } from "./searchHelpers";

class ConditionalContextDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.conditionsList = {
      textContains: "Text Contains", //Text
      textDoesNotContain: "Text Does not contain", //Text
      textExactlyMatches: "Text Exactly matches", //Text
      textDoesNotExactlyMatch: "Text Does not exactly match", //Text
      textIsIn: "Text Is in", //Text
      textIsNotIn: "Text Is not in", //Text
      textStartsWith: "Text Starts with", //Text
      textDoesNotStartWith: "Text Does not start with", //Text
      textEndsWith: "Text Ends with", //Text
      textDoesNotEndWith: "Text Does not end with", //Text
      numberGT: "Number Greater than", //Numeric
      numberLT: "Number Less than", //Numeric
      dtAfter: "Date After", //Date
      dtBefore: "Date Before", //Date
      dtEqual: "Date Equals", //Date
      bIsTrue: "Boolean Is true", //DropDOwn Only
      bIsFalse: "Boolean Is false", //DropDOwn Only
      fieldExists: "Exist", //DropDOwn Only
      fieldDoesNotExist: "Does not exist" //DropDOwn Only
    };
    let stateObj = this.transformPropsToState(this.props);
    this.state = {
      ...stateObj,
      showCancel: false
    };
  }
  transformPropsToState = props => {
    let { value, condition } = props.value;
    const type = this.getTypeFromValue(condition);
    if (type === "date") {
      if (value !== "") {
        value = new Date(value);
      } else {
        value = "";
      }
    }
    let stateObj = {
      value: value,
      condition: condition,
      conditionName: this.conditionsList[condition],
      type: type || "none",
      conditionsList: this.renderConditions(this.conditionsList) // process
    };

    return stateObj;
  };
  // componentDidUpdate(prevProps) {
  //   const {value,condition} = this.props.value;
  //   const sameValue = _.isEqual(value,prevProps.value);
  //   const sameCondition = _.isEqual(condition,prevProps.condition);
  //   if(!sameValue && !sameCondition){
  //     let stateObj = this.transformPropsToState(this.props);
  //   this.setState({
  //     ...stateObj
  //   });
  //   }

  // }
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.showCancel) {
      const isEmpty = _.isEmpty(this.state.conditionName);
      if (!isEmpty) {
        this.setState({ showCancel: true });
      }
    }
  }

  componentDidMount() {
    let renderList = this.renderConditions(this.conditionsList);

    this.setState({
      conditionsList: renderList
    });

    const isEmpty = _.isEmpty(this.state.conditionName);
    if (!isEmpty) {
      this.setState({ showCancel: true });
    }
  }

  clearValue = () => {
    this.setState({ showCancel: false, conditionName: "", type: "none", condition: "", value: "" });
    this.props.onConditionChange("");
    this.props.onValueChange("");
    // this.inputSearch.focus();
  };

  getTypeFromValue = value => {
    const conditionsListTypes = {
      textContains: "text", //Text
      textDoesNotContain: "text", //Text
      textExactlyMatches: "text", //Text
      textDoesNotExactlyMatch: "text", //Text
      textIsIn: "text", //Text
      textIsNotIn: "text", //Text
      textStartsWith: "text", //Text
      textDoesNotStartWith: "text", //Text
      textEndsWith: "text", //Text
      textDoesNotEndWith: "text", //Text
      numberGT: "number", //Numeric
      numberLT: "number", //Numeric
      dtAfter: "date", //Date
      dtBefore: "date", //Date
      dtEqual: "date", //Date
      bIsTrue: "none", //DropDOwn Only
      bIsFalse: "none", //DropDOwn Only
      fieldExists: "none", //DropDOwn Only
      fieldDoesNotExist: "none" //DropDOwn Only
    };
    return conditionsListTypes[value];
  };

  renderOptions = () => {
    let options = [];
    Object.keys(this.conditionsList).forEach(key => {
      options.push(
        <option key={key} value={this.conditionsList[key]}></option>
      );
    });
    return options;
  };

  handleConditionChange = value => {
    console.log("handleConditionChange", value);
    let conditionName = "";
    let condition = value && value["value"]; 
    Object.keys(this.conditionsList).forEach(element => {
      if (element === condition) {
        console.log("insidensnmnasn", value);
        conditionName = this.conditionsList[element]; 
        this.setState({ showCancel: true });
      } else if (condition === "") {
        this.clearValue();
        conditionName = ""
      } 
    });


    let type = this.getTypeFromValue(condition);

    console.log("everything", condition, conditionName, type);

    if (type === "date") {
      let valueType = typeof this.state.value;
      if (valueType === "string") {
        this.setState({
          value: ""
        });
      }
      this.props.onValueChange(""); // new
    } else {
      this.setState({
        value: ""
      });
      this.props.onValueChange(""); // new
    }

    this.setState({
      condition,
      conditionName,
      type
    });
    this.props.onConditionChange(condition);
    if (type === "none") {
      this.props.onValueChange("none"); // new
    }  
    // } else {
    //   this.props.onValueChange(""); // new
    // }
    // this.props.onValueChange(""); // new
  };
  handleValueChange = event => {
    this.setState({ value: event.target.value });
    this.props.onValueChange(event.target.value);
  };
  handleDateChange = value => {
    let dateObj = new moment(value);
    this.setState({ value });
    if (value === null) {
      this.props.onValueChange("");
    } else {
      this.props.onValueChange(dateObj.format("DD/MM/YYYY"));
    }
  };

  renderConditions = list => {
    let options = [];

    Object.keys(list).forEach(key => {
      options.push({name: list[key], value: key});
    });

    return options;
  }; // newly added

  render() {

    // let renderList = this.renderConditions(this.conditionsList);

    return (
      <div>
        <div className="conditioncontextdropdown-sec3">
          <div className="conditiondropdown__container">
            <div className={this.props.error}>
              <SelectSearch
                key="renderList"
                // onBlur={this.validatedUserTypedWord}
                value={this.state.condition}
                // options={renderList}
                options={this.state.conditionsList} // process
                onChange={this.handleConditionChange}
                renderOption={renderFriendWithoutValue}
                placeholder={this.props.name}
                fuse={fuse}
                search
                style={this.props.style}
              />
              </div>
            {this.state.showCancel ? (
              <span
                className="conditionalsearchbox__closebtn"
                onClick={this.clearValue}
              >
                &times;
              </span>
            ) : null}
          </div>

          {this.state.type === "text" ? (
            <div id="input">
              <input
                type="text"
                value={this.state.value}
                className={"contextdropdown__input-text" + this.props.error}
                onChange={this.handleValueChange}
                placeholder="enter value..."
              />
            </div>
          ) : this.state.type === "number" ? (
            <div id="input">
              <input
                type="number"
                value={this.state.value}
                className={"contextdropdown__input-text" + this.props.error}
                onChange={this.handleValueChange}
                placeholder="enter value..."
              />
            </div>
          ) : this.state.type === "date" ? (
            <div id="input">
              <Datepicker
                value={this.state.value}
                onChange={this.handleDateChange}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

ConditionalContextDropDown.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.object,
  onConditionChange: PropTypes.func,
  onValueChange : PropTypes.func,
};

export default ConditionalContextDropDown;













// import React from "react";
// import "./_conditionalDropDown.scss";
// import "./_mapDropDown.scss";
// import Datepicker from "react-date-picker";
// import PropTypes from "prop-types";
// import moment from "moment";
// import _ from "lodash";

// class ConditionalContextDropDown extends React.Component {
//   constructor(props) {
//     super(props);
//     this.conditionsList = {
//       textContains: "Text Contains", //Text
//       textDoesNotContain: "Text Does not contain", //Text
//       textExactlyMatches: "Text Exactly matches", //Text
//       textDoesNotExactlyMatch: "Text Does not exactly match", //Text
//       textIsIn: "Text Is in", //Text
//       textIsNotIn: "Text Is not in", //Text
//       textStartsWith: "Text Starts with", //Text
//       textDoesNotStartWith: "Text Does not start with", //Text
//       textEndsWith: "Text Ends with", //Text
//       textDoesNotEndWith: "Text Does not end with", //Text
//       numberGT: "Number Greater than", //Numeric
//       numberLT: "Number Less than", //Numeric
//       dtAfter: "Date After", //Date
//       dtBefore: "Date Before", //Date
//       dtEqual: "Date Equals", //Date
//       bIsTrue: "Boolean Is true", //DropDOwn Only
//       bIsFalse: "Boolean Is false", //DropDOwn Only
//       fieldExists: "Exist", //DropDOwn Only
//       fieldDoesNotExist: "Does not exist" //DropDOwn Only
//     };
//     let stateObj = this.transformPropsToState(this.props);
//     this.state = {
//       ...stateObj,
//       showCancel: false
//     };
//   }
//   transformPropsToState = props => {
//     let { value, condition } = props.value;
//     const type = this.getTypeFromValue(condition);
//     if (type === "date") {
//       if (value !== "") {
//         value = new Date(value);
//       } else {
//         value = "";
//       }
//     }
//     let stateObj = {
//       value: value,
//       condition: condition,
//       conditionName: this.conditionsList[condition],
//       type: type || "none"
//     };

//     return stateObj;
//   };
//   // componentDidUpdate(prevProps) {
//   //   const {value,condition} = this.props.value;
//   //   const sameValue = _.isEqual(value,prevProps.value);
//   //   const sameCondition = _.isEqual(condition,prevProps.condition);
//   //   if(!sameValue && !sameCondition){
//   //     let stateObj = this.transformPropsToState(this.props);
//   //   this.setState({
//   //     ...stateObj
//   //   });
//   //   }

//   // }
//   componentDidUpdate(prevProps, prevState) {
//     if (!prevState.showCancel) {
//       const isEmpty = _.isEmpty(this.state.conditionName);
//       if (!isEmpty) {
//         this.setState({ showCancel: true });
//       }
//     }
//   }

//   componentDidMount() {
//     const isEmpty = _.isEmpty(this.state.conditionName);
//     if (!isEmpty) {
//       this.setState({ showCancel: true });
//     }
//   }

//   clearValue = () => {
//     this.setState({ showCancel: false, conditionName: "", type: "none" });
//     this.props.onConditionChange("");
//     this.inputSearch.focus();
//   };

//   getTypeFromValue = value => {
//     const conditionsListTypes = {
//       textContains: "text", //Text
//       textDoesNotContain: "text", //Text
//       textExactlyMatches: "text", //Text
//       textDoesNotExactlyMatch: "text", //Text
//       textIsIn: "text", //Text
//       textIsNotIn: "text", //Text
//       textStartsWith: "text", //Text
//       textDoesNotStartWith: "text", //Text
//       textEndsWith: "text", //Text
//       textDoesNotEndWith: "text", //Text
//       numberGT: "number", //Numeric
//       numberLT: "number", //Numeric
//       dtAfter: "date", //Date
//       dtBefore: "date", //Date
//       dtEqual: "date", //Date
//       bIsTrue: "none", //DropDOwn Only
//       bIsFalse: "none", //DropDOwn Only
//       fieldExists: "none", //DropDOwn Only
//       fieldDoesNotExist: "none" //DropDOwn Only
//     };
//     return conditionsListTypes[value];
//   };

//   renderOptions = () => {
//     let options = [];
//     Object.keys(this.conditionsList).forEach(key => {
//       options.push(
//         <option key={key} value={this.conditionsList[key]}></option>
//       );
//     });
//     return options;
//   };

//   handleConditionChange = event => {
//     let conditionName = event.target.value;
//     let condition;
//     Object.keys(this.conditionsList).forEach(element => {
//       if (this.conditionsList[element] === event.target.value) {
//         condition = element;
//         this.setState({ showCancel: true });
//       } else if (event.target.value === "") {
//         this.clearValue();
//         condition = ""
//       } 
//     });
//     let type = this.getTypeFromValue(condition);
//     if (type === "date") {
//       let valueType = typeof this.state.value;
//       if (valueType === "string") {
//         this.setState({
//           value: ""
//         });
//       }
//     } else {
//       this.setState({
//         value: ""
//       });
//     }

//     this.setState({
//       condition,
//       conditionName,
//       type
//     });
//     this.props.onConditionChange(condition);
//   };
//   handleValueChange = event => {
//     this.setState({ value: event.target.value });
//     this.props.onValueChange(event.target.value);
//   };
//   handleDateChange = value => {
//     let dateObj = new moment(value);
//     this.setState({ value });
//     if (value === null) {
//       this.props.onValueChange("");
//     } else {
//       this.props.onValueChange(dateObj.format("DD/MM/YYYY"));
//     }
//   };

//   render() {
//     return (
//       <div>
//         <div className="conditioncontextdropdown-sec3">
//           <div className="conditiondropdown__container">
//             <input
//               className={this.props.className + this.props.error}
//               list={this.props.name}
//               onChange={this.handleConditionChange}
//               placeholder={this.props.name}
//               value={this.state.conditionName}
//               style={this.props.style}
//               ref={input => {
//                 this.inputSearch = input;
//               }}
//             ></input>
//             {this.state.showCancel ? (
//               <button
//                 className="conditionalsearchbox__closebtn"
//                 onClick={this.clearValue}
//               >
//                 &times;
//               </button>
//             ) : null}
//           </div>
//           <datalist id={this.props.name}>
//             <select className={this.props.className} required>
//               <option value="" disabled={true}>
//                 {this.props.name}
//               </option>
//               {this.renderOptions()}
//             </select>
//           </datalist>

//           {this.state.type === "text" ? (
//             <div id="input">
//               <input
//                 type="text"
//                 value={this.state.value}
//                 className={"contextdropdown__input-text" + this.props.error}
//                 onChange={this.handleValueChange}
//                 placeholder="enter a value..."
//               />
//             </div>
//           ) : this.state.type === "number" ? (
//             <div id="input">
//               <input
//                 type="number"
//                 value={this.state.value}
//                 className={"contextdropdown__input-text" + this.props.error}
//                 onChange={this.handleValueChange}
//                 placeholder="enter a value..."
//               />
//             </div>
//           ) : this.state.type === "date" ? (
//             <div id="input">
//               <Datepicker
//                 value={this.state.value}
//                 onChange={this.handleDateChange}
//               />
//             </div>
//           ) : null}
//         </div>
//       </div>
//     );
//   }
// }

// ConditionalContextDropDown.propTypes = {
//   className: PropTypes.string,
//   name: PropTypes.string,
//   value: PropTypes.object,
//   onConditionChange: PropTypes.func,
//   onValueChange : PropTypes.func,
// };

// export default ConditionalContextDropDown;
