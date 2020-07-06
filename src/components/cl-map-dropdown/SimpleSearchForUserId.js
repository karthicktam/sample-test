import React from "react";
import "./_mapDropDown.scss";
import PropTypes from "prop-types";
import _ from "lodash";

// newly added from here
import "./_search.scss";
import SelectSearch from "react-select-search";
import { renderFriendNew, fuse } from "./searchHelpers";

class SimpleSearchUser extends React.Component {

  constructor(props) {
    super(props);
    let stateObj = this.populateInitialStateUser(this.props);
    this.state = {
      ...stateObj
    };
  }

  populateInitialStateUser = props => {
    let predefinedValueForUser = "",
      user_type = "",
      user_value = "",
      typeFor = "",
      val_user = "", // newly added
      value_for_user = ""; // newly added

      if (Object.keys(props.value).length !== 0) {
        user_type = props.value.key_type;
        user_value = props.value.key_value;
        typeFor = props.value.type;
        val_user = props.value.val; // newly added
        if (user_type === "-- custom field --") {
          predefinedValueForUser = "-- custom field --"; // test
        } else {
          predefinedValueForUser = user_value; // test 
        }

        if (typeFor === "-- custom value --") {
          value_for_user = "-- custom value --";
        } else if (typeFor === "-- custom field --") {
          value_for_user = "-- custom field --";
        } else {
          if (typeof props.fetchListData[val_user] === "object") {
            value_for_user = props.fetchListData[val_user]["name"];
          } // newly added
        }
      }

    let stateObj = {
      listData: this.renderData(props.listData),
      fetchListData: this.renderDynamicData(props.fetchListData),
      user_type: user_type,
      user_value: user_value,
      typeFor: typeFor,
      predefinedValueForUser: predefinedValueForUser,
      val_user: val_user, // newly added
      value_for_user: value_for_user, // newly added
      showCancelUser: false, // new
      showCancelForPredefinedUser: false,
      styleVal: "", // newly added test
      stylePre: "",
    };
    return stateObj;
  };

  componentDidMount() {

    let defaultList = this.renderData(this.props.listData);

    let fetchedList = this.renderDynamicData(this.props.fetchListData);

    this.setState({
      fetchListData: fetchedList,
      listData: defaultList
    }); // process

    let { value } = this.props;

    if (value && value.isValid === false) {
      this.setState({ 
        user_type: "",
        user_value: "",
        typeFor: "",
        predefinedValueForUser: "",
        val_user: "",
        value_for_user: "",
        styleVal: " error_border",
        stylePre: " error_border",
        showCancelUser: false,
        showCancelForPredefinedUser: false
      }, this.onChange);
    } // test

    if (this.state.value_for_user !== "") {
      this.setState({ showCancelUser: true });
    }

    if (this.state.predefinedValueForUser !== "") {
      this.setState({ showCancelForPredefinedUser: true });
    }
  } // newly added

