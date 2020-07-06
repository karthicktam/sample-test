import React from "react";
import "./_mapDropDown.scss";
import PropTypes from "prop-types";
import _ from "lodash";

// newly added from here
import "./_search.scss";
import SelectSearch from "react-select-search";
import { renderFriendNew, fuse } from "./searchHelpers";

class ContextDropDown extends React.Component {
  constructor(props) {
    super(props);
    let stateObj = this.populateInitialState(this.props);
    this.state = {
      ...stateObj
    };
  }

  populateInitialState = props => {
    let predefinedValue = "",
      choosenValue = "", // new
      type,
      value;
    if (props.dropDown !== undefined) {
      type = props.dropDown.type;
      value = props.dropDown.reference;
      if (type === "predefined") {
        predefinedValue = value;
      } else if (type === "custom event") {
        predefinedValue = type;
      } else if (type === "dynamic event") {
        predefinedValue = type;
      } else if (type === "create or update group") {
        predefinedValue = type;
      } else if (type === "create or update user") {
        predefinedValue = type;
      } else if (type === "assign group to user") {
        predefinedValue = type;
      }

      if (type === "dynamic event" && typeof props.dynamicListData[value] === "object") {
        choosenValue = props.dynamicListData[value]["name"];
      } // newly added
    }

    let stateObj = {
      listData: this.renderEvents(props.listData),
      dynamicListData: this.renderOptions(props.dynamicListData),
      type: type,
      value: value,
      predefinedValue: predefinedValue,
      stylePre: "", // newly added
      choosenValue: choosenValue, // new
      showCancelPredefined: false, // new
      showCancelForChoosenValue: false, // new
    };
    return stateObj;
  };

  componentDidUpdate(prevProps) {
    const sameProps = _.isEqual(prevProps, this.props);
    if (!sameProps) {

      let { dropDown } = this.props;

      if (dropDown && dropDown.isValid === false) {
        this.setState({ 
          stylePre: " error_border",
        });
      }
    }
  }

  componentDidMount() {

    let { dropDown } = this.props;

    if (dropDown.type === "predefined") {
        this.props.fetchingEventOptions(
        this.props.serviceId,
        this.props.match.params.source_id,
        dropDown.reference
      );
    } else if (dropDown.type !== "") {
      this.props.fetchingEventOptions(
        this.props.serviceId,
        this.props.match.params.source_id,
        dropDown.reference
      );  
    } // process

    let dynamicData = this.renderOptions(this.props.dynamicListData);

    let list = this.renderEvents(this.props.listData);

    console.log("dynamicData", dynamicData, "list", list);

    this.setState({
      dynamicListData: dynamicData,
      listData: list
    }); // process

    if (dropDown && dropDown.isValid === false) {
      this.setState({ 
         predefinedValue: "",
         choosenValue: "",
         type: "",
         value: "",
         stylePre: " error_border",
         showCancelForChoosenValue: false,
         showCancelPredefined: false
      }, this.onChange);
    }

    if (this.state.choosenValue !== "") {
      this.setState({ showCancelForChoosenValue: true });
    } else {
      this.setState({ showCancelForChoosenValue: false });
    }// new

    if (this.state.predefinedValue !== "") {
      this.setState({ showCancelPredefined: true });
    } else {
      this.setState({ showCancelPredefined: false });
    }// new
  } // newly added

  onChange = () => {
    let { type, value } = this.state;

    if (value === undefined) {
      value = ""
    }
    
    let state = { type, reference: value };
    this.props.onChange(state);
  };

  renderOptions = (list) => {
    let options = [];

    // Object.keys(list).forEach(key => {
    //   options.push(
    //     <option key={key} value={typeof list[key] === "object" ? list[key]["name"] : list[key]}>
    //       {typeof list[key] === "object" ? list[key]["value"] : list[key]}
    //     </option>
    //   );
    // });

    Object.keys(list).forEach(key => {
      options.push(
        {name: list[key]["name"], value: list[key]["name"], show: list[key]["value"]}
      );
    });
    return options;
  };

  renderEvents = eList => {
    let options = [{type: 'group', name: "Predefined Events", items: []}];
    Object.keys(eList).forEach(key => {
      options[0].items.push(
        {name: key, value: key, show: eList[key]}
      );
    });

    options.push(
      {type: 'group', name: "New Events", items: [
          {name: "custom event", value: "custom event", show: "Create a custom event"},
          {name: "dynamic event", value: "dynamic event", show: "Create a dynamic event"}
        ]
      },
      {type: 'group', name: "Others", items: [
          {name: "create or update group", value: "create or update group", show: "Create or update a account record"},
          {name: "create or update user", value: "create or update user", show: "Create or update a user record"},
          {name: "assign group to user", value: "assign group to user", show: "Assign account to user"}
        ]
      }
    );

    return options; 
  }; // process

