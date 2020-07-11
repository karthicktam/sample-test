import React from "react";
import "./_dropDownMenu.scss";
import PropTypes from "prop-types";
import _ from "lodash";

class DropDownMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropDown: false,
      uniqueId: _.uniqueId("DropDown_")
    };
  }
  componentDidMount() {
    window.addEventListener("click", this.closeDropDown, {});
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.closeDropDown, {});
  }
  showDropDown = () => {
    if (this.state.showDropDown === true) {
      this.setState({ showDropDown: false });
    } else if (
      this.state.showDropDown === true &&
      window.addEventListener("click", this.closeDropDown)
    ) {
      this.setState({ showDropDown: false });
    } else {
      this.setState({ showDropDown: true });
    }
  };
  closeDropDown = event => {
    if (!event.target.matches("#tableDropDown" + this.state.uniqueId)) {
      this.setState({ showDropDown: false });
    }
  };

  onOptionClick = optionCallBack => {
    optionCallBack(this.props.data);
  };

  render() {
    let { options, DropdownInlineStyles } = this.props;
    let { uniqueId } = this.state;
    if (options != null || undefined) {
      if (options.length > 0) {
        return (
          <div className="table-drop-down">
            <img
              src={require("../../assets/icons/cl-user-threedot.svg")}
              alt="option"
              className="table-drop-down__three-dot"
              style={DropdownInlineStyles}
              onClick={this.showDropDown}
              id={"tableDropDown" + uniqueId}
            />
            {this.state.showDropDown ? (
              <div className="table-drop-down__content">
                <ul>
                  {options.map(option => (
                    <li
                      key={option.id}
                      onClick={e => this.onOptionClick(option.onClick)}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        );
      } else return null;
    } else return null;
  }
}

DropDownMenu.propTypes = {
  data: PropTypes.any,
  DropdownInlineStyles: PropTypes.object,
  options: PropTypes.array
};

export default DropDownMenu;
