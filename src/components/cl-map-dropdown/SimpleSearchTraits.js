import React from "react";
// import "./_simpleSearchDropDown.scss";
import PropTypes from "prop-types";
import _ from "lodash";

 // newly added from here
import "./_search.scss";
import SelectSearch from "react-select-search";
import { renderFriendNew, fuse } from "./searchHelpers";

class SimpleSearchTraits extends React.Component {
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
      traitsValue = ""; // newly added

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

    let stateObj = {
      listData: props.listData,
      selectedTraits: selectedTraits,
      traitsValue: traitsValue,
      value_for_traits: value_for_traits,
      showCancel: false, // new
      stylePre: "" // newly added
    };
    return stateObj;
  };

  componentDidMount() {

    let { value } = this.props;

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
    this.setState({ selectedTraits: "", value_for_traits: "", traitsValue: "", showCancel: false }, this.onChange);
    this.props.onChange("");
    // this.setFocusTraits.focus();
  };

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

  handleChangeInput = event => {
    let traitsValue = event.target.value;
    this.setState({ traitsValue }, this.onChange);
    if (traitsValue.trim() !== "") {
      this.setState({ stylePre: "" }, this.onChange);
    }
  }; // newly added

  onChange = () => {
    let { traitsValue, selectedTraits } = this.state;
    if (selectedTraits === undefined) {
      selectedTraits = "";
    }

    let selectedTraitsVal = { type: selectedTraits, val: traitsValue ? traitsValue : "" };
    this.props.onChange(selectedTraitsVal);
  }; // newly added

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

  render() {
    let { listData } = this.props;
    let opt = [];
    opt = this.renderData(listData);
    
    return (
      // <div className="mapgroup-sec6">
      <div>

        <div className="field-mapper__inputSection">
          <input
            type="text"
            className={this.props.class}
            value={this.props.value_field}
            placeholder={this.props.placeholder}
            onChange={this.props.onTextChange}
          />
        </div>

        <div id="traits">
          <div className={this.state.stylePre}>
            <SelectSearch
              key="listData"
              value={this.state.value_for_traits}
              fuse={fuse}
              options={opt}
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
                    className={"contextdropdown__input-text" + this.state.stylePre}
                    onChange={this.handleChangeInput}
                    // onBlur={this.validatedUserTypedWord}
                    value={this.state.traitsValue}
                    placeholder={this.state.selectedTraits === "-- custom value --" ? "enter a value..." : "enter a field..."}
                />
              </div>
            : null  
          }

          <div className="fieldmapper-remove">
            <button
              onClick={this.props.onClick}
              type="button"
              className="field-mapper__remove-btn field-mapper-m0"
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

SimpleSearchTraits.propTypes = {
  listData: PropTypes.object.isRequired,
  name: PropTypes.string,
  className: PropTypes.string.isRequired,
  style: PropTypes.object
};

export default SimpleSearchTraits;









// import React from "react";
// // import "./_simpleSearchDropDown.scss";
// import PropTypes from "prop-types";
// import _ from "lodash";

//  // newly added from here
// import "./_search.scss";
// import SelectSearch from "react-select-search";
// import { renderFriend, fuse } from "./searchHelpers";

// class SimpleSearchTraits extends React.Component {
//   constructor(props) {
//     super(props);
    
//     let stateObj = this.populateInitialState(this.props);
//     this.state = {
//       ...stateObj
//     };

//     this.ref = React.createRef(); // newly added
//   }

//   populateInitialState = props => {
//     let value_for_traits = "",
//       selectedTraits = "",
//       traitsValue = ""; // newly added

//       if (Object.keys(props.value).length !== 0) {
//         selectedTraits = props.value.type;
//         traitsValue = props.value.val;

//         if (selectedTraits === "-- custom value --") {
//           value_for_traits = "Assign a custom value";
//         } else if (selectedTraits === "-- custom field --") {
//           value_for_traits = "Assign a custom field";
//         } else {
//           if (typeof props.listData[traitsValue] === "object") {
//             value_for_traits = props.listData[traitsValue]["value"];
//           } // newly added
//         }
//       }

//     let stateObj = {
//       listData: props.listData,
//       selectedTraits: selectedTraits,
//       traitsValue: traitsValue,
//       value_for_traits: value_for_traits,
//       showCancel: false, // new
//       stylePre: "" // newly added
//     };
//     return stateObj;
//   };

//   componentDidMount() {

//     let { value } = this.props;

//     if (value && value.isValid === false) {
//       this.setState({ 
//         selectedTraits: "",
//         traitsValue: "",
//         value_for_traits: "",
//         stylePre: " error_border",
//         showCancel: false,
//       }, this.onChange);
//     }

//     if (this.state.selectedTraits !== "") {
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
//     this.setState({ selectedTraits: "", value_for_traits: "", traitsValue: "", showCancel: false }, this.onChange);
//     this.props.onChange("");
//     // this.setFocusTraits.focus();
//   };

//   handleChange = (value) => {
//     console.log("valuevaluevalue", value);
//     let selectedKey;
//     let selctedValue;
//     let selectedTraits = value && value["value"];
//     console.log("selectedTraits", selectedTraits);
//     Object.keys(this.props.listData).forEach(key => {
//       if (this.props.listData[key]["value"] === selectedTraits) { 
//         console.log("okok", key);
//         this.setState(
//           {
//             selectedTraits: "predefined",
//             traitsValue: key,
//             value_for_traits: this.props.listData[key]["value"], // test,
//             showCancel: true, // test
//             stylePre: "" // new test
//           },
//           this.onChange
//         );
//       } else if (selectedTraits === "Assign a custom value") {
//         this.setState(
//           {
//             selectedTraits: "-- custom value --",
//             traitsValue: "",
//             value_for_traits: "Assign a custom value", // test
//             showCancel: true // test
//           },
//           this.onChange
//         );
//       } else if (selectedTraits === "Assign a custom field") {
//         this.setState(
//           {
//             selectedTraits: "-- custom field --",
//             traitsValue: "",
//             value_for_traits: "Assign a custom field", // test
//             showCancel: true // test
//           },
//           this.onChange
//         );
//       }
//     });

//   };

//   handleChangeInput = event => {
//     let traitsValue = event.target.value;
//     this.setState({ traitsValue }, this.onChange);
//     if (traitsValue.trim() !== "") {
//       this.setState({ stylePre: "" }, this.onChange);
//     }
//   }; // newly added

//   onChange = () => {
//     let { traitsValue, selectedTraits } = this.state;
//     if (selectedTraits === undefined) {
//       selectedTraits = "";
//     }

//     let selectedTraitsVal = { type: selectedTraits, val: traitsValue ? traitsValue : "" };
//     this.props.onChange(selectedTraitsVal);
//   }; // newly added

//   validatedUserTypedWord = event => {
//     let { listData } = this.props;
//     let enteredWord = event.target.value;
//     if (!this.isValuePresentInList(enteredWord, listData)) {
//       this.setState({value_for_traits: "", selectedTraits: "", traitsValue: "", showCancel: false}, this.onChange);
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
//     let opt = [];
//     opt = this.renderData(listData);
    
//     return (
//       // <div className="mapgroup-sec6">
//       <div>

//         <div className="field-mapper__inputSection">
//           <input
//             type="text"
//             className={this.props.class}
//             value={this.props.value_field}
//             placeholder={this.props.placeholder}
//             onChange={this.props.onTextChange}
//           />
//         </div>

//         <div id="traits">
//           <div className={this.state.stylePre}>
//             <SelectSearch
//               key="listData"
//               // onBlur={this.validatedUserTypedWord}
//               value={this.state.value_for_traits}
//               fuse={fuse}
//               options={opt}
//               onChange={this.handleChange}
//               renderOption={renderFriend}
//               placeholder={this.props.name}
//               search
//             />
//           </div>

//           {this.state.showCancel ? (
//             <span className="searchbox__closebtn_1" onClick={this.clearValue}>
//               &times;
//             </span>
//           ) : null}
//         </div>
//         {this.state.selectedTraits === "-- custom value --" || this.state.selectedTraits === "-- custom field --"
//             ? 
//               <div className="displayib">
//                 <input
//                     type="text"
//                     className={"contextdropdown__input-text" + this.state.stylePre}
//                     onChange={this.handleChangeInput}
//                     // onBlur={this.validatedUserTypedWord}
//                     value={this.state.traitsValue}
//                     placeholder={this.state.selectedTraits === "-- custom value --" ? "enter a value..." : "enter a field..."}
//                 />
//               </div>
//             : null  
//           }

//           <div className="fieldmapper-remove">
//             <button
//               onClick={this.props.onClick}
//               type="button"
//               className="field-mapper__remove-btn field-mapper-m0"
//             >
//               <img
//                 src={require("../../assets/icons/minus.svg")}
//                 alt="minus-img"
//                 id="field-mapper__remove-img"
//               />
//             </button>
//           </div>
//       </div>
//     );
//   }
// }

// SimpleSearchTraits.propTypes = {
//   listData: PropTypes.object.isRequired,
//   name: PropTypes.string,
//   className: PropTypes.string.isRequired,
//   style: PropTypes.object
// };

// export default SimpleSearchTraits;















// import React from "react";
// import "./_simpleSearchDropDown.scss";
// import PropTypes from "prop-types";
// import _ from "lodash";

// class SimpleSearchTraits extends React.Component {
//   constructor(props) {
//     super(props);
    
//     let stateObj = this.populateInitialState(this.props);
//     this.state = {
//       ...stateObj
//     };
//   }

//   populateInitialState = props => {
//     let value_for_traits = "",
//       selectedTraits = "",
//       traitsValue = ""; // newly added

//       if (Object.keys(props.value).length !== 0) {
//         selectedTraits = props.value.type;
//         traitsValue = props.value.val;

//         if (selectedTraits === "-- custom value --" || selectedTraits === "-- custom field --") {
//           value_for_traits = selectedTraits
//         } else {
//           if (typeof props.listData[traitsValue] === "object") {
//             value_for_traits = props.listData[traitsValue]["v"];
//           } // newly added
//         }
//       }

//     let stateObj = {
//       listData: props.listData,
//       selectedTraits: selectedTraits,
//       traitsValue: traitsValue,
//       value_for_traits: value_for_traits,
//       showCancel: false, // new
//       stylePre: "" // newly added
//     };
//     return stateObj;
//   };

//   componentDidMount() {

//     let { value } = this.props;

//     if (value && value.isValid === false) {
//       this.setState({ 
//         selectedTraits: "",
//         traitsValue: "",
//         value_for_traits: "",
//         stylePre: " error_border",
//         showCancel: false,
//       }, this.onChange);
//     }

//     if (this.state.selectedTraits !== "") {
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
//     this.setState({ selectedTraits: "", value_for_traits: "", traitsValue: "", showCancel: false }, this.onChange);
//     this.props.onChange("");
//     this.setFocusTraits.focus();
//   };

//   handleChange = event => {
//     let selectedKey;
//     let selctedValue;
//     let selectedTraits = event.target.value;
//     Object.keys(this.props.listData).forEach(key => {
//       if (this.props.listData[key]["v"] === event.target.value) {
//         selectedKey = key;
//         selctedValue = this.props.listData[key]["v"]
//       }
//     });

//     if (selectedTraits !== "-- custom value --" && selectedTraits !== "-- custom field --") {
//       this.setState(
//         {
//           selectedTraits: "predefined",
//           traitsValue: selectedKey,
//           value_for_traits: selctedValue, // test,
//           showCancel: true, // test
//           stylePre: "" // new test
//         },
//         this.onChange
//       );
//     } else {
//       this.setState(
//         {
//           selectedTraits: selectedTraits,
//           traitsValue: "",
//           value_for_traits: selectedTraits, // test
//           showCancel: true // test
//         },
//         this.onChange
//       );
//     }
//   };

//   handleChangeInput = event => {
//     let traitsValue = event.target.value;
//     this.setState({ traitsValue }, this.onChange);
//     if (traitsValue.trim() !== "") {
//       this.setState({ stylePre: "" }, this.onChange);
//     }
//   }; // newly added

//   onChange = () => {
//     let { traitsValue, selectedTraits } = this.state;
//     if (selectedTraits === undefined) {
//       selectedTraits = "";
//     }

//     let selectedTraitsVal = { type: selectedTraits, val: traitsValue ? traitsValue : "" };
//     this.props.onChange(selectedTraitsVal);
//   }; // newly added

//   validatedUserTypedWord = event => {
//     let { listData } = this.props;
//     let enteredWord = event.target.value;
//     if (!this.isValuePresentInList(enteredWord, listData)) {
//       this.setState({value_for_traits: "", selectedTraits: "", traitsValue: "", showCancel: false}, this.onChange);
//     }
//   };

//   isValuePresentInList = (word, listData) => {
//     let isPresent = false;
//     Object.keys(listData).forEach(key => {
//       if (listData[key]["v"] === word  || word === "-- custom value --" || word === "-- custom field --") {
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
//           value={listData[key]["v"]}
//           className="select-boxSearch--options"
//         >{listData[key]["value"]}</option>
//       );
//     });
//     return options;
//   };

//   render() {
//     let { listData } = this.props;
//     return (
//       <div className="mapgroup-sec6">

//         <div className="field-mapper__inputSection">
//           <input
//             type="text"
//             className={this.props.class}
//             value={this.props.value_field}
//             placeholder={this.props.placeholder}
//             onChange={this.props.onTextChange}
//           />
//         </div>

//         <div id="traits">
//           <input
//             className={this.props.className + this.state.stylePre}
//             list={this.props.name}
//             onChange={this.handleChange}
//             onBlur={this.validatedUserTypedWord}
//             placeholder={this.props.name}
//             value={this.state.value_for_traits}
//             style={this.props.style}
//             ref={input => {
//               this.setFocusTraits = input;
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
//         {this.state.selectedTraits === "-- custom value --" || this.state.selectedTraits === "-- custom field --"
//             ? 
//               <div>
//                 <input
//                     type="text"
//                     className={"contextdropdown__input-text" + this.state.stylePre}
//                     onChange={this.handleChangeInput}
//                     // onBlur={this.validatedUserTypedWord}
//                     value={this.state.traitsValue}
//                     placeholder={this.state.selectedTraits === "-- custom value --" ? "enter a value..." : "enter a field..."}
//                 />
//               </div>
//             : null  
//           }

//           <div className="fieldmapper-remove">
//             <button
//               onClick={this.props.onClick}
//               type="button"
//               className="field-mapper__remove-btn field-mapper-m0"
//             >
//               <img
//                 src={require("../../assets/icons/minus.svg")}
//                 alt="minus-img"
//                 id="field-mapper__remove-img"
//               />
//             </button>
//           </div>
//       </div>
//     );
//   }
// }

// SimpleSearchTraits.propTypes = {
//   listData: PropTypes.object.isRequired,
//   name: PropTypes.string,
//   className: PropTypes.string.isRequired,
//   style: PropTypes.object
// };

// export default SimpleSearchTraits;