  handleTypeChange = value => {
    let type = value && value["value"];

    if (type !== "dynamic event" && 
        type !== "custom event" && 
        type !== "create or update group" && 
        type !== "create or update user" && 
        type !== "assign group to user") {
      this.setState(
        {
          type: "predefined",
          value: type,
          predefinedValue: type, // new
          showCancelPredefined: true, // new
          stylePre: "" // newly added
        },
        this.onChange
      );
    } else if (type === "create or update group") {
      this.setState(
        {
          type: "create or update group",
          value: type,
          choosenValue: "", // new
          predefinedValue: type, // new
          showCancelPredefined: true, // new
          // showCancelForChoosenValue: false, // new
        },
        this.onChange
      );
    } else if (type === "create or update user") {
      this.setState(
        {
          type: "create or update user",
          value: type,
          choosenValue: "", // new
          predefinedValue: type, // new
          showCancelPredefined: true, // new
          // showCancelForChoosenValue: false, // new
        },
        this.onChange
      );
    } else if (type === "custom event") {
      this.setState(
        {
          type: "custom event",
          value: "",
          choosenValue: "", // new
          predefinedValue: type, // new
          showCancelPredefined: true, // new
          // showCancelForChoosenValue: false, // new
        },
        this.onChange
      );
    } else if (type === "dynamic event") {
      this.setState(
        {
          type: "dynamic event",
          value: "",
          choosenValue: "", // new
          predefinedValue: type, // new
          showCancelPredefined: true, // new
          // showCancelForChoosenValue: false, // new
        },
        this.onChange
      );
    } else if (type === "assign group to user") {
      this.setState(
        {
          type: "assign group to user",
          value: type,
          choosenValue: "", // new
          predefinedValue: type, // new
          showCancelPredefined: true, // new
        },
        this.onChange
      );
    }

    this.props.fetchingEventOptions(
      this.props.serviceId,
      this.props.match.params.source_id,
      type
    ); // process
  }; 

  handleValueChange = event => {
    let value = event.target.value;
    this.setState({ value }, this.onChange);
    if (value.trim() !== "") {
      this.setState({ stylePre: "" }, this.onChange);
    } // newly added
  };

  handleValueChangeDynamic = value => {
    let selectedKey;
    let selectedValue;
    let choosenValue = value && value["value"];

    Object.keys(this.props.dynamicListData).forEach(key => {
      if(typeof this.props.dynamicListData[key] === "object") {
        if (this.props.dynamicListData[key]["name"] === choosenValue) {
          selectedKey = key;
          selectedValue = this.props.dynamicListData[key]["name"];
        }
      }
    });

    this.setState(
      {
        value: selectedKey,
        choosenValue: selectedValue, // test,
        showCancelForChoosenValue: true, // test
        stylePre: "" // new test
      },
      this.onChange
    );
  };
  
  
  clearValue = idMinus => {
    console.log("idMinus", idMinus);
    if (idMinus === "choosenValue") {
      this.setState({ choosenValue: "", value: "", showCancelForChoosenValue: false }, this.onChange);
      // this.setFocusDynamic.focus();
    } else if(idMinus === "predefinedVal") {
      this.setState({ predefinedValue: "", type: "", value: "", showCancelPredefined: false }, this.onChange);
      // this.setFocusContext.focus();
    }
  }; // newly added


  validatedUserTypedWord = (event, decide) => {
    let { dynamicListData, listData } = this.props;
    let enteredWord = event.target.value;
    if (decide === "choosenValue") {
      if (!this.isValuePresentInList(enteredWord, dynamicListData, decide)) {
        this.setState({ choosenValue: "", value: "", showCancelForChoosenValue: false }, this.onChange);
      }
    } else if (decide === "predefinedVal") {
      if (!this.isValuePresentInList(enteredWord, listData, decide)) {
        this.setState({ predefinedValue: "", type: "", value: "", showCancelPredefined: false }, this.onChange);
      }
    }
    
  }; // newly added

  isValuePresentInList = (word, list, decide) => {
    let isPresent = false;
    if (decide === "choosenValue") {
      Object.keys(list).forEach(key => {
        if (list[key]["name"] === word) {
          isPresent = true;
        }
      });
    } else if (decide === "predefinedVal") {
      Object.keys(list).forEach(key => {
        if (list[key] === word || word === "custom event" || word === "dynamic event" || word === "create or update group" || word === "create or update user") {
          isPresent = true;
        }
      });
    }
    
    return isPresent;
  }; // newly added

  styleHandler(value) {
    return value;
  }

