import React, { Component } from "react";
import PropTypes from "prop-types";
import "./_indicator.scss";

class Indicator extends Component {
  render() {
    return (
      <div>
        <span className={this.props.status ? "on-state" : "off-state"}></span>
      </div>
    );
  }
}
Indicator.propTypes = {
  status: PropTypes.bool.isRequired
};

export default Indicator;
