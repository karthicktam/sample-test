import React from "react";
import "./_simpleSearchDropDown.scss";
import PropTypes from "prop-types";
import _ from "lodash";

// newly added from here
import "./_search.scss";
import SelectSearch from "react-select-search";
import { renderFriendNew, fuse } from "./searchHelpers";

class SimpleSearchDropDown extends React.Component {
  constructor(props) {
    super(props);
    
    let stateObj = this.populateInitialState(this.props);
    this.state = {
      ...stateObj
    };
  }

  populateInitialState = props => {
    let value_for_dropdown = "",
      selectedValue = "",
      typedValue = ""; // newly added
      
      if (Object.keys(props.value).length > 0) {
        selectedValue = props.value.type;
        typedValue = props.value.val;

        if (selectedValue === "-- custom value --") {
          value_for_dropdown = "-- custom value --";
        } else if (selectedValue === "-- custom field --") {
          value_for_dropdown = "-- custom field --";
        } else {
          if (typeof props.listData[typedValue] === "object") {
            value_for_dropdown = props.listData[typedValue]["name"];
          } // newly added
        }
      }
      
    let stateObj = {
      listData: this.renderData(props.listData),
      selectedValue: selectedValue,
      typedValue: typedValue,
      value_for_dropdown: value_for_dropdown,
      showCancel: false, // new
      stylePre: "" // newly added
    };
    return stateObj;
  };

  componentDidMount() {

    let fetchedData = this.renderData(this.props.listData); // process

    this.setState({
      listData: fetchedData
    }); // process

    let { value } = this.props;

    if (value && value.isValid === false) {
      this.setState({ 
        selectedValue: "",
        typedValue: "",
        value_for_dropdown: "",
        stylePre: " error_border",
        showCancel: false,
      }, this.onChange);
    }

    if (this.state.selectedValue !== "") {
      this.setState({ showCancel: true }, this.onChange);
    }
  }

  componentDidUpdate(prevProps) {
    const sameProps = _.isEqual(prevProps, this.props);

    if (!sameProps) {
      let { value } = this.props;

      if (value && value.isValid === false) {
        this.setState({ 
          stylePre: " error_border",
        });
      }
    }
  } // newly added to test

  clearValue = () => {
    this.setState({ selectedValue: "", value_for_dropdown: "", typedValue: "", showCancel: false }, this.onChange);
    this.props.onChange("");
    // this.setFocus.focus();
  };

  handleChange = value => {
    console.log("handleChangehandleChange", value);
    let selectedKey;
    let selectedValue = value && value["value"];
    Object.keys(this.props.listData).forEach(key => {
      if (this.props.listData[key]["name"] === selectedValue) {
        selectedKey = key;

        this.setState(
          {
            selectedValue: "predefined",
            typedValue: selectedKey,
            value_for_dropdown: selectedValue, // test,
            showCancel: true, // test
            stylePre: "" // new test
          },
          this.onChange
        );
      } else if (selectedValue === "-- custom value --") {
        this.setState(
          {
            selectedValue: "-- custom value --",
            typedValue: "",
            value_for_dropdown: selectedValue, // test
            showCancel: true // test
          },
          this.onChange
        );
      } else if (selectedValue === "-- custom field --") {
        this.setState(
          {
            selectedTraits: "-- custom field --",
            traitsValue: "",
            value_for_traits: selectedValue, // test
            showCancel: true // test
          },
          this.onChange
        );
      }
  
    });
  };

  handleChangeInput = event => {
    let typedValue = event.target.value;
    this.setState({ typedValue }, this.onChange);
    if (typedValue.trim() !== "") {
      this.setState({ stylePre: "" }, this.onChange);
    }
  }; // newly added

  onChange = () => {
    let { typedValue, selectedValue } = this.state;
    if (selectedValue === undefined) {
      selectedValue = "";
    }

    let selectedValues = { type: selectedValue, val: typedValue ? typedValue : "" };
    this.props.onChange(selectedValues);
  }; // newly added

  validatedUserTypedWord = event => {
    let { listData } = this.props;
    let enteredWord = event.target.value;
    if (!this.isValuePresentInList(enteredWord, listData)) {
      this.setState({value_for_dropdown: "", selectedValue: "", typedValue: "", showCancel: false}, this.onChange);
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
  renderOptions = listData => {
    let options = [];
    Object.keys(listData).forEach(key => {
      options.push(
        <option
          key={key}
          value={listData[key]["name"]}
          className="select-boxSearch--options"
        >{listData[key]["value"]}</option>
      );
    });
    return options;
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

  render() {
    // let { listData } = this.props;

    // let fetchedData = this.renderData(listData);

    return (
      <div className="mapgroup-sec3">

        <div id="center">
          <div className={"width-100" + this.state.stylePre}>
            <SelectSearch
              key="dataList"
              value={this.state.value_for_dropdown}
              fuse={fuse}
              // options={fetchedData}
              options={this.state.listData}
              onChange={this.handleChange}
              renderOption={renderFriendNew}
              placeholder={this.props.name}
              search
            />
          </div>
          {this.state.showCancel ? (
            <span 
              className="searchbox__closebtn" 
              onClick={this.clearValue}>
              &times;
            </span>
          ) : null}
        </div>
        {this.state.selectedValue === "-- custom value --" || this.state.selectedValue === "-- custom field --"
            ? 
              <div id="input">
              <input
                type="text"
                className={"contextdropdown__input-text" + this.state.stylePre}
                onChange={this.handleChangeInput}
                // onBlur={this.validatedUserTypedWord}
                value={this.state.typedValue}
                placeholder="Give it a name here..."
              />
            </div>
            : null  
          }
      </div>
    );
  }
}

SimpleSearchDropDown.propTypes = {
  listData: PropTypes.object.isRequired,
  name: PropTypes.string,
  className: PropTypes.string.isRequired,
  style: PropTypes.object
};

export default SimpleSearchDropDown;








// import React from "react";
// import "./_simpleSearchDropDown.scss";
// import PropTypes from "prop-types";
// import _ from "lodash";

// // newly added from here
// import "./_search.scss";
// import SelectSearch from "react-select-search";
// import { renderFriend, fuse } from "./searchHelpers";

// class SimpleSearchDropDown extends React.Component {
//   constructor(props) {
//     super(props);
    
//     let stateObj = this.populateInitialState(this.props);
//     this.state = {
//       ...stateObj
//     };
//   }

//   populateInitialState = props => {
//     let value_for_dropdown = "",
//       selectedValue = "",
//       typedValue = ""; // newly added
      
//       if (Object.keys(props.value).length > 0) {
//         selectedValue = props.value.type;
//         typedValue = props.value.val;

//         if (selectedValue === "-- custom value --") {
//           value_for_dropdown = "Assign a custom value";
//         } else if (selectedValue === "-- custom field --") {
//           value_for_dropdown = "Assign a custom field";
//         } else {
//           if (typeof props.listData[typedValue] === "object") {
//             value_for_dropdown = props.listData[typedValue]["value"];
//           } // newly added
//         }
//       }
      
//     let stateObj = {
//       listData: props.listData,
//       selectedValue: selectedValue,
//       typedValue: typedValue,
//       value_for_dropdown: value_for_dropdown,
//       showCancel: false, // new
//       stylePre: "" // newly added
//     };
//     return stateObj;
//   };

//   componentDidMount() {

//     let { value } = this.props;

//     if (value && value.isValid === false) {
//       this.setState({ 
//         selectedValue: "",
//         typedValue: "",
//         value_for_dropdown: "",
//         stylePre: " error_border",
//         showCancel: false,
//       }, this.onChange);
//     }

//     if (this.state.selectedValue !== "") {
//       this.setState({ showCancel: true }, this.onChange);
//     }
//   }

//   componentDidUpdate(prevProps) {
//     const sameProps = _.isEqual(prevProps, this.props);

//     if (!sameProps) {
//       let { value } = this.props;

//       if (value && value.isValid === false) {
//         this.setState({ 
//           stylePre: " error_border",
//         });
//       }
//     }
//   } // newly added to test

//   clearValue = () => {
//     this.setState({ selectedValue: "", value_for_dropdown: "", typedValue: "", showCancel: false }, this.onChange);
//     this.props.onChange("");
//     // this.setFocus.focus();
//   };

//   handleChange = value => {
//     console.log("handleChangehandleChange", value);
//     let selectedKey;
//     let selctedValue;
//     let selectedValue = value && value["value"];
//     Object.keys(this.props.listData).forEach(key => {
//       if (this.props.listData[key]["value"] === selectedValue) {
//         selectedKey = key;

//         this.setState(
//           {
//             selectedValue: "predefined",
//             typedValue: selectedKey,
//             value_for_dropdown: selectedValue, // test,
//             showCancel: true, // test
//             stylePre: "" // new test
//           },
//           this.onChange
//         );
//       } else if (selectedValue === "Assign a custom value") {
//         this.setState(
//           {
//             selectedValue: "-- custom value --",
//             typedValue: "",
//             value_for_dropdown: selectedValue, // test
//             showCancel: true // test
//           },
//           this.onChange
//         );
//       } else if (selectedValue === "Assign a custom field") {
//         this.setState(
//           {
//             selectedTraits: "-- custom field --",
//             traitsValue: "",
//             value_for_traits: selectedValue, // test
//             showCancel: true // test
//           },
//           this.onChange
//         );
//       }
  
//     });
//   };

//   handleChangeInput = event => {
//     let typedValue = event.target.value;
//     this.setState({ typedValue }, this.onChange);
//     if (typedValue.trim() !== "") {
//       this.setState({ stylePre: "" }, this.onChange);
//     }
//   }; // newly added

//   onChange = () => {
//     let { typedValue, selectedValue } = this.state;
//     if (selectedValue === undefined) {
//       selectedValue = "";
//     }

//     let selectedValues = { type: selectedValue, val: typedValue ? typedValue : "" };
//     this.props.onChange(selectedValues);
//   }; // newly added

//   validatedUserTypedWord = event => {
//     let { listData } = this.props;
//     let enteredWord = event.target.value;
//     if (!this.isValuePresentInList(enteredWord, listData)) {
//       this.setState({value_for_dropdown: "", selectedValue: "", typedValue: "", showCancel: false}, this.onChange);
//     }
//   };

//   isValuePresentInList = (word, listData) => {
//     let isPresent = false;
//     Object.keys(listData).forEach(key => {
//       if (listData[key]["name"] === word  || word === "-- custom value --" || word === "-- custom field --") {
//         isPresent = true;
//       }
//     });
//     return isPresent;
//   };
//   renderOptions = listData => {
//     let options = [];
//     Object.keys(listData).forEach(key => {
//       options.push(
//         <option
//           key={key}
//           value={listData[key]["name"]}
//           className="select-boxSearch--options"
//         >{listData[key]["value"]}</option>
//       );
//     });
//     return options;
//   };

//   renderData = listData => {
//     let options = [{type: 'group', name: "Predefined", items: []}];
//     Object.keys(listData).forEach(key => {
//       options[0].items.push({name: listData[key]["name"], value: listData[key]["value"]});
//     });
//     if (!this.props.customEnabled) {
//       options.push(
//         {type: 'group', name: "Custom", items: [
//           {name: "-- custom value --", value: "Assign a custom value"},
//           {name: "-- custom field --", value: "Assign a custom field"}
//         ]}  
//       )
//     }
//     return options;
//   }; // newly added

//   render() {
//     let { listData } = this.props;

//     let fetchedData = this.renderData(listData);

//     return (
//       <div className="mapgroup-sec3">

//         <div id="center">
//           <div className={"width-100" + this.state.stylePre}>
//             <SelectSearch
//               key="dataList"
//               // onBlur={this.validatedUserTypedWord}
//               value={this.state.value_for_dropdown}
//               fuse={fuse}
//               options={fetchedData}
//               onChange={this.handleChange}
//               renderOption={renderFriend}
//               placeholder={this.props.name}
//               search
//             />
//           </div>
//           {this.state.showCancel ? (
//             <span 
//               className="searchbox__closebtn" 
//               onClick={this.clearValue}>
//               &times;
//             </span>
//           ) : null}
//         </div>
//         {this.state.selectedValue === "-- custom value --" || this.state.selectedValue === "-- custom field --"
//             ? 
//               <div id="input">
//               <input
//                 type="text"
//                 className={"contextdropdown__input-text" + this.state.stylePre}
//                 onChange={this.handleChangeInput}
//                 // onBlur={this.validatedUserTypedWord}
//                 value={this.state.typedValue}
//                 placeholder="Give it a name here..."
//               />
//             </div>
//             : null  
//           }
//       </div>
//     );
//   }
// }

// SimpleSearchDropDown.propTypes = {
//   listData: PropTypes.object.isRequired,
//   name: PropTypes.string,
//   className: PropTypes.string.isRequired,
//   style: PropTypes.object
// };

// export default SimpleSearchDropDown;












// import React from "react";
// import "./_simpleSearchDropDown.scss";
// import PropTypes from "prop-types";
// import _ from "lodash";

// class SimpleSearchDropDown extends React.Component {
//   constructor(props) {
//     super(props);
    
//     let stateObj = this.populateInitialState(this.props);
//     this.state = {
//       ...stateObj
//     };
//   }

//   populateInitialState = props => {
//     let value_for_dropdown = "",
//       selectedValue = "",
//       typedValue = ""; // newly added

      
//       if (Object.keys(props.value).length > 0) {
//         selectedValue = props.value.type;
//         typedValue = props.value.val;

//         if (selectedValue === "-- custom value --" || selectedValue === "-- custom field --") {
//           value_for_dropdown = selectedValue
//         } else {
//           if (typeof props.listData[typedValue] === "object") {
//             value_for_dropdown = props.listData[typedValue]["name"];
//           } // newly added
//         }
//       }
      
//     let stateObj = {
//       listData: props.listData,
//       selectedValue: selectedValue,
//       typedValue: typedValue,
//       value_for_dropdown: value_for_dropdown,
//       showCancel: false, // new
//       stylePre: "" // newly added
//     };
//     return stateObj;
//   };

//   componentDidMount() {

//     let { value } = this.props;

//     if (value && value.isValid === false) {
//       this.setState({ 
//         selectedValue: "",
//         typedValue: "",
//         value_for_dropdown: "",
//         stylePre: " error_border",
//         showCancel: false,
//       }, this.onChange);
//     }

//     if (this.state.selectedValue !== "") {
//       this.setState({ showCancel: true }, this.onChange);
//     }
//   }

//   componentDidUpdate(prevProps) {
//     const sameProps = _.isEqual(prevProps, this.props);

//     if (!sameProps) {
//       let { value } = this.props;

//       if (value && value.isValid === false) {
//         this.setState({ 
//           stylePre: " error_border",
//         });
//       }
//     }
//   } // newly added to test

//   clearValue = () => {
//     this.setState({ selectedValue: "", value_for_dropdown: "", typedValue: "", showCancel: false }, this.onChange);
//     this.props.onChange("");
//     this.setFocus.focus();
//   };

//   handleChange = event => {
//     let selectedKey;
//     let selctedValue;
//     let selectedValue = event.target.value;
//     Object.keys(this.props.listData).forEach(key => {
//       if (this.props.listData[key]["name"] === event.target.value) {
//         selectedKey = key;
//         selctedValue = this.props.listData[key]["name"]
//       }
//     });

//     if (selectedValue !== "-- custom value --" && selectedValue !== "-- custom field --") {
//       this.setState(
//         {
//           selectedValue: "predefined",
//           typedValue: selectedKey,
//           value_for_dropdown: selctedValue, // test,
//           showCancel: true, // test
//           stylePre: "" // new test
//         },
//         this.onChange
//       );
//     } else {
//       this.setState(
//         {
//           selectedValue: selectedValue,
//           typedValue: "",
//           value_for_dropdown: selectedValue, // test
//           showCancel: true // test
//         },
//         this.onChange
//       );
//     }

//   };

//   handleChangeInput = event => {
//     let typedValue = event.target.value;
//     this.setState({ typedValue }, this.onChange);
//     if (typedValue.trim() !== "") {
//       this.setState({ stylePre: "" }, this.onChange);
//     }
//   }; // newly added

//   onChange = () => {
//     let { typedValue, selectedValue } = this.state;
//     if (selectedValue === undefined) {
//       selectedValue = "";
//     }

//     let selectedValues = { type: selectedValue, val: typedValue ? typedValue : "" };
//     this.props.onChange(selectedValues);
//   }; // newly added

//   validatedUserTypedWord = event => {
//     let { listData } = this.props;
//     let enteredWord = event.target.value;
//     if (!this.isValuePresentInList(enteredWord, listData)) {
//       this.setState({value_for_dropdown: "", selectedValue: "", typedValue: "", showCancel: false}, this.onChange);
//     }
//   };

//   isValuePresentInList = (word, listData) => {
//     let isPresent = false;
//     Object.keys(listData).forEach(key => {
//       if (listData[key]["name"] === word  || word === "-- custom value --" || word === "-- custom field --") {
//         isPresent = true;
//       }
//     });
//     return isPresent;
//   };
//   renderOptions = listData => {
//     let options = [];
//     Object.keys(listData).forEach(key => {
//       options.push(
//         <option
//           key={key}
//           value={listData[key]["name"]}
//           className="select-boxSearch--options"
//         >{listData[key]["value"]}</option>
//       );
//     });
//     return options;
//   };

//   render() {
//     let { listData } = this.props;
//     return (
//       <div className="mapgroup-sec3">

//         <div id="center">
//           <input
//             className={this.props.className + this.state.stylePre}
//             list={this.props.name}
//             onChange={this.handleChange}
//             onBlur={this.validatedUserTypedWord}
//             placeholder={this.props.name}
//             value={this.state.value_for_dropdown}
//             style={this.props.style}
//             ref={input => {
//               this.setFocus = input;
//             }}
//           ></input>
//           {this.state.showCancel ? (
//             <button className="searchbox__closebtn" onClick={this.clearValue}>
//               &times;
//             </button>
//           ) : null}
//           <datalist id={this.props.name}>
//             <select className={this.props.className} required>
//               {this.props.customEnabled ? null : <option value="-- custom value --">{"Assign a custom value"}</option>}
//               {this.props.customEnabled ? null : <option value="-- custom field --">{"Assign a custom field"}</option>}
//               {this.renderOptions(listData)}
//             </select>
//           </datalist>
//         </div>
//         {this.state.selectedValue === "-- custom value --" || this.state.selectedValue === "-- custom field --"
//             ? 
//               <div id="input">
//               <input
//                 type="text"
//                 className={"contextdropdown__input-text" + this.state.stylePre}
//                 onChange={this.handleChangeInput}
//                 // onBlur={this.validatedUserTypedWord}
//                 value={this.state.typedValue}
//                 placeholder="Give it a name here..."
//               />
//             </div>
//             : null  
//           }
//       </div>
//     );
//   }
// }

// SimpleSearchDropDown.propTypes = {
//   listData: PropTypes.object.isRequired,
//   name: PropTypes.string,
//   className: PropTypes.string.isRequired,
//   style: PropTypes.object
// };

// export default SimpleSearchDropDown;

