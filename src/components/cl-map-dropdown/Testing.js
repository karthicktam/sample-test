import React from "react";
import "./_simpleSearchDropDown.scss";
import PropTypes from "prop-types";
import _ from "lodash";

// newly added from here
import "./_search.scss";
import SelectSearch from "react-select-search";
import { renderFriend, fuse } from "./searchHelpers";

class Testing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: this.props.listData[this.props.value] || "",
      showCancel: false,
      listData: this.renderOptions(this.props.listData) // process
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const sameProps = _.isEqual(prevProps, this.props);
    if (!sameProps) {
      this.setState({
        selectedValue: this.props.listData[this.props.value],
      });
    }
    if (!prevState.showCancel) {
      const isEmpty = _.isEmpty(this.state.selectedValue);
      if (!isEmpty) {
        this.setState({ showCancel: true });
      }
    }
  }

  componentDidMount() {
    let opt = [];
    opt = this.renderOptions(this.props.listData); // process

    this.setState({
      listData: opt
    }); // process

    this.setState((prevState) => ({
      selectedValue: prevState.selectedValue,
    }));

    if (this.state.selectedValue !== "") {
      this.setState({ showCancel: true });
    }
  }

  clearValue = () => {
    this.setState({ selectedValue: "", showCancel: false });
    this.props.onChange("");
    // this.setFocus.focus();
  };

  handleChange = value => {
    console.log("valuennsndkffj", value);
    let selectedKey;
    Object.keys(this.props.listData).forEach(key => {
        if (this.props.listData[key] === value["value"]) {
          selectedKey = key;
        } 
    });
    if (value["value"] === "") {
      this.clearValue();
    } else {
      this.setState({
        selectedValue: this.props.listData[selectedKey],
        showCancel: true,
      });
      this.props.onChange(selectedKey);
    }
  };


  validatedUserTypedWord = event => {
    let { listData } = this.props;
    let enteredWord = event.target.value;
    if (!this.isValuePresentInList(enteredWord, listData)) {
    }
  };

  isValuePresentInList = (word, listData) => {
    let isPresent = false;
    Object.keys(listData).forEach(key => {
      if (listData[key] === word) {
        isPresent = true;
      }
    });
    return isPresent;
  };
  renderOptions = listData => {
    let options = [];
    // Object.keys(listData).forEach(key => {
    //   options.push(
    //     <option
    //       key={key}
    //       value={listData[key]}
    //       className="select-boxSearch--options"
    //     >{listData[key]}</option>
    //   );
    // });

    Object.keys(listData).forEach(key => {
      options.push(
        {name: key, value: key, show: listData[key]}
      );
    });

    return options;
  };

  render() {
    let { listData } = this.props;

    // let opt = [];
    // opt = this.renderOptions(listData);

    return (
        <div id="center" className="contextdropdown-sec3">
            <SelectSearch
              key="testing"
              value={this.state.selectedValue}
              fuse={fuse}
              // options={opt}
              options={this.state.listData}
              onChange={this.handleChange}
              renderOption={renderFriend}
              placeholder={this.props.name}
              search
              style={this.props.style}
            />
        </div>
    );
  }
}

Testing.propTypes = {
  listData: PropTypes.object.isRequired,
  name: PropTypes.string,
  className: PropTypes.string.isRequired,
  style: PropTypes.object
};

export default Testing;








// import React from "react";
// import "./_simpleSearchDropDown.scss";
// import PropTypes from "prop-types";
// import _ from "lodash";

// class Testing extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       selectedValue: this.props.listData[this.props.value] || "",
//       showCancel: false,
//     };
//   }

//   componentDidUpdate(prevProps, prevState) {
//     const sameProps = _.isEqual(prevProps, this.props);
//     if (!sameProps) {
//       this.setState({
//         selectedValue: this.props.listData[this.props.value],
//       });
//     }
//     if (!prevState.showCancel) {
//       const isEmpty = _.isEmpty(this.state.selectedValue);
//       if (!isEmpty) {
//         this.setState({ showCancel: true });
//       }
//     }
//   }

//   componentDidMount() {
//     this.setState((prevState) => ({
//       selectedValue: prevState.selectedValue,
//     }));

//     if (this.state.selectedValue !== "") {
//       this.setState({ showCancel: true });
//     }
//   }

//   clearValue = () => {
//     this.setState({ selectedValue: "", showCancel: false });
//     this.props.onChange("");
//     // this.setFocus.focus();
//   };
//   handleChange = event => {
//     let selectedKey;
//     Object.keys(this.props.listData).forEach(key => {
//         if (this.props.listData[key] === event.target.value) {
//           selectedKey = key;
//         } 
//     });
//     if (event.target.value === "") {
//       this.clearValue();
//     } else {
//       this.setState({
//         selectedValue: this.props.listData[selectedKey],
//         showCancel: true,
//       });
//       this.props.onChange(selectedKey);
//     }
//   };


//   validatedUserTypedWord = event => {
//     let { listData } = this.props;
//     let enteredWord = event.target.value;
//     if (!this.isValuePresentInList(enteredWord, listData)) {
//     }
//   };

//   isValuePresentInList = (word, listData) => {
//     let isPresent = false;
//     Object.keys(listData).forEach(key => {
//       if (listData[key] === word) {
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
//           value={listData[key]}
//           className="select-boxSearch--options"
//         >{listData[key]}</option>
//       );
//     });
//     return options;
//   };

//   render() {
//     let { listData } = this.props;
//     return (
//         <div id="center" className="contextdropdown-sec3">
//             <select
//               className={this.props.className}
//               // onBlur={this.validatedUserTypedWord}
//               placeholder={this.props.name}
//               value={this.state.selectedValue}
//               onChange={this.handleChange}
//               style={this.props.style}
//               required
//             >
//               <option value="" disabled={false}>
//                 {this.props.name}
//               </option>
//               {this.renderOptions(listData)}
//             </select>
//         </div>
//     );
//   }
// }

// Testing.propTypes = {
//   listData: PropTypes.object.isRequired,
//   name: PropTypes.string,
//   className: PropTypes.string.isRequired,
//   style: PropTypes.object
// };

// export default Testing;
