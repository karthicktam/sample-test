import React from "react";
import "./_verticalDropDownMenu.scss";
import PropTypes from "prop-types";

class VerticalDropDownMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVerticalDropDown: false
    };
  }

  componentDidMount() {
    window.addEventListener("click", this.closeDropDown, {});
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.closeDropDown, {});
  }

  dropDown = () => {
    this.setState({
      showVerticalDropDown: !this.state.showVerticalDropDown
    });
  };

  closeDropDown = event => {
    if (!event.target.matches(".drop-down__icon")) {
      this.setState({
        showVerticalDropDown: false
      });
    }
  };

  onOptionClick = optionCallBack => {
    optionCallBack(this.props.data);
  };

  render() {
    let { options } = this.props;
    if (options != null || undefined) {
      if (options.length > 0) {
        return (
          <div className="drop-down">
            <button
              type="button"
              className="drop-down__icon"
              onClick={this.dropDown}
            ></button>
            {this.state.showVerticalDropDown ? (
              <div
                id="mydropdown"
                className="drop-down__content"
                style={{ display: "block" }}
              >
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
VerticalDropDownMenu.propTypes = {
  data: PropTypes.any,
  options: PropTypes.array
};

export default VerticalDropDownMenu;