  render() {
    let { listData, dynamicListData, predefinedValue } = this.state;

    console.log("listDatalistData", listData);
    // let dynamicData = this.renderOptions(dynamicListData); // new
    // let classname = this.state.stylePre === " error_border" ? "select-search-box__search__error_border" : "select-search-box";
    // console.log(classname, "className", this.state.stylePre);

    return (
      <div>
        <div className="contextdropdown-sec3">
          <div id="context">
            <div className={"width-100" + this.state.stylePre}>
              <SelectSearch
                key="events"
                value={predefinedValue}
                fuse={fuse}
                options={listData}
                onChange={this.handleTypeChange}
                renderOption={renderFriendNew}
                placeholder={this.props.name}
                search
              />
              {this.state.showCancelPredefined ? (
                <span 
                  className="searchbox__closebtn_2" 
                  onClick={() => this.clearValue("predefinedVal")}>
                &times;
                </span>
            ) : null}
            </div>
          </div> 

          {this.state.type === "custom event" ? (
            <div id="input">
              <input
                type="text"
                value={this.state.value}
                className={"contextdropdown__input-text" + this.state.stylePre}
                onChange={this.handleValueChange}
                placeholder="enter name..."
              />
            </div>
          ) : this.state.type === "dynamic event" ? (
            <div id="context">
                <div className={"width-100" + this.state.stylePre}>
                  <SelectSearch
                    key="dynamic"
                    value={this.state.choosenValue}
                    fuse={fuse}
                    options={dynamicListData}
                    // options={this.state.dynamicData}
                    onChange={this.handleValueChangeDynamic}
                    renderOption={renderFriendNew}
                    placeholder="Choose value"
                    search
                  />
                </div>
              {this.state.showCancelForChoosenValue ? (
                  <span 
                    className="searchbox__dropstyle1" 
                    onClick={() => this.clearValue("choosenValue")}>
                  &times;
                  </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

ContextDropDown.propTypes = {
  dropdownName: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

export default ContextDropDown;
















// import React, { useMemo, useEffect } from "react";
// import "./_mapDropDown.scss";
// import PropTypes from "prop-types";
// import _ from "lodash";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// // newly added from here
// import "./_search.scss";
// import SelectSearch from "react-select-search";
// import { renderFriend, fuse } from "./searchHelpers";

// class ContextDropDown extends React.Component {
//   constructor(props) {
//     super(props);
//     let stateObj = this.populateInitialState(this.props);
//     this.state = {
//       ...stateObj
//     };
//   }

//   populateInitialState = props => {
//     let predefinedValue = "",
//       choosenValue = "", // new
//       type,
//       value;
//     if (props.dropDown !== undefined) {
//       type = props.dropDown.type;
//       value = props.dropDown.value;
//       if (type === "predefined") {
//         predefinedValue = value;
//       } else if (type === "custom event") {
//         predefinedValue = "Create a custom event";
//       } else if (type === "dynamic event") {
//         predefinedValue = "Create a dynamic event";
//       } else if (type === "create or update group") {
//         predefinedValue = "Create or update a group record";
//       } else if (type === "create or update user") {
//         predefinedValue = "Create or update a user record";
//       } else if (type === "assign group to user") {
//         predefinedValue = "Assign group to user";
//       }

//       if (type === "dynamic event" && typeof props.dynamicListData[value] === "object") {
//         choosenValue = props.dynamicListData[value]["value"];
//       } // newly added
//     }

//     let stateObj = {
//       listData: props.listData,
//       dynamicListData: props.dynamicListData,
//       type: type,
//       value: value,
//       predefinedValue: predefinedValue,
//       stylePre: "", // newly added
//       choosenValue: choosenValue, // new
//       showCancelPredefined: false, // new
//       showCancelForChoosenValue: false // new
//     };
//     return stateObj;
//   };

//   componentDidUpdate(prevProps) {
//     const sameProps = _.isEqual(prevProps, this.props);
//     if (!sameProps) {

//       let { dropDown } = this.props;

//       if (dropDown && dropDown.isValid === false) {
//         this.setState({ 
//           stylePre: " error_border",
//         });
//       }
//     }
//   }

//   componentDidMount() {
//     let { dropDown } = this.props;

//     if (dropDown && dropDown.isValid === false) {
//       this.setState({ 
//          predefinedValue: "",
//          choosenValue: "",
//          type: "",
//          value: "",
//          stylePre: " error_border",
//          showCancelForChoosenValue: false,
//          showCancelPredefined: false
//       }, this.onChange);
//     }

//     if (this.state.choosenValue !== "") {
//       this.setState({ showCancelForChoosenValue: true });
//     } else {
//       this.setState({ showCancelForChoosenValue: false });
//     }// new

//     if (this.state.predefinedValue !== "") {
//       this.setState({ showCancelPredefined: true });
//     } else {
//       this.setState({ showCancelPredefined: false });
//     }// new
//   } // newly added

//   onChange = () => {
//     let { type, value } = this.state;

//     if (value === undefined) {
//       value = ""
//     }
    
//     let state = { type, value };
//     this.props.onChange(state);
//   };

//   renderOptions = (list) => {
//     let options = [];

//     // Object.keys(list).forEach(key => {
//     //   options.push(
//     //     <option key={key} value={typeof list[key] === "object" ? list[key]["name"] : list[key]}>
//     //       {typeof list[key] === "object" ? list[key]["value"] : list[key]}
//     //     </option>
//     //   );
//     // });

//     Object.keys(list).forEach(key => {
//       options.push(
//         {name: list[key]["name"], value: list[key]["value"]}
//       );
//     });
//     return options;
//   };

//   handleTypeChange = value => {
//     let type = value && value["value"];
    
//     if (type !== "Create a dynamic event" && 
//         type !== "Create a custom event" && 
//         type !== "Create or update a group record" && 
//         type !== "Create or update a user record" && 
//         type !== "Assign group to user") {
//       this.setState(
//         {
//           type: "predefined",
//           value: type,
//           predefinedValue: type, // new
//           showCancelPredefined: true, // new
//           stylePre: "" // newly added
//         },
//         this.onChange
//       );
//     } else if (type === "Create or update a group record") {
//       this.setState(
//         {
//           type: "create or update group",
//           value: type,
//           choosenValue: "", // new
//           predefinedValue: type, // new
//           showCancelPredefined: true, // new
//           // showCancelForChoosenValue: false, // new
//         },
//         this.onChange
//       );
//     } else if (type === "Create or update a user record") {
//       this.setState(
//         {
//           type: "create or update user",
//           value: type,
//           choosenValue: "", // new
//           predefinedValue: type, // new
//           showCancelPredefined: true, // new
//           // showCancelForChoosenValue: false, // new
//         },
//         this.onChange
//       );
//     } else if (type === "Create a custom event") {
//       this.setState(
//         {
//           type: "custom event",
//           value: "",
//           choosenValue: "", // new
//           predefinedValue: type, // new
//           showCancelPredefined: true, // new
//           // showCancelForChoosenValue: false, // new
//         },
//         this.onChange
//       );
//     } else if (type === "Create a dynamic event") {
//       this.setState(
//         {
//           type: "dynamic event",
//           value: "",
//           choosenValue: "", // new
//           predefinedValue: type, // new
//           showCancelPredefined: true, // new
//           // showCancelForChoosenValue: false, // new
//         },
//         this.onChange
//       );
//     } else if (type === "Assign group to user") {
//       this.setState(
//         {
//           type: "assign group to user",
//           value: type,
//           choosenValue: "", // new
//           predefinedValue: type, // new
//           showCancelPredefined: true, // new
//         },
//         this.onChange
//       );
//     }
//   }; 

//   handleValueChange = event => {
//     let value = event.target.value;
//     this.setState({ value }, this.onChange);
//     if (value.trim() !== "") {
//       this.setState({ stylePre: "" }, this.onChange);
//     } // newly added
//   };

//   handleValueChangeDynamic = value => {
//     let selectedKey;
//     let selectedValue;
//     let choosenValue = value && value["value"];

//     Object.keys(this.props.dynamicListData).forEach(key => {
//       if(typeof this.props.dynamicListData[key] === "object") {
//         if (this.props.dynamicListData[key]["value"] === choosenValue) {
//           selectedKey = key;
//           selectedValue = this.props.dynamicListData[key]["value"];
//         }
//       }
//     });

//     this.setState(
//       {
//         value: selectedKey,
//         choosenValue: selectedValue, // test,
//         showCancelForChoosenValue: true, // test
//         stylePre: "" // new test
//       },
//       this.onChange
//     );
//   };
  
  
//   clearValue = idMinus => {
//     console.log("idMinus", idMinus);
//     if (idMinus === "choosenValue") {
//       this.setState({ choosenValue: "", value: "", showCancelForChoosenValue: false }, this.onChange);
//       // this.setFocusDynamic.focus();
//     } else if(idMinus === "predefinedVal") {
//       this.setState({ predefinedValue: "", type: "", value: "", showCancelPredefined: false }, this.onChange);
//       // this.setFocusContext.focus();
//     }
//   }; // newly added


//   validatedUserTypedWord = (event, decide) => {
//     let { dynamicListData, listData } = this.props;
//     let enteredWord = event.target.value;
//     if (decide === "choosenValue") {
//       if (!this.isValuePresentInList(enteredWord, dynamicListData, decide)) {
//         this.setState({ choosenValue: "", value: "", showCancelForChoosenValue: false }, this.onChange);
//       }
//     } else if (decide === "predefinedVal") {
//       if (!this.isValuePresentInList(enteredWord, listData, decide)) {
//         this.setState({ predefinedValue: "", type: "", value: "", showCancelPredefined: false }, this.onChange);
//       }
//     }
    
//   }; // newly added

//   isValuePresentInList = (word, list, decide) => {
//     let isPresent = false;
//     if (decide === "choosenValue") {
//       Object.keys(list).forEach(key => {
//         if (list[key]["name"] === word) {
//           isPresent = true;
//         }
//       });
//     } else if (decide === "predefinedVal") {
//       Object.keys(list).forEach(key => {
//         if (list[key] === word || word === "custom event" || word === "dynamic event" || word === "create or update group" || word === "create or update user") {
//           isPresent = true;
//         }
//       });
//     }
    
//     return isPresent;
//   }; // newly added

//   styleHandler(value) {
//     return value;
//   }

//   render() {
//     let { listData, dynamicListData, predefinedValue } = this.state;

//     console.log("listDatalistData", listData);
//     let dynamicData = this.renderOptions(dynamicListData); // new
//     let classname = this.state.stylePre === " error_border" ? "select-search-box__search__error_border" : "select-search-box";
//     console.log(classname, "className", this.state.stylePre);

//     return (
//       <div>
//         <div className="contextdropdown-sec3">
//           <div id="context">
//             <div className={"width-100" + this.state.stylePre}>
//               <SelectSearch
//                 key="events"
//                 value={predefinedValue}
//                 fuse={fuse}
//                 options={listData}
//                 onChange={this.handleTypeChange}
//                 renderOption={renderFriend}
//                 placeholder={this.props.name}
//                 search
//               />
//               {this.state.showCancelPredefined ? (
//                 <span 
//                   className="searchbox__closebtn_2" 
//                   onClick={() => this.clearValue("predefinedVal")}>
//                 &times;
//                 </span>
//             ) : null}
//             </div>
//           </div> 

//           {this.state.type === "custom event" ? (
//             <div id="input">
//               <input
//                 type="text"
//                 value={this.state.value}
//                 className={"contextdropdown__input-text" + this.state.stylePre}
//                 onChange={this.handleValueChange}
//                 placeholder="enter name..."
//               />
//             </div>
//           ) : this.state.type === "dynamic event" ? (
//             <div id="context">
//                 <div className={"width-100" + this.state.stylePre}>
//                   <SelectSearch
//                     key="dynamic"
//                     value={this.state.choosenValue}
//                     fuse={fuse}
//                     options={dynamicData}
//                     onChange={this.handleValueChangeDynamic}
//                     renderOption={renderFriend}
//                     placeholder="Choose value"
//                     search
//                   />
//                 </div>
//               {this.state.showCancelForChoosenValue ? (
//                   <span 
//                     className="searchbox__dropstyle1" 
//                     onClick={() => this.clearValue("choosenValue")}>
//                   &times;
//                   </span>
//               ) : null}
//             </div>
//           ) : null}
//         </div>
//       </div>
//     );
//   }
// }

// ContextDropDown.propTypes = {
//   dropdownName: PropTypes.string,
//   name: PropTypes.string,
//   className: PropTypes.string.isRequired,
//   onChange: PropTypes.func
// };

// export default ContextDropDown;



















// import React, { useMemo, useEffect } from "react";
// import "./_mapDropDown.scss";
// import PropTypes from "prop-types";
// import _ from "lodash";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// // newly added from here
// import "./_search.scss";
// import SelectSearch from "react-select-search";
// import { renderFriend, fuse } from "./searchHelpers";

// class ContextDropDown extends React.Component {
//   constructor(props) {
//     super(props);
//     let stateObj = this.populateInitialState(this.props);
//     this.state = {
//       ...stateObj
//     };
//   }

//   populateInitialState = props => {
//     let predefinedValue = "",
//       choosenValue = "", // new
//       type,
//       value;
//     if (props.dropDown !== undefined) {
//       type = props.dropDown.type;
//       value = props.dropDown.value;
//       if (type === "predefined") {
//         predefinedValue = value;
//       } else if (type === "custom event") {
//         predefinedValue = "Create a custom event";
//       } else if (type === "dynamic event") {
//         predefinedValue = "Create a dynamic event";
//       } else if (type === "create or update group") {
//         predefinedValue = "Create or update a group record";
//       } else if (type === "create or update user") {
//         predefinedValue = "Create or update a user record";
//       }

//       if (type === "dynamic event" && typeof props.dynamicListData[value] === "object") {
//         choosenValue = props.dynamicListData[value]["value"];
//       } // newly added
//     }

//     let stateObj = {
//       listData: props.listData,
//       dynamicListData: props.dynamicListData,
//       type: type,
//       value: value,
//       predefinedValue: predefinedValue,
//       stylePre: "", // newly added
//       choosenValue: choosenValue, // new
//       showCancelPredefined: false, // new
//       showCancelForChoosenValue: false // new
//     };
//     return stateObj;
//   };

//   componentDidUpdate(prevProps) {
//     const sameProps = _.isEqual(prevProps, this.props);
//     if (!sameProps) {

//       let { dropDown } = this.props;

//       if (dropDown && dropDown.isValid === false) {
//         this.setState({ 
//           stylePre: " error_border",
//         });
//       }
//     }
//   }

//   componentDidMount() {
//     let { dropDown } = this.props;

//     if (dropDown && dropDown.isValid === false) {
//       this.setState({ 
//          predefinedValue: "",
//          choosenValue: "",
//          type: "",
//          value: "",
//          stylePre: " error_border",
//          showCancelForChoosenValue: false,
//          showCancelPredefined: false
//       }, this.onChange);
//     }

//     if (this.state.choosenValue !== "") {
//       this.setState({ showCancelForChoosenValue: true });
//     } else {
//       this.setState({ showCancelForChoosenValue: false });
//     }// new

//     if (this.state.predefinedValue !== "") {
//       this.setState({ showCancelPredefined: true });
//     } else {
//       this.setState({ showCancelPredefined: false });
//     }// new
//   } // newly added

//   onChange = () => {
//     let { type, value } = this.state;

//     if (value === undefined) {
//       value = ""
//     }
    
//     let state = { type, value };
//     this.props.onChange(state);
//   };

//   renderOptions = (list) => {
//     let options = [];

//     // Object.keys(list).forEach(key => {
//     //   options.push(
//     //     <option key={key} value={typeof list[key] === "object" ? list[key]["name"] : list[key]}>
//     //       {typeof list[key] === "object" ? list[key]["value"] : list[key]}
//     //     </option>
//     //   );
//     // });

//     Object.keys(list).forEach(key => {
//       options.push(
//         {name: list[key]["name"], value: list[key]["value"]}
//       );
//     });
//     return options;
//   };

//   handleTypeChange = value => {
//     let type = value && value["value"];
    
//     if (type !== "Create a dynamic event" && type !== "Create a custom event" && type !== "Create or update a group record" && type !== "Create or update a user record") {
//       this.setState(
//         {
//           type: "predefined",
//           value: type,
//           predefinedValue: type, // new
//           showCancelPredefined: true, // new
//           stylePre: "" // newly added
//         },
//         this.onChange
//       );
//     } else if (type === "Create or update a group record") {
//       this.setState(
//         {
//           type: "create or update group",
//           value: type,
//           choosenValue: "", // new
//           predefinedValue: type, // new
//           showCancelPredefined: true, // new
//           // showCancelForChoosenValue: false, // new
//         },
//         this.onChange
//       );
//     } else if (type === "Create or update a user record") {
//       this.setState(
//         {
//           type: "create or update user",
//           value: type,
//           choosenValue: "", // new
//           predefinedValue: type, // new
//           showCancelPredefined: true, // new
//           // showCancelForChoosenValue: false, // new
//         },
//         this.onChange
//       );
//     } else if (type === "Create a custom event") {
//       this.setState(
//         {
//           type: "custom event",
//           value: "",
//           choosenValue: "", // new
//           predefinedValue: type, // new
//           showCancelPredefined: true, // new
//           // showCancelForChoosenValue: false, // new
//         },
//         this.onChange
//       );
//     } else if (type === "Create a dynamic event") {
//       this.setState(
//         {
//           type: "dynamic event",
//           value: "",
//           choosenValue: "", // new
//           predefinedValue: type, // new
//           showCancelPredefined: true, // new
//           // showCancelForChoosenValue: false, // new
//         },
//         this.onChange
//       );
//     }
//   };

//   handleValueChange = event => {
//     let value = event.target.value;
//     this.setState({ value }, this.onChange);
//     if (value.trim() !== "") {
//       this.setState({ stylePre: "" }, this.onChange);
//     } // newly added
//   };

//   handleValueChangeDynamic = value => {
//     let selectedKey;
//     let selectedValue;
//     let choosenValue = value && value["value"];

//     Object.keys(this.props.dynamicListData).forEach(key => {
//       if(typeof this.props.dynamicListData[key] === "object") {
//         if (this.props.dynamicListData[key]["value"] === choosenValue) {
//           selectedKey = key;
//           selectedValue = this.props.dynamicListData[key]["value"];
//         }
//       }
//     });

//     this.setState(
//       {
//         value: selectedKey,
//         choosenValue: selectedValue, // test,
//         showCancelForChoosenValue: true, // test
//         stylePre: "" // new test
//       },
//       this.onChange
//     );
//   };
  
  
//   clearValue = idMinus => {
//     console.log("idMinus", idMinus);
//     if (idMinus === "choosenValue") {
//       this.setState({ choosenValue: "", value: "", showCancelForChoosenValue: false }, this.onChange);
//       // this.setFocusDynamic.focus();
//     } else if(idMinus === "predefinedVal") {
//       this.setState({ predefinedValue: "", type: "", value: "", showCancelPredefined: false }, this.onChange);
//       // this.setFocusContext.focus();
//     }
//   }; // newly added


//   validatedUserTypedWord = (event, decide) => {
//     let { dynamicListData, listData } = this.props;
//     let enteredWord = event.target.value;
//     if (decide === "choosenValue") {
//       if (!this.isValuePresentInList(enteredWord, dynamicListData, decide)) {
//         this.setState({ choosenValue: "", value: "", showCancelForChoosenValue: false }, this.onChange);
//       }
//     } else if (decide === "predefinedVal") {
//       if (!this.isValuePresentInList(enteredWord, listData, decide)) {
//         this.setState({ predefinedValue: "", type: "", value: "", showCancelPredefined: false }, this.onChange);
//       }
//     }
    
//   }; // newly added

//   isValuePresentInList = (word, list, decide) => {
//     let isPresent = false;
//     if (decide === "choosenValue") {
//       Object.keys(list).forEach(key => {
//         if (list[key]["name"] === word) {
//           isPresent = true;
//         }
//       });
//     } else if (decide === "predefinedVal") {
//       Object.keys(list).forEach(key => {
//         if (list[key] === word || word === "custom event" || word === "dynamic event" || word === "create or update group" || word === "create or update user") {
//           isPresent = true;
//         }
//       });
//     }
    
//     return isPresent;
//   }; // newly added

//   styleHandler(value) {
//     return value;
//   }

//   render() {
//     let { listData, dynamicListData, predefinedValue } = this.state;

//     console.log("listDatalistData", listData);
//     let dynamicData = this.renderOptions(dynamicListData); // new
//     let classname = this.state.stylePre === " error_border" ? "select-search-box__search__error_border" : "select-search-box";
//     console.log(classname, "className", this.state.stylePre);

//     return (
//       <div>
//         <div className="contextdropdown-sec3">
//           <div id="context">
//             <div className={"width-100" + this.state.stylePre}>
//               <SelectSearch
//                 key="events"
//                 // onBlur={this.validatedUserTypedWord}
//                 // className={this.state.stylePre ? "select-search-box__search error_border" : "select-search-box"}
//                 value={predefinedValue}
//                 fuse={fuse}
//                 options={listData}
//                 onChange={this.handleTypeChange}
//                 renderOption={renderFriend}
//                 placeholder={this.props.name}
//                 search
//               />
//               {this.state.showCancelPredefined ? (
//                 <span 
//                   className="searchbox__closebtn_2" 
//                   onClick={() => this.clearValue("predefinedVal")}>
//                 &times;
//                 </span>
//             ) : null}
//             </div>
//           </div> 

//           {this.state.type === "custom event" ? (
//             <div id="input">
//               <input
//                 type="text"
//                 value={this.state.value}
//                 className={"contextdropdown__input-text" + this.state.stylePre}
//                 onChange={this.handleValueChange}
//                 placeholder="enter name..."
//               />
//             </div>
//           ) : this.state.type === "dynamic event" ? (
//             <div id="context">
//                 <div className={"width-100" + this.state.stylePre}>
//                   <SelectSearch
//                     key="dynamic"
//                     value={this.state.choosenValue}
//                     fuse={fuse}
//                     options={dynamicData}
//                     onChange={this.handleValueChangeDynamic}
//                     renderOption={renderFriend}
//                     placeholder="Choose value"
//                     search
//                   />
//                 </div>
//               {this.state.showCancelForChoosenValue ? (
//                   <span 
//                     className="searchbox__dropstyle1" 
//                     onClick={() => this.clearValue("choosenValue")}>
//                   &times;
//                   </span>
//               ) : null}
//             </div>
//           ) : null}
//         </div>
//       </div>
//     );
//   }
// }

// ContextDropDown.propTypes = {
//   dropdownName: PropTypes.string,
//   name: PropTypes.string,
//   className: PropTypes.string.isRequired,
//   onChange: PropTypes.func
// };

// export default ContextDropDown;


















// import React from "react";
// import "./_mapDropDown.scss";
// import PropTypes from "prop-types";
// import _ from "lodash";

// class ContextDropDown extends React.Component {
//   constructor(props) {
//     super(props);
//     let stateObj = this.populateInitialState(this.props);
//     this.state = {
//       ...stateObj
//     };
//   }

//   populateInitialState = props => {
//     let predefinedValue = "",
//       choosenValue = "", // new
//       type,
//       value;
//     if (props.dropDown !== undefined) {
//       type = props.dropDown.type;
//       value = props.dropDown.value;
//       if (type === "predefined") {
//         predefinedValue = value;
//       } else {
//         predefinedValue = type;
//       }

//       if (type === "dynamic event" && typeof props.dynamicListData[value] === "object") {
//         choosenValue = props.dynamicListData[value]["name"];
//       } // newly added
//     }

//     let stateObj = {
//       listData: props.listData,
//       dynamicListData: props.dynamicListData,
//       type: type,
//       value: value,
//       predefinedValue: predefinedValue,
//       stylePre: "", // newly added
//       choosenValue: choosenValue, // new
//       showCancelPredefined: false, // new
//       showCancelForChoosenValue: false // new
//     };
//     return stateObj;
//   };

//   componentDidUpdate(prevProps) {
//     const sameProps = _.isEqual(prevProps, this.props);
//     if (!sameProps) {

//       let { dropDown } = this.props;

//       if (dropDown && dropDown.isValid === false) {
//         this.setState({ 
//           stylePre: " error_border",
//         });
//       }
//     }
//   }

//   componentDidMount() {
//     let { dropDown } = this.props;

//     if (dropDown && dropDown.isValid === false) {
//       this.setState({ 
//          predefinedValue: "",
//          choosenValue: "",
//          type: "",
//          value: "",
//          stylePre: " error_border",
//          showCancelForChoosenValue: false,
//          showCancelPredefined: false
//       }, this.onChange);
//     }

//     if (this.state.choosenValue !== "") {
//       this.setState({ showCancelForChoosenValue: true });
//     } else {
//       this.setState({ showCancelForChoosenValue: false });
//     }// new

//     if (this.state.predefinedValue !== "") {
//       this.setState({ showCancelPredefined: true });
//     } else {
//       this.setState({ showCancelPredefined: false });
//     }// new
//   } // newly added

//   onChange = () => {
//     let { type, value } = this.state;

//     if (value === undefined) {
//       value = ""
//     }
    
//     let state = { type, value };
//     this.props.onChange(state);
//   };

//   renderOptions = (list) => {
//     let options = [];

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
//     let type = event.target.value;
//     if (type !== "dynamic event" && type !== "custom event" && type !== "create or update group" && type !== "create or update user") {
//       this.setState(
//         {
//           type: "predefined",
//           value: type,
//           predefinedValue: type, // new
//           showCancelPredefined: true, // new
//           stylePre: "" // newly added
//         },
//         this.onChange
//       );
//     } else if (type === "create or update group") {
//       this.setState(
//         {
//           type,
//           value: "Create or update a group record",
//           choosenValue: "", // new
//           predefinedValue: type, // new
//           showCancelPredefined: true, // new
//           showCancelForChoosenValue: false, // new
//         },
//         this.onChange
//       );
//     } else if (type === "create or update user") {
//       this.setState(
//         {
//           type,
//           value: "Create or update a user record",
//           choosenValue: "", // new
//           predefinedValue: type, // new
//           showCancelPredefined: true, // new
//           showCancelForChoosenValue: false, // new
//         },
//         this.onChange
//       );
//     } else {
//       this.setState(
//         {
//           type,
//           value: "",
//           choosenValue: "", // new
//           predefinedValue: type, // new
//           showCancelPredefined: true, // new
//           showCancelForChoosenValue: false, // new
//         },
//         this.onChange
//       );
//     }
//   };

//   handleValueChange = event => {
//     let value = event.target.value;
//     this.setState({ value }, this.onChange);
//     if (value.trim() !== "") {
//       this.setState({ stylePre: "" }, this.onChange);
//     } // newly added
//   };

//   handleValueChangeDynamic = event => {
//     let selectedKey;
//     let selectedValue;
//     let choosenValue = event.target.value;

//     Object.keys(this.props.dynamicListData).forEach(key => {
//       if(typeof this.props.dynamicListData[key] === "object") {
//         if (this.props.dynamicListData[key]["name"] === choosenValue) {
//           selectedKey = key;
//           selectedValue = this.props.dynamicListData[key]["name"];
//         }
//       }
//     });

//     this.setState(
//       {
//         value: selectedKey,
//         choosenValue: selectedValue, // test,
//         showCancelForChoosenValue: true, // test
//         stylePre: "" // new test
//       },
//       this.onChange
//     );
//   };
  
  
//   clearValue = idMinus => {
//     console.log("idMinus", idMinus);
//     if (idMinus === "choosenValue") {
//       this.setState({ choosenValue: "", value: "", showCancelForChoosenValue: false }, this.onChange);
//       this.setFocusDynamic.focus();
//     } else if(idMinus === "predefinedVal") {
//       this.setState({ predefinedValue: "", type: "", value: "", showCancelPredefined: false }, this.onChange);
//       this.setFocusContext.focus();
//     }
//   }; // newly added


//   validatedUserTypedWord = (event, decide) => {
//     let { dynamicListData, listData } = this.props;
//     let enteredWord = event.target.value;
//     if (decide === "choosenValue") {
//       if (!this.isValuePresentInList(enteredWord, dynamicListData, decide)) {
//         this.setState({ choosenValue: "", value: "", showCancelForChoosenValue: false }, this.onChange);
//       }
//     } else if (decide === "predefinedVal") {
//       if (!this.isValuePresentInList(enteredWord, listData, decide)) {
//         this.setState({ predefinedValue: "", type: "", value: "", showCancelPredefined: false }, this.onChange);
//       }
//     }
    
//   }; // newly added

//   isValuePresentInList = (word, list, decide) => {
//     let isPresent = false;
//     if (decide === "choosenValue") {
//       Object.keys(list).forEach(key => {
//         if (list[key]["name"] === word) {
//           isPresent = true;
//         }
//       });
//     } else if (decide === "predefinedVal") {
//       Object.keys(list).forEach(key => {
//         if (list[key] === word || word === "custom event" || word === "dynamic event" || word === "create or update group" || word === "create or update user") {
//           isPresent = true;
//         }
//       });
//     }
    
//     return isPresent;
//   }; // newly added


//   render() {
//     let { listData, dynamicListData, predefinedValue } = this.state;

//     return (
//       <div>
//         <div className="contextdropdown-sec3">
//           <div id="context">
//             <input
//               className={this.props.className + this.state.stylePre}
//               list={this.props.name}
//               onChange={this.handleTypeChange}
//               onBlur={(event) => this.validatedUserTypedWord(event, "predefinedVal")}
//               placeholder={this.props.name}
//               value={predefinedValue}
//               // style={this.props.style}
//               ref={input => {
//                 this.setFocusContext = input;
//               }}
//             ></input>
//             {this.state.showCancelPredefined ? (
//                 <button className="searchbox__closebtn" onClick={() => this.clearValue("predefinedVal")}>
//                 &times;
//                 </button>
//             ) : null}
//             <datalist id={this.props.name}>
//                 <select className={this.props.className} required>
//                   {this.renderOptions(listData)}
//                   <option value="custom event">{"Create a custom event"}</option>
//                   <option value="dynamic event">{"Create a dynamic event"}</option>
//                   <option value="create or update group">{"Create or update a group record"}</option>
//                   <option value="create or update user">{"Create or update a user record"}</option>
//                 </select>
//             </datalist>
//           </div>

//           {this.state.type === "custom event" ? (
//             <div id="input">
//               <input
//                 type="text"
//                 value={this.state.value}
//                 className={"contextdropdown__input-text" + this.state.stylePre}
//                 onChange={this.handleValueChange}
//                 placeholder="enter a event name..."
//               />
//             </div>
//           ) : this.state.type === "dynamic event" ? (
//             <div id="context">
//               <input
//                   className={"boxshadow__selectbox withAngleDownArrow" + this.state.stylePre}
//                   list={this.props.iden}
//                   onChange={this.handleValueChangeDynamic}
//                   onBlur={(event) => this.validatedUserTypedWord(event, "choosenValue")}
//                   placeholder="select a event field"
//                   value={this.state.choosenValue} // updated
//                   // style={this.props.style}
//                   ref={input => {
//                     this.setFocusDynamic = input;
//                   }}
//               ></input>
//               {this.state.showCancelForChoosenValue ? (
//                   <button className="searchbox__closebtn" onClick={() => this.clearValue("choosenValue")}>
//                   &times;
//                   </button>
//               ) : null}
//               <datalist id={this.props.iden}>
//                 <select className={this.props.className} required>
//                   {this.renderOptions(dynamicListData)}
//                 </select>
//               </datalist>
//             </div>
//           ) : null}
//         </div>
//       </div>
//     );
//   }
// }

// ContextDropDown.propTypes = {
//   dropdownName: PropTypes.string,
//   name: PropTypes.string,
//   className: PropTypes.string.isRequired,
//   onChange: PropTypes.func
// };

// export default ContextDropDown;