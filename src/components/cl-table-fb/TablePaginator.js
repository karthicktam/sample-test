import React, { Component } from "react";
import PropTypes from "prop-types";

class TablePaginator extends Component {

  render() {

    return (
      <div className="pagination" style={this.props.tablePaginatorInlineStyles}>
        <div>
          <button
            disabled={this.props.pageIndex === 0}
            onClick={this.props.navigateToPreviousPage}
            className="pagination__previous"
          ></button>
          <button
            disabled={this.props.pageIndex === this.props.totalPages - 1}
            onClick={this.props.navigateToNextPage}
            className="pagination__next"
          ></button>
        </div>
      </div>
    );
  }
}

TablePaginator.propTypes = {
  navigateToNextPage: PropTypes.func,
  navigateToPreviousPage: PropTypes.func,
  onPaginationSelect: PropTypes.func,
  pageIndex: PropTypes.number,
  selectedPaginationOption: PropTypes.any
};

export default TablePaginator;