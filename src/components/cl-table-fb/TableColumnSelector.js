import React, { Component } from "react";
import "./_tableColumnSelector.scss";
import PropTypes from "prop-types";

class TableColumnSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  componentDidMount() {
    window.addEventListener("click", this.toggleColumnclose, {});
  }
  componentWillUnmount() {
    window.removeEventListener("click", this.toggleColumnclose, {});
  }
  toogleColumnSelector = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  toggleColumnclose = event => {
    if (
      event.target.matches(".cbdropdown__list") ||
      event.target.matches(".dropdownmenu__checkbox") ||
      event.target.matches(".dropdownmenu")
    ) {
      this.setState({ isOpen: true });
    } else if (!event.target.matches(".columnselectdropdownbox__btn")) {
      this.setState({ isOpen: false });
    }
  };

  render() {
    const style = {
      top: 0,
      left: 0,
      position: "absolute",
      zIndex: 10
    };
    const popOverList = (
      <ul style={{ style }} className="cbdropdown">
        {this.props.columns.map(column => (
          <label key={column["field"] + column["name"]}>
            <li className="cbdropdown__list">
              <div className="dropdownmenu">
                <input
                  type="checkbox"
                  checked={column["showColumn"]}
                  disabled={column["disabled"] === true}
                  onChange={e =>
                    this.props.showOrHideColumn(column, e.target.checked)
                  }
                  className="dropdownmenu__checkbox"
                  style={{ marginRight: "10px" }}
                />
                {column["name"]}
              </div>
            </li>
          </label>
        ))}
      </ul>
    );
    return (
      <div className="columnselectdropdownbox">
        <button
          className="columnselectdropdownbox__btn"
          id="columnselectdropdownbox__img"
          onClick={this.toogleColumnSelector}
        ></button>
        {this.state.isOpen ? popOverList : null}
      </div>
    );
  }
}

TableColumnSelector.propTypes = {
  showOrHideColumn: PropTypes.func,
  columns: PropTypes.any
};

export default TableColumnSelector;