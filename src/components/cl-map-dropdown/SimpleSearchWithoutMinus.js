import React from "react";
import "./_mapDropDown.scss";
import PropTypes from "prop-types";
import _ from "lodash";

// newly added from here
import "./_search.scss";
import SelectSearch from "react-select-search";
import { renderFriendNew, fuse } from "./searchHelpers";


class SimpleSearchWithoutMinus extends React.Component {

  constructor(props) {
    super(props);
    let stateObj = this.populateInitialStateMinus(this.props);
    this.state = {
      ...stateObj
    };
  }

  populateInitialStateMinus = props => {
    let predefinedValue = "",
      key_type = "",
      key_value = "",
      forType = "",
      val = "", // newly added
      value_to_show = ""; // newly added

      if (Object.keys(props.value).length !== 0) {
        key_type = props.value.key_type;
        key_value = props.value.key_value;
        forType = props.value.type;
        val = props.value.val; // newly added
        if (key_type === "-- custom field --") {
          predefinedValue = "-- custom field --" // test
        } else {
          predefinedValue = key_value;
        }

        if (forType === "-- custom value --") {
          value_to_show = "-- custom value --"
        } else if (forType === "-- custom field --") {
          value_to_show = "-- custom field --"
        } else {
          if (typeof props.fetchListData[val] === "object") {
            value_to_show = props.fetchListData[val]["name"];
          } // newly added
        }
      } 

    let stateObj = {
      listData: this.renderData(props.listData),
      fetchListData: this.renderDynamicData(props.fetchListData),
      key_type: key_type,
      key_value: key_value,
      forType: forType,
      predefinedValue: predefinedValue,
      val: val, // newly added
      value_to_show: value_to_show, // newly added
      showCancelMinus: false, // new
      showCancelForPredefined: false,
      styleVal: "",
      stylePre: ""
    };
    return stateObj;
  };

  componentDidMount() {
    let defaultList = [];
    defaultList = this.renderData(this.props.listData);// process

    let fetchedList = [];
    fetchedList = this.renderDynamicData(this.props.fetchListData);// process

    this.setState({
      fetchListData: fetchedList,
      listData: defaultList
    }); // process

    let { value } = this.props;

    if (value && value.isValid === false) {
      this.setState({ 
         value_to_show: "",
         key_type: "",
         forType: "",
         key_value: "",
         val: "",
         predefinedValue: "",
         styleVal: " error_border",
         stylePre: " error_border",
         showCancelForPredefined: false,
         showCancelMinus: false,  
      }, this.onChange);
    } 

    if (this.state.value_to_show !== "") {
      this.setState({ showCancelMinus: true });
    }

    if (this.state.predefinedValue !== "") {
      this.setState({ showCancelForPredefined: true });
    }
  } // newly added

  componentDidUpdate(prevProps) {
    const sameProps = _.isEqual(prevProps, this.props);
    // const sameState = _.isEqual(prevState, this.state); // new

    if (!sameProps) {
      let { value } = this.props;

      if (value && value.isValid === false) {
        this.setState({ 
          styleVal: " error_border",
          stylePre: " error_border",
        });
      }
    }
  } // newly added to test

  onChange = () => {
    let { key_type, key_value, forType, val } = this.state;

    if (val === undefined) {
      val = ""
    }

    let state = { key_type, key_value, type: forType, val}; // val newly added
    this.props.onChange(state);
  }; // test

  // renderOptions = (list, addCustomAndDynamic) => {
  //   let options = [];
  //   if (addCustomAndDynamic === "events") {
  //   } 

  //   Object.keys(list).forEach(key => {
  //     options.push(
  //       <option key={key} value={typeof list[key] === "object" ? list[key]["name"] : list[key]}>
  //         {typeof list[key] === "object" ? list[key]["value"] : list[key]}
  //       </option>
  //     );
  //   });
  //   return options;
  // };

  handleTypeChange = value => {
    console.log("key_typekey_type", value);
    let key_type = value && value["value"];
    
      if (key_type !== "-- custom field --") {
        this.setState(
          {
            key_type: "predefined",
            key_value: key_type,
            predefinedValue: key_type, // test,
            showCancelForPredefined: true, // test
            stylePre: "" // new test
          },
          this.onChange
        );
      } else {
        this.setState(
          {
            key_type: "-- custom field --",
            key_value: "",
            predefinedValue: key_type, // test
            showCancelForPredefined: true // test
          },
          this.onChange
        );
      }
  };

  handleValueChange = event => {
    let key_value = event.target.value;
    this.setState({ key_value }, this.onChange);
    if (key_value.trim() !== "") {
      this.setState({ stylePre: "" }, this.onChange);
    }
  };

  handleValueFieldChange = value => {
    console.log("forTypeforTypeforType", value);
    let selectedKey;
    let selctedValue;
    let forType = value && value["value"];
    Object.keys(this.props.fetchListData).forEach(key => {
      if (this.props.fetchListData[key]["name"] === forType) {
        selectedKey = key;
        selctedValue = this.props.fetchListData[key]["name"];
      }  
    });

    if (forType !== "-- custom value --" && forType !== "-- custom field --") {
      this.setState(
        {
          forType: "predefined",
          val: selectedKey,
          value_to_show: selctedValue, // test,
          showCancelMinus: true, // test
          styleVal: "" // new test
        },
        this.onChange
      );
    } else if (forType === "-- custom value --") {
        this.setState(
          {
            forType: "-- custom value --",
            val: "",
            value_to_show: forType, // test
            showCancelMinus: true // test
          },
          this.onChange
        );
    } else if (forType === "-- custom field --") {
        this.setState(
          {
            forType: "-- custom field --",
            val: "",
            value_to_show: forType, // test
            showCancelMinus: true // test
          },
          this.onChange
        );
      }
    
  }; // newly updated

  clearValue = idMinus => {
    if (idMinus === "value_to_show") {
      this.setState({ value_to_show: "", val: "", forType: "", showCancelMinus: false }, this.onChange);
      // this.setFocusMinus.focus();
    } else if(idMinus === "predefinedValue") {
      this.setState({ predefinedValue: "", key_value: "", key_type: "", showCancelForPredefined: false }, this.onChange);
      // this.setFocusPredifinedMinus.focus();
    }
    
  }; // newly added

  handleChangeInput = event => {
    let val = event.target.value;
    this.setState({ val }, this.onChange);
    if (val.trim() !== "") {
      this.setState({ styleVal: "" }, this.onChange);
    }
  }; // newly added
  
  validatedUserTypedWord = (event, decide) => {
    let { fetchListData, listData } = this.props;
    let enteredWord = event.target.value;
    if (decide === "value_to_show") {
      if (!this.isValuePresentInList(enteredWord, fetchListData, decide)) {
        this.setState({ value_to_show: "", val: "", forType: "", showCancelMinus: false }, this.onChange);
      }
    } else if (decide === "predefinedValue") {
      if (!this.isValuePresentInList(enteredWord, listData, decide)) {
        this.setState({ predefinedValue: "", key_value: "", key_type: "", showCancelForPredefined: false }, this.onChange);
      }
    }
    
  }; // newly added

  isValuePresentInList = (word, fetchListData, decide) => {
    let isPresent = false;
    if (decide === "value_to_show") {
      Object.keys(fetchListData).forEach(key => {
        if (fetchListData[key]["name"] === word || word === "-- custom value --" || word === "-- custom field --") {
          isPresent = true;
        }
      });
    } else if (decide === "predefinedValue") {
      Object.keys(fetchListData).forEach(key => {
        if (fetchListData[key] === word || word === "-- custom field --") {
          isPresent = true;
        }
      });
    }
    
    return isPresent;
  }; // newly added

  renderData = list => {
    let options = [{type: 'group', name: "Predefined", items: []}];
    Object.keys(list).forEach(key => {
      options[0].items.push(
        {name: key, value: key, show: list[key]}
      );
    });

    options.push(
      {type: 'group', name: "Custom", items: [
          {name: "-- custom field --", value: "-- custom field --", show: "Create a custom field"},
        ]
      }
    );

    return options;
  }; // new

  renderDynamicData = list => {
    console.log("listdynamic", list);
    let options = [{type: 'group', name: "Predefined", items: []}];
    Object.keys(list).forEach(key => {
      options[0].items.push(
        {name: list[key]["name"], value: list[key]["name"], show: list[key]["value"]}
      );
    });

    options.push(
      {type: 'group', name: "Custom", items: [
          {name: "-- custom value --", value: "-- custom value --", show: "Assign a custom value"},
          {name: "-- custom field --", value: "-- custom field --", show: "Assign a custom field"},
        ]
      }
    );

    return options;
  }; // new

  render() {
    let { listData, fetchListData, predefinedValue } = this.state;

    // console.log("predefinedValuepredefinedValue", predefinedValue);

    // let defaultList = this.renderData(listData); // new

    // let fetchedList = this.renderDynamicData(fetchListData); // new

    return (
        // <div className="contextdropdown-sec3">
        // <div className="mapgroup-sec2">
        <div className="whole_grid1">
          <div id="userIdMinus">
            <div className={"width-100" + this.state.stylePre}>
              <SelectSearch
                key={this.props.iden}
                value={predefinedValue}
                fuse={fuse}
                // options={defaultList}
                options={listData}
                onChange={this.handleTypeChange}
                renderOption={renderFriendNew}
                placeholder={this.props.name}
                search
              />
            </div>
            {this.state.showCancelForPredefined ? (
                <span 
                  className="searchbox__closebtn"  
                  onClick={() => this.clearValue("predefinedValue")}>
                &times;
                </span>
            ) : null}
          </div>  

          {this.state.key_type === "-- custom field --" ? (
            <div>
              <input
                type="text"
                value={this.state.key_value}
                className={"contextdropdown__input-text_1" + this.state.stylePre}
                onChange={this.handleValueChange}
                placeholder="enter field name..."
              />
            </div>
          ) : null}

          <div id="userIdMinus">
              <div className={"width-100" + this.state.styleVal}>
                <SelectSearch
                  key={this.props.keyto}
                  value={this.state.value_to_show}
                  fuse={fuse}
                  // options={fetchedList}
                  options={fetchListData}
                  onChange={this.handleValueFieldChange}
                  renderOption={renderFriendNew}
                  placeholder="Select value"
                  search
                  // style={this.props.style}
                />  
              </div>
            {this.state.showCancelMinus ? (
                <span 
                  className="searchbox__closebtn" 
                  onClick={() => this.clearValue("value_to_show")}>
                &times;
                </span>
            ) : null}
          </div>
          {this.state.forType === "-- custom value --" || this.state.forType === "-- custom field --"
            ? 
              <div>
                <input
                  type="text"
                  className={"contextdropdown__input-text_1" + this.state.styleVal}
                  onChange={this.handleChangeInput}
                  // onBlur={this.validatedUserTypedWord}
                  value={this.state.val}
                  placeholder={this.state.forType === "-- custom value --" ? "enter value name" : "enter field name"}
                />
              </div>
            : null  
          }
        </div>
    );
  }
}

SimpleSearchWithoutMinus.propTypes = {
  dropdownName: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

export default SimpleSearchWithoutMinus;














// import React from "react";
// import "./_mapDropDown.scss";
// import PropTypes from "prop-types";
// import _ from "lodash";

// // newly added from here
// import "./_search.scss";
// import SelectSearch from "react-select-search";
// import { renderFriend, fuse } from "./searchHelpers";


// class SimpleSearchWithoutMinus extends React.Component {

//   constructor(props) {
//     super(props);
//     let stateObj = this.populateInitialStateMinus(this.props);
//     this.state = {
//       ...stateObj
//     };
//   }

//   populateInitialStateMinus = props => {
//     let predefinedValue = "",
//       key_type = "",
//       key_value = "",
//       forType = "",
//       val = "", // newly added
//       value_to_show = ""; // newly added

//       if (Object.keys(props.value).length !== 0) {
//         key_type = props.value.key_type;
//         key_value = props.value.key_value;
//         forType = props.value.type;
//         val = props.value.val; // newly added
//         if (key_type === "-- custom field --") {
//           predefinedValue = "Create a custom field" // test
//         } else {
//           predefinedValue = key_value;
//         }

//         if (forType === "-- custom value --") {
//           value_to_show = "Assign a custom value"
//         } else if (forType === "-- custom field --") {
//           value_to_show = "Assign a custom field"
//         } else {
//           if (typeof props.fetchListData[val] === "object") {
//             value_to_show = props.fetchListData[val]["value"];
//           } // newly added
//         }
//       } 

//     let stateObj = {
//       listData: props.listData,
//       fetchListData: props.fetchListData,
//       key_type: key_type,
//       key_value: key_value,
//       forType: forType,
//       predefinedValue: predefinedValue,
//       val: val, // newly added
//       value_to_show: value_to_show, // newly added
//       showCancelMinus: false, // new
//       showCancelForPredefined: false,
//       styleVal: "",
//       stylePre: ""
//     };
//     return stateObj;
//   };

//   componentDidMount() {
//     let { value } = this.props;

//     if (value && value.isValid === false) {
//       this.setState({ 
//          value_to_show: "",
//          key_type: "",
//          forType: "",
//          key_value: "",
//          val: "",
//          predefinedValue: "",
//          styleVal: " error_border",
//          stylePre: " error_border",
//          showCancelForPredefined: false,
//          showCancelMinus: false,  
//       }, this.onChange);
//     } 

//     if (this.state.value_to_show !== "") {
//       this.setState({ showCancelMinus: true });
//     }

//     if (this.state.predefinedValue !== "") {
//       this.setState({ showCancelForPredefined: true });
//     }
//   } // newly added

//   componentDidUpdate(prevProps) {
//     const sameProps = _.isEqual(prevProps, this.props);
//     // const sameState = _.isEqual(prevState, this.state); // new

//     if (!sameProps) {
//       let { value } = this.props;

//       if (value && value.isValid === false) {
//         this.setState({ 
//           styleVal: " error_border",
//           stylePre: " error_border",
//         });
//       }
//     }
//   } // newly added to test

//   onChange = () => {
//     let { key_type, key_value, forType, val } = this.state;

//     if (val === undefined) {
//       val = ""
//     }

//     let state = { key_type, key_value, type: forType, val}; // val newly added
//     this.props.onChange(state);
//   }; // test

//   // renderOptions = (list, addCustomAndDynamic) => {
//   //   let options = [];
//   //   if (addCustomAndDynamic === "events") {
//   //   } 

//   //   Object.keys(list).forEach(key => {
//   //     options.push(
//   //       <option key={key} value={typeof list[key] === "object" ? list[key]["name"] : list[key]}>
//   //         {typeof list[key] === "object" ? list[key]["value"] : list[key]}
//   //       </option>
//   //     );
//   //   });
//   //   return options;
//   // };

//   handleTypeChange = value => {
//     console.log("key_typekey_type", value);
//     let key_type = value && value["value"];
    
//       if (key_type !== "Create a custom field") {
//         this.setState(
//           {
//             key_type: "predefined",
//             key_value: key_type,
//             predefinedValue: key_type, // test,
//             showCancelForPredefined: true, // test
//             stylePre: "" // new test
//           },
//           this.onChange
//         );
//       } else {
//         this.setState(
//           {
//             key_type: "-- custom field --",
//             key_value: "",
//             predefinedValue: key_type, // test
//             showCancelForPredefined: true // test
//           },
//           this.onChange
//         );
//       }
//   };

//   handleValueChange = event => {
//     let key_value = event.target.value;
//     this.setState({ key_value }, this.onChange);
//     if (key_value.trim() !== "") {
//       this.setState({ stylePre: "" }, this.onChange);
//     }
//   };

//   handleValueFieldChange = value => {
//     console.log("forTypeforTypeforType", value);
//     let selectedKey;
//     let selctedValue;
//     let forType = value && value["value"];
//     Object.keys(this.props.fetchListData).forEach(key => {
//       if (this.props.fetchListData[key]["value"] === forType) {
//         selectedKey = key;
//         selctedValue = this.props.fetchListData[key]["value"];
//       }  
//     });

//     if (forType !== "Assign a custom value" && forType !== "Assign a custom field") {
//       this.setState(
//         {
//           forType: "predefined",
//           val: selectedKey,
//           value_to_show: selctedValue, // test,
//           showCancelMinus: true, // test
//           styleVal: "" // new test
//         },
//         this.onChange
//       );
//     } else if (forType === "Assign a custom value") {
//         this.setState(
//           {
//             forType: "-- custom value --",
//             val: "",
//             value_to_show: forType, // test
//             showCancelMinus: true // test
//           },
//           this.onChange
//         );
//     } else if (forType === "Assign a custom field") {
//         this.setState(
//           {
//             forType: "-- custom field --",
//             val: "",
//             value_to_show: forType, // test
//             showCancelMinus: true // test
//           },
//           this.onChange
//         );
//       }
    
//   }; // newly updated

//   clearValue = idMinus => {
//     if (idMinus === "value_to_show") {
//       this.setState({ value_to_show: "", val: "", forType: "", showCancelMinus: false }, this.onChange);
//       // this.setFocusMinus.focus();
//     } else if(idMinus === "predefinedValue") {
//       this.setState({ predefinedValue: "", key_value: "", key_type: "", showCancelForPredefined: false }, this.onChange);
//       // this.setFocusPredifinedMinus.focus();
//     }
    
//   }; // newly added

//   handleChangeInput = event => {
//     let val = event.target.value;
//     this.setState({ val }, this.onChange);
//     if (val.trim() !== "") {
//       this.setState({ styleVal: "" }, this.onChange);
//     }
//   }; // newly added
  
//   validatedUserTypedWord = (event, decide) => {
//     let { fetchListData, listData } = this.props;
//     let enteredWord = event.target.value;
//     if (decide === "value_to_show") {
//       if (!this.isValuePresentInList(enteredWord, fetchListData, decide)) {
//         this.setState({ value_to_show: "", val: "", forType: "", showCancelMinus: false }, this.onChange);
//       }
//     } else if (decide === "predefinedValue") {
//       if (!this.isValuePresentInList(enteredWord, listData, decide)) {
//         this.setState({ predefinedValue: "", key_value: "", key_type: "", showCancelForPredefined: false }, this.onChange);
//       }
//     }
    
//   }; // newly added

//   isValuePresentInList = (word, fetchListData, decide) => {
//     let isPresent = false;
//     if (decide === "value_to_show") {
//       Object.keys(fetchListData).forEach(key => {
//         if (fetchListData[key]["name"] === word || word === "-- custom value --" || word === "-- custom field --") {
//           isPresent = true;
//         }
//       });
//     } else if (decide === "predefinedValue") {
//       Object.keys(fetchListData).forEach(key => {
//         if (fetchListData[key] === word || word === "-- custom field --") {
//           isPresent = true;
//         }
//       });
//     }
    
//     return isPresent;
//   }; // newly added

//   renderData = list => {
//     console.log("list", list);
//     let options = [{type: 'group', name: "Predefined", items: []}];
//     Object.keys(list).forEach(key => {
//       options[0].items.push(
//         {name: key, value: list[key]}
//       );
//     });

//     options.push(
//       {type: 'group', name: "Custom", items: [
//           {name: "-- custom field --", value: "Create a custom field"},
//         ]
//       }
//     );

//     return options;
//   }; // new

//   renderDynamicData = list => {
//     console.log("listdynamic", list);
//     let options = [{type: 'group', name: "Predefined", items: []}];
//     Object.keys(list).forEach(key => {
//       console.log("sdjkddkldklkdkdlkdl", key, list[key]["name"]);
//       options[0].items.push(
//         {name: list[key]["name"], value: list[key]["value"]}
//       );
//     });

//     options.push(
//       {type: 'group', name: "Custom", items: [
//           {name: "-- custom value --", value: "Assign a custom value"},
//           {name: "-- custom field --", value: "Assign a custom field"},
//         ]
//       }
//     );

//     return options;
//   }; // new

//   render() {
//     let { listData, fetchListData, predefinedValue } = this.state;

//     console.log("predefinedValuepredefinedValue", predefinedValue);

//     let defaultList = this.renderData(listData); // new

//     let fetchedList = this.renderDynamicData(fetchListData); // new

//     return (
//         // <div className="contextdropdown-sec3">
//         // <div className="mapgroup-sec2">
//         <div className="whole_grid1">
//           <div id="userIdMinus">
//             <div className={"width-100" + this.state.stylePre}>
//               <SelectSearch
//                 key={this.props.iden}
//                 value={predefinedValue}
//                 fuse={fuse}
//                 options={defaultList}
//                 onChange={this.handleTypeChange}
//                 renderOption={renderFriend}
//                 placeholder={this.props.name}
//                 search
//                 // style={this.props.style}
//               />
//             </div>
//             {this.state.showCancelForPredefined ? (
//                 <span 
//                   className="searchbox__closebtn"  
//                   onClick={() => this.clearValue("predefinedValue")}>
//                 &times;
//                 </span>
//             ) : null}
//           </div>  

//           {this.state.key_type === "-- custom field --" ? (
//             <div>
//               <input
//                 type="text"
//                 value={this.state.key_value}
//                 className={"contextdropdown__input-text_1" + this.state.stylePre}
//                 onChange={this.handleValueChange}
//                 placeholder="enter field name..."
//               />
//             </div>
//           ) : null}

//           <div id="userIdMinus">
//               <div className={"width-100" + this.state.styleVal}>
//                 <SelectSearch
//                   key={this.props.keyto}
//                   value={this.state.value_to_show}
//                   fuse={fuse}
//                   options={fetchedList}
//                   onChange={this.handleValueFieldChange}
//                   renderOption={renderFriend}
//                   placeholder="Select value"
//                   search
//                   // style={this.props.style}
//                 />  
//               </div>
//             {this.state.showCancelMinus ? (
//                 <span 
//                   className="searchbox__closebtn" 
//                   onClick={() => this.clearValue("value_to_show")}>
//                 &times;
//                 </span>
//             ) : null}
//           </div>
//           {this.state.forType === "-- custom value --" || this.state.forType === "-- custom field --"
//             ? 
//               <div>
//                 <input
//                   type="text"
//                   className={"contextdropdown__input-text_1" + this.state.styleVal}
//                   onChange={this.handleChangeInput}
//                   // onBlur={this.validatedUserTypedWord}
//                   value={this.state.val}
//                   placeholder={this.state.forType === "-- custom value --" ? "enter value name" : "enter field name"}
//                 />
//               </div>
//             : null  
//           }
//         </div>
//     );
//   }
// }

// SimpleSearchWithoutMinus.propTypes = {
//   dropdownName: PropTypes.string,
//   name: PropTypes.string,
//   className: PropTypes.string.isRequired,
//   onChange: PropTypes.func
// };

// export default SimpleSearchWithoutMinus;


















// import React from "react";
// import "./_mapDropDown.scss";
// import PropTypes from "prop-types";
// import _ from "lodash";
    
// class SimpleSearchWithoutMinus extends React.Component {

//   constructor(props) {
//     super(props);
//     let stateObj = this.populateInitialStateMinus(this.props);
//     this.state = {
//       ...stateObj
//     };
//   }

//   populateInitialStateMinus = props => {
//     let predefinedValue = "",
//       key_type = "",
//       key_value = "",
//       forType = "",
//       val = "", // newly added
//       value_to_show = ""; // newly added

//       if (Object.keys(props.value).length !== 0) {
//         key_type = props.value.key_type;
//         key_value = props.value.key_value;
//         forType = props.value.type;
//         val = props.value.val; // newly added
//         if (key_type === "-- custom field --") {
//           predefinedValue = key_type // test
//         } else {
//           predefinedValue = key_value // test 
//         }

//         if (forType === "-- custom value --" || forType === "-- custom field --") {
//           value_to_show = forType
//         } else {
//           if (typeof props.fetchListData[val] === "object") {
//             value_to_show = props.fetchListData[val]["name"];
//           } // newly added
//         }
//       } 

//     let stateObj = {
//       listData: props.listData,
//       fetchListData: props.fetchListData,
//       key_type: key_type,
//       key_value: key_value,
//       forType: forType,
//       predefinedValue: predefinedValue,
//       val: val, // newly added
//       value_to_show: value_to_show, // newly added
//       showCancelMinus: false, // new
//       showCancelForPredefined: false,
//       styleVal: "",
//       stylePre: ""
//     };
//     return stateObj;
//   };

//   componentDidMount() {
//     let { value } = this.props;

//     if (value && value.isValid === false) {
//       this.setState({ 
//          value_to_show: "",
//          key_type: "",
//          forType: "",
//          key_value: "",
//          val: "",
//          predefinedValue: "",
//          styleVal: " error_border",
//          stylePre: " error_border",
//          showCancelForPredefined: false,
//          showCancelMinus: false,  
//       }, this.onChange);
//     } 

//     if (this.state.value_to_show !== "") {
//       this.setState({ showCancelMinus: true });
//     }

//     if (this.state.predefinedValue !== "") {
//       this.setState({ showCancelForPredefined: true });
//     }
//   } // newly added

//   componentDidUpdate(prevProps) {
//     const sameProps = _.isEqual(prevProps, this.props);
//     // const sameState = _.isEqual(prevState, this.state); // new

//     if (!sameProps) {
//       let { value } = this.props;

//       if (value && value.isValid === false) {
//         this.setState({ 
//           styleVal: " error_border",
//           stylePre: " error_border",
//         });
//       }
//     }
//   } // newly added to test

//   onChange = () => {
//     let { key_type, key_value, forType, val } = this.state;

//     if (val === undefined) {
//       val = ""
//     }

//     let state = { key_type, key_value, type: forType, val}; // val newly added
//     this.props.onChange(state);
//   }; // test

//   renderOptions = (list, addCustomAndDynamic) => {
//     let options = [];
//     if (addCustomAndDynamic === "events") {
//     } 

//     Object.keys(list).forEach(key => {
//       options.push(
//         <option key={key} value={typeof list[key] === "object" ? list[key]["name"] : list[key]}>
//           {typeof list[key] === "object" ? list[key]["value"] : list[key]}
//         </option>
//       );
//     });
//     return options;
//   };

//   handleTypeChange = event => {
//     let key_type = event.target.value;
//     if (key_type !== "-- custom field --") {
//       this.setState(
//         {
//           key_type: "predefined",
//           key_value: key_type,
//           predefinedValue: key_type, // test,
//           showCancelForPredefined: true, // test
//           stylePre: "" // new test
//         },
//         this.onChange
//       );
//     } else {
//       this.setState(
//         {
//           key_type,
//           key_value: "",
//           predefinedValue: key_type, // test
//           showCancelForPredefined: true // test
//         },
//         this.onChange
//       );
//     }
//   };

//   handleValueChange = event => {
//     let key_value = event.target.value;
//     this.setState({ key_value }, this.onChange);
//     if (key_value.trim() !== "") {
//       this.setState({ stylePre: "" }, this.onChange);
//     }
//   };

//   handleValueFieldChange = event => {
//     let selectedKey;
//     let selctedValue;
//     let forType = event.target.value;
//     Object.keys(this.props.fetchListData).forEach(key => {
//       if (this.props.fetchListData[key]["name"] === event.target.value) {
//         selectedKey = key;
//         selctedValue = this.props.fetchListData[key]["name"]
//       }
//     });
//     // let forType = event.target.value;
//     if (forType !== "-- custom value --" && forType !== "-- custom field --") {
//       this.setState(
//         {
//           forType: "predefined",
//           val: selectedKey,
//           value_to_show: selctedValue, // test,
//           showCancelMinus: true, // test
//           styleVal: "" // new test
//         },
//         this.onChange
//       );
//     } else if (forType === "") {
//       this.setState(
//         {
//           forType: "",
//           val: "",
//           value_to_show: "", // test,
//           showCancelMinus: false, // test
//           styleVal: "" // new test
//         },
//         this.onChange
//       );
//     } else {
//       this.setState(
//         {
//           forType: forType,
//           val: "",
//           value_to_show: forType, // test
//           showCancelMinus: true // test
//         },
//         this.onChange
//       );
//     }
    
//   }; // newly updated

//   clearValue = idMinus => {
//     if (idMinus === "value_to_show") {
//       this.setState({ value_to_show: "", val: "", forType: "", showCancelMinus: false }, this.onChange);
//       this.setFocusMinus.focus();
//     } else if(idMinus === "predefinedValue") {
//       this.setState({ predefinedValue: "", key_value: "", key_type: "", showCancelForPredefined: false }, this.onChange);
//       this.setFocusPredifinedMinus.focus();
//     }
    
//   }; // newly added

//   handleChangeInput = event => {
//     let val = event.target.value;
//     this.setState({ val }, this.onChange);
//     if (val.trim() !== "") {
//       this.setState({ styleVal: "" }, this.onChange);
//     }
//   }; // newly added
  
//   validatedUserTypedWord = (event, decide) => {
//     let { fetchListData, listData } = this.props;
//     let enteredWord = event.target.value;
//     if (decide === "value_to_show") {
//       if (!this.isValuePresentInList(enteredWord, fetchListData, decide)) {
//         this.setState({ value_to_show: "", val: "", forType: "", showCancelMinus: false }, this.onChange);
//       }
//     } else if (decide === "predefinedValue") {
//       if (!this.isValuePresentInList(enteredWord, listData, decide)) {
//         this.setState({ predefinedValue: "", key_value: "", key_type: "", showCancelForPredefined: false }, this.onChange);
//       }
//     }
    
//   }; // newly added

//   isValuePresentInList = (word, fetchListData, decide) => {
//     let isPresent = false;
//     if (decide === "value_to_show") {
//       Object.keys(fetchListData).forEach(key => {
//         if (fetchListData[key]["name"] === word || word === "-- custom value --" || word === "-- custom field --") {
//           isPresent = true;
//         }
//       });
//     } else if (decide === "predefinedValue") {
//       Object.keys(fetchListData).forEach(key => {
//         if (fetchListData[key] === word || word === "-- custom field --") {
//           isPresent = true;
//         }
//       });
//     }
    
//     return isPresent;
//   }; // newly added

//   render() {
//     let { listData, fetchListData, predefinedValue } = this.state;

//     return (
//         // <div className="contextdropdown-sec3">
//         <div className="mapgroup-sec2">
//           <div id="userIdMinus">
//             <input
//               className={this.props.className + this.state.stylePre}
//               list={this.props.iden}
//               onChange={this.handleTypeChange}
//               onBlur={(event) => this.validatedUserTypedWord(event, "predefinedValue")}
//               placeholder={this.props.name}
//               value={predefinedValue}
//               style={this.props.style}
//               ref={input => {
//                 this.setFocusPredifinedMinus = input;
//               }}
//             ></input>
//             {this.state.showCancelForPredefined ? (
//                 <button className="searchbox__closebtn" onClick={() => this.clearValue("predefinedValue")}>
//                 &times;
//                 </button>
//             ) : null}
//             <datalist id={this.props.iden}>
//                 <select className={this.props.className} required>
//                   {this.renderOptions(listData, true)}
//                   <option value="-- custom field --"></option>
//                 </select>
//             </datalist>
//           </div>  

//           {this.state.key_type === "-- custom field --" ? (
//             <div>
//               <input
//                 type="text"
//                 value={this.state.key_value}
//                 className={"contextdropdown__input-text" + this.state.stylePre}
//                 onChange={this.handleValueChange}
//                 placeholder="enter a field name..."
//               />
//             </div>
//           ) : null}

//           <div id="userIdMinus">
//             <input
//                 className={this.props.className + this.state.styleVal}
//                 list={this.props.keyto}
//                 onChange={this.handleValueFieldChange}
//                 onBlur={(event) => this.validatedUserTypedWord(event, "value_to_show")}
//                 placeholder="select the value"
//                 value={this.state.value_to_show} // updated
//                 style={this.props.style}
//                 ref={input => {
//                   this.setFocusMinus = input;
//                 }}
//             ></input>
//             {this.state.showCancelMinus ? (
//                 <button className="searchbox__closebtn" onClick={() => this.clearValue("value_to_show")}>
//                 &times;
//                 </button>
//             ) : null}
//             <datalist id={this.props.keyto}>
//                 <select className={this.props.className} required>
//                   <option value="-- custom value --">{"Assign a custom value"}</option>
//                   <option value="-- custom field --">{"Assign a custom field"}</option>
//                   {this.renderOptions(fetchListData, false)}
//                 </select>
//             </datalist>
//           </div>
//           {this.state.forType === "-- custom value --" || this.state.forType === "-- custom field --"
//             ? 
//               <div>
//                 <input
//                   type="text"
//                   className={"contextdropdown__input-text" + this.state.styleVal}
//                   onChange={this.handleChangeInput}
//                   // onBlur={this.validatedUserTypedWord}
//                   value={this.state.val}
//                   placeholder={this.state.forType === "-- custom value --" ? "enter a value..." : "enter a field..."}
//                 />
//               </div>
//             : null  
//           }
//         </div>
//     );
//   }
// }

// SimpleSearchWithoutMinus.propTypes = {
//   dropdownName: PropTypes.string,
//   name: PropTypes.string,
//   className: PropTypes.string.isRequired,
//   onChange: PropTypes.func
// };

// export default SimpleSearchWithoutMinus;