  componentDidUpdate(prevProps) {
    const samePropsIdentify = _.isEqual(prevProps, this.props);

    if (!samePropsIdentify) {
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
    let { user_type, user_value, typeFor, val_user } = this.state;

    if (val_user === undefined) {
      val_user = ""
    }

    let state = { key_type: user_type, key_value: user_value, type: typeFor, val: val_user}; // val newly added

    this.props.onMappingUpdate(this.props.lineId, state); // for update
    this.props.onChangeUser(state); // new
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
  
  handleTypeChangeUser = value => {
    let user_type = value && value["value"];
    if (user_type !== "-- custom field --") {
      this.setState(
        {
          user_type: "predefined",
          user_value: user_type,
          predefinedValueForUser: user_type, // test,
          showCancelForPredefinedUser: true, // test
          stylePre: "" // new test
        },
        this.onChange
      );
    } else {
      this.setState(
        {
          user_type: "-- custom field --",
          user_value: "",
          predefinedValueForUser: user_type, // test
          showCancelForPredefinedUser: true // test
        },
        this.onChange
      );
    }
  };

  handleValueChangeUser = event => {
    let user_value = event.target.value;
    this.setState({ user_value }, this.onChange);
    if (user_value.trim() !== "") {
      this.setState({ stylePre: "" }, this.onChange);
    }
  };

  handleValueFieldChangeUser = value => {
    console.log("valuevalue", value);
    let selectedKey;
    let selctedValue;
    let typeFor = value && value["value"];
    Object.keys(this.props.fetchListData).forEach(key => {
      if (this.props.fetchListData[key]["name"] === typeFor) {
        selectedKey = key;
        selctedValue = this.props.fetchListData[key]["name"];
      }
    });

    if (typeFor !== "-- custom value --" && typeFor !== "-- custom field --") {
      this.setState(
        {
          typeFor: "predefined",
          val_user: selectedKey,
          value_for_user: selctedValue, // test,
          showCancelUser: true, // test
          styleVal: "" // new test
        },
        this.onChange
      );
    } else if (typeFor === "-- custom value --") {
      this.setState(
        {
          typeFor: "-- custom value --",
          val_user: "",
          value_for_user: typeFor, // test
          showCancelUser: true // test
        },
        this.onChange
      );
    } else if (typeFor === "-- custom field --") {
      this.setState(
        {
          typeFor: "-- custom field --",
          val_user: "",
          value_for_user: typeFor, // test
          showCancelUser: true // test
        },
        this.onChange
      );
    }
  }; // newly updated


  onDeleteUserField = () => {
    this.props.onMappingDelete(this.props.lineId);
  }; // test

  clearValue = iden => {
    if (iden === "value_for_user") {
      this.setState({ value_for_user: "", val_user: "", typeFor: "", showCancelUser: false }, this.onChange);
      // this.setFocus.focus();
    } else if(iden === "predefinedValueForUser") {
      this.setState({ predefinedValueForUser: "", user_value: "", user_type: "", showCancelForPredefinedUser: false }, this.onChange);
      // this.setFocusPredefined.focus();
    }
  }; // newly added

  handleChangeInputUser = event => {
    let val_user = event.target.value;
    this.setState({ val_user }, this.onChange);
    if (val_user.trim() !== "") {
      this.setState({ styleVal: "" }, this.onChange);
    }
  }; // newly added
 
  validatedUserTypedWord = (event, decide) => {
    let { fetchListData, listData } = this.props;
    let enteredWord = event.target.value;
    if (decide === "value_for_user") {
      if (!this.isValuePresentInList(enteredWord, fetchListData, decide)) {
        this.setState({ value_for_user: "", val_user: "", typeFor: "", showCancelUser: false }, this.onChange);
      }
    } else if (decide === "predefinedValueForUser") {
      if (!this.isValuePresentInList(enteredWord, listData, decide)) {
        this.setState({ predefinedValueForUser: "", user_value: "", user_type: "", showCancelForPredefinedUser: false }, this.onChange);
      }
    }
    
  }; // newly added

  isValuePresentInList = (word, fetchListData, decide) => {
    let isPresent = false;
    if (decide === "value_for_user") {
      Object.keys(fetchListData).forEach(key => {
        if (fetchListData[key]["name"] === word || word === "-- custom value --" || word === "-- custom field --") {
          isPresent = true;
        }
      });
    } else if (decide === "predefinedValueForUser") {
      Object.keys(fetchListData).forEach(key => {
        if (fetchListData[key] === word || word === "-- custom field --") {
          isPresent = true;
        }
      });
    }
    
    return isPresent;
  }; // newly added

  renderData = list => {
    console.log("list", list);
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
    let { listData, fetchListData, predefinedValueForUser } = this.state;

    // let defaultList = this.renderData(listData); // new

    // let fetchedList = this.renderDynamicData(fetchListData); // new

    return (
        // <div className="contextdropdown-sec3">
        // <div className="mapgroup-sec2">
        <div className="whole_grid2">
          <div id="userId">
            <div className={"width-100" + this.state.stylePre}>
              <SelectSearch
                key={this.props.valTo}
                value={predefinedValueForUser}
                // options={defaultList}
                options={listData}
                onChange={this.handleTypeChangeUser}
                renderOption={renderFriendNew}
                placeholder={this.props.name}
                search
                fuse={fuse}
                // style={this.props.style}
              />
            </div>
            {this.state.showCancelForPredefinedUser ? (
                <span 
                  className="searchbox__closebtn" 
                  onClick={() => this.clearValue("predefinedValueForUser")}>
                &times;
                </span>
            ) : null}
          </div>  

          {this.state.user_type === "-- custom field --" ? (
            <div>
              <input
                type="text"
                value={this.state.user_value}
                className={"contextdropdown__input-text_1" + this.state.stylePre}
                onChange={this.handleValueChangeUser}
                placeholder="enter a field name..."
              />
            </div>
          ) : null}

          <div id="userId">
              <div className={"width-100" + this.state.styleVal}>
                <SelectSearch
                  key={this.props.keyTo}
                  value={this.state.value_for_user}
                  fuse={fuse}
                  // options={fetchedList}
                  options={fetchListData}
                  onChange={this.handleValueFieldChangeUser}
                  renderOption={renderFriendNew}
                  placeholder="Select value"
                  search
                  // style={this.props.style}
                />    
              </div>
            {this.state.showCancelUser ? (
                <span 
                  className="searchbox__closebtn" 
                  onClick={() => this.clearValue("value_for_user")}>
                &times;
                </span>
            ) : null}
          </div>

          {this.state.typeFor === "-- custom value --" || this.state.typeFor === "-- custom field --"
            ? 
              <div id="check">
                <input
                  type="text"
                  className={"contextdropdown__input-text_1" + this.state.styleVal}
                  onChange={this.handleChangeInputUser}
                  value={this.state.val_user}
                  placeholder={this.state.typeFor === "-- custom value --" ? "enter a value..." : "enter a field..."}
                />
              </div>
            : null  
          }

          <div className="fieldmapper-remove_1">
            <button
              onClick={this.onDeleteUserField}
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

SimpleSearchUser.propTypes = {
  dropdownName: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

export default SimpleSearchUser;











// import React from "react";
// import "./_mapDropDown.scss";
// import PropTypes from "prop-types";
// import _ from "lodash";

// // newly added from here
// import "./_search.scss";
// import SelectSearch from "react-select-search";
// import { renderFriend, fuse } from "./searchHelpers";

// class SimpleSearchUser extends React.Component {

//   constructor(props) {
//     super(props);
//     let stateObj = this.populateInitialStateUser(this.props);
//     this.state = {
//       ...stateObj
//     };
//   }

//   populateInitialStateUser = props => {
//     let predefinedValueForUser = "",
//       user_type = "",
//       user_value = "",
//       typeFor = "",
//       val_user = "", // newly added
//       value_for_user = ""; // newly added

//       if (Object.keys(props.value).length !== 0) {
//         user_type = props.value.key_type;
//         user_value = props.value.key_value;
//         typeFor = props.value.type;
//         val_user = props.value.val; // newly added
//         if (user_type === "-- custom field --") {
//           predefinedValueForUser = "Create a custom field"; // test
//         } else {
//           predefinedValueForUser = user_value; // test 
//         }

//         if (typeFor === "-- custom value --") {
//           value_for_user = "Assign a custom value";
//         } else if (typeFor === "-- custom field --") {
//           value_for_user = "Assign a custom field";
//         } else {
//           if (typeof props.fetchListData[val_user] === "object") {
//             value_for_user = props.fetchListData[val_user]["value"];
//           } // newly added
//         }
//       }

//     let stateObj = {
//       listData: props.listData,
//       fetchListData: props.fetchListData,
//       user_type: user_type,
//       user_value: user_value,
//       typeFor: typeFor,
//       predefinedValueForUser: predefinedValueForUser,
//       val_user: val_user, // newly added
//       value_for_user: value_for_user, // newly added
//       showCancelUser: false, // new
//       showCancelForPredefinedUser: false,
//       styleVal: "", // newly added test
//       stylePre: "",
//     };
//     return stateObj;
//   };

//   componentDidMount() {
//     let { value } = this.props;

//     if (value && value.isValid === false) {
//       this.setState({ 
//         user_type: "",
//         user_value: "",
//         typeFor: "",
//         predefinedValueForUser: "",
//         val_user: "",
//         value_for_user: "",
//         styleVal: " error_border",
//         stylePre: " error_border",
//         showCancelUser: false,
//         showCancelForPredefinedUser: false
//       }, this.onChange);
//     } // test

//     if (this.state.value_for_user !== "") {
//       this.setState({ showCancelUser: true });
//     }

//     if (this.state.predefinedValueForUser !== "") {
//       this.setState({ showCancelForPredefinedUser: true });
//     }
//   } // newly added

//   componentDidUpdate(prevProps) {
//     const samePropsIdentify = _.isEqual(prevProps, this.props);

//     if (!samePropsIdentify) {
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
//     let { user_type, user_value, typeFor, val_user } = this.state;

//     if (val_user === undefined) {
//       val_user = ""
//     }

//     let state = { key_type: user_type, key_value: user_value, type: typeFor, val: val_user}; // val newly added

//     this.props.onMappingUpdate(this.props.lineId, state); // for update
//     this.props.onChangeUser(state); // new
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
  
//   handleTypeChangeUser = value => {
//     let user_type = value && value["value"];
//     if (user_type !== "Create a custom field") {
//       this.setState(
//         {
//           user_type: "predefined",
//           user_value: user_type,
//           predefinedValueForUser: user_type, // test,
//           showCancelForPredefinedUser: true, // test
//           stylePre: "" // new test
//         },
//         this.onChange
//       );
//     } else {
//       this.setState(
//         {
//           user_type: "-- custom field --",
//           user_value: "",
//           predefinedValueForUser: user_type, // test
//           showCancelForPredefinedUser: true // test
//         },
//         this.onChange
//       );
//     }
//   };

//   handleValueChangeUser = event => {
//     let user_value = event.target.value;
//     this.setState({ user_value }, this.onChange);
//     if (user_value.trim() !== "") {
//       this.setState({ stylePre: "" }, this.onChange);
//     }
//   };

//   handleValueFieldChangeUser = value => {
//     console.log("valuevalue", value);
//     let selectedKey;
//     let selctedValue;
//     let typeFor = value && value["value"];
//     Object.keys(this.props.fetchListData).forEach(key => {
//       if (this.props.fetchListData[key]["value"] === typeFor) {
//         selectedKey = key;
//         selctedValue = this.props.fetchListData[key]["value"];
//       }
//     });

//     if (typeFor !== "Assign a custom value" && typeFor !== "Assign a custom field") {
//       this.setState(
//         {
//           typeFor: "predefined",
//           val_user: selectedKey,
//           value_for_user: selctedValue, // test,
//           showCancelUser: true, // test
//           styleVal: "" // new test
//         },
//         this.onChange
//       );
//     } else if (typeFor === "Assign a custom value") {
//       this.setState(
//         {
//           typeFor: "-- custom value --",
//           val_user: "",
//           value_for_user: typeFor, // test
//           showCancelUser: true // test
//         },
//         this.onChange
//       );
//     } else if (typeFor === "Assign a custom field") {
//       this.setState(
//         {
//           typeFor: "-- custom field --",
//           val_user: "",
//           value_for_user: typeFor, // test
//           showCancelUser: true // test
//         },
//         this.onChange
//       );
//     }
//   }; // newly updated


//   onDeleteUserField = () => {
//     this.props.onMappingDelete(this.props.lineId);
//   }; // test

//   clearValue = iden => {
//     if (iden === "value_for_user") {
//       this.setState({ value_for_user: "", val_user: "", typeFor: "", showCancelUser: false }, this.onChange);
//       // this.setFocus.focus();
//     } else if(iden === "predefinedValueForUser") {
//       this.setState({ predefinedValueForUser: "", user_value: "", user_type: "", showCancelForPredefinedUser: false }, this.onChange);
//       // this.setFocusPredefined.focus();
//     }
//   }; // newly added

//   handleChangeInputUser = event => {
//     let val_user = event.target.value;
//     this.setState({ val_user }, this.onChange);
//     if (val_user.trim() !== "") {
//       this.setState({ styleVal: "" }, this.onChange);
//     }
//   }; // newly added
 
//   validatedUserTypedWord = (event, decide) => {
//     let { fetchListData, listData } = this.props;
//     let enteredWord = event.target.value;
//     if (decide === "value_for_user") {
//       if (!this.isValuePresentInList(enteredWord, fetchListData, decide)) {
//         this.setState({ value_for_user: "", val_user: "", typeFor: "", showCancelUser: false }, this.onChange);
//       }
//     } else if (decide === "predefinedValueForUser") {
//       if (!this.isValuePresentInList(enteredWord, listData, decide)) {
//         this.setState({ predefinedValueForUser: "", user_value: "", user_type: "", showCancelForPredefinedUser: false }, this.onChange);
//       }
//     }
    
//   }; // newly added

//   isValuePresentInList = (word, fetchListData, decide) => {
//     let isPresent = false;
//     if (decide === "value_for_user") {
//       Object.keys(fetchListData).forEach(key => {
//         if (fetchListData[key]["name"] === word || word === "-- custom value --" || word === "-- custom field --") {
//           isPresent = true;
//         }
//       });
//     } else if (decide === "predefinedValueForUser") {
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
//     let { listData, fetchListData, predefinedValueForUser } = this.state;

//     let defaultList = this.renderData(listData); // new

//     let fetchedList = this.renderDynamicData(fetchListData); // new

//     return (
//         // <div className="contextdropdown-sec3">
//         // <div className="mapgroup-sec2">
//         <div className="whole_grid2">
//           <div id="userId">
//             <div className={"width-100" + this.state.stylePre}>
//               <SelectSearch
//                 key={this.props.valTo}
//                 value={predefinedValueForUser}
//                 options={defaultList}
//                 onChange={this.handleTypeChangeUser}
//                 renderOption={renderFriend}
//                 placeholder={this.props.name}
//                 search
//                 fuse={fuse}
//                 // style={this.props.style}
//               />
//             </div>
//             {this.state.showCancelForPredefinedUser ? (
//                 <span 
//                   className="searchbox__closebtn" 
//                   onClick={() => this.clearValue("predefinedValueForUser")}>
//                 &times;
//                 </span>
//             ) : null}
//           </div>  

//           {this.state.user_type === "-- custom field --" ? (
//             <div>
//               <input
//                 type="text"
//                 value={this.state.user_value}
//                 className={"contextdropdown__input-text_1" + this.state.stylePre}
//                 onChange={this.handleValueChangeUser}
//                 placeholder="enter a field name..."
//               />
//             </div>
//           ) : null}

//           <div id="userId">
//               <div className={"width-100" + this.state.styleVal}>
//                 <SelectSearch
//                   key={this.props.keyTo}
//                   value={this.state.value_for_user}
//                   fuse={fuse}
//                   options={fetchedList}
//                   onChange={this.handleValueFieldChangeUser}
//                   renderOption={renderFriend}
//                   placeholder="Select value"
//                   search
//                   // style={this.props.style}
//                 />    
//               </div>
//             {this.state.showCancelUser ? (
//                 <span 
//                   className="searchbox__closebtn" 
//                   onClick={() => this.clearValue("value_for_user")}>
//                 &times;
//                 </span>
//             ) : null}
//           </div>

//           {this.state.typeFor === "-- custom value --" || this.state.typeFor === "-- custom field --"
//             ? 
//               <div id="check">
//                 <input
//                   type="text"
//                   className={"contextdropdown__input-text_1" + this.state.styleVal}
//                   onChange={this.handleChangeInputUser}
//                   value={this.state.val_user}
//                   placeholder={this.state.typeFor === "-- custom value --" ? "enter a value..." : "enter a field..."}
//                 />
//               </div>
//             : null  
//           }

//           <div className="fieldmapper-remove_1">
//             <button
//               onClick={this.onDeleteUserField}
//               type="button"
//               className="field-mapper__remove-btn margin-top-0"
//             >
//               <img
//                 src={require("../../assets/icons/minus.svg")}
//                 alt="minus-img"
//                 id="field-mapper__remove-img"
//               />
//             </button>
//           </div>
//         </div>
//     );
//   }
// }

// SimpleSearchUser.propTypes = {
//   dropdownName: PropTypes.string,
//   name: PropTypes.string,
//   className: PropTypes.string.isRequired,
//   onChange: PropTypes.func
// };

// export default SimpleSearchUser;

