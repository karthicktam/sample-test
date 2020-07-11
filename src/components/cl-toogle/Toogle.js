import React from "react";
import PropTypes from "prop-types";
import "./_toogle.scss";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

class Toogle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.data[this.props.fieldName],
      showLoader: false
    };
  }

  onChange = e => {
    if (this.props.showConfirmAlert) {
      const options = {
        title: this.props.confirmationTitle || "Are you sure you want to continue?",
        message:
          this.props.confirmationDescription || "",
        buttons: [
          {
            label: "Yes, Sure",
            onClick: () => {
              if (this.props.timeOut) {
                this.setState({ showLoader: true });
                let that = this;
                setTimeout(function() {
                  that.setState({ showLoader: false });
                }, this.props.timeOut);
              }
              this.props.callback(!this.state.checked, this.props.data);
            }
          },
          { label: "No, I changed my mind", onClick: () => {} }
        ],
        childrenElement: () => <div />,
        closeOnEscape: true,
        closeOnClickOutside: true,
        willUnmount: () => {},
        onClickOutside: () => {},
        onKeypressEscape: () => {}
      };
      confirmAlert(options);
    } else {
      this.setState({ checked: !this.state.checked });
      this.props.callback(this.state.checked);
    }
  };

  render() {
    return (
      <div>
        {this.state.showLoader ? (
          <div className="toogleswitch__loader"></div>
        ) : (
          <label className="toogleswitch">
            <input
              checked={this.state.checked}
              type="checkbox"
              onChange={this.onChange}
            />
            <div className="toogleswitch__slider slider--round">
              <span className="on">ON</span>
              <span className="off">OFF</span>
            </div>
          </label>
        )}
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    let prevValue = prevProps.data[prevProps.fieldName];
    let currValue = this.props.data[this.props.fieldName];
    if (currValue !== prevValue) {
      this.setState({ checked: currValue, showLoader: false });
    }
  }
}

Toogle.propTypes = {
  fieldName: PropTypes.string.isRequired,
  callback: PropTypes.func,
  data: PropTypes.object.isRequired,
  showConfirmAlert: PropTypes.bool,
  timeOut: PropTypes.number,
  confirmationTitle: PropTypes.string, //Confirmation Alert title.
  confirmationDescription: PropTypes.string //Confirmation Alert Description.
};

export default Toogle;
