import React from "react";
import PropTypes from "prop-types";
import "./_link.scss";

class Link extends React.Component {
  render() {
    return (
      <div>
        <label className="cl-link" onClick={this.props.onClick}>
          {this.props.children}
        </label>
      </div>
    );
  }
}
Link.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.any
};

export default Link;
