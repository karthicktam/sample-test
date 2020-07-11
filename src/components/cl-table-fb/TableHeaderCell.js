import React from "react";
import PropTypes from "prop-types";

class TableHeaderCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSortOrder: false,
      sortOrder: "asc"
    };
  }
  onClick = () => {
    let sortOrder = this.state.sortOrder === "asc" ? "desc" : "asc";
    this.setState({
      sortOrder: sortOrder
    });
    this.props.onClick(this.props.column, sortOrder);
  };
  toogleShowOrder = () => {
    this.setState({
      showSortOrder: !this.state.showSortOrder
    });
  };
  renderSortIcon = sortOrder => {
    return (
      <React.Fragment>
        <span className="clui-table-header-icon ">
          <img
            src={require("../../assets/icons/cl-sort.svg")}
            alt="Empty-Webhook"
          />
        </span>
      </React.Fragment>
    );
  };
  render() {
    let { column, className, tableSortable } = this.props;

    return (
      <th
        key={column["id"]}
        style={{ width: column.colWidth ? column.colWidth.width : null,
          padding: column.colPadding ? column.colPadding.padding : null
        }}
        className={className}
        onClick={tableSortable && column["sortable"] ? this.onClick : undefined}
        onMouseEnter={
          tableSortable && column["sortable"] ? this.toogleShowOrder : undefined
        }
        onMouseLeave={
          tableSortable && column["sortable"] ? this.toogleShowOrder : undefined
        }
      >
        {column["name"]}
        {this.state.showSortOrder
          ? this.renderSortIcon(this.state.sortOrder)
          : null}
      </th>
    );
  }
}

TableHeaderCell.propTypes = {
  className: PropTypes.string,
  column: PropTypes.any,
  onClick: PropTypes.func
};

export default TableHeaderCell;