import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

class TablePaginator extends Component {
  // UNSAFE_componentWillMount() {
  //   this.props.navigateToPreviousPage();
  // }

  render() {
    let { pageIndex, selectedPaginationOption } = this.props;

    return (
      <div className="pagination" style={this.props.tablePaginatorInlineStyles}>
        <select
          onChange={e => this.props.onPaginationSelect(e.target.value)}
          className="pagination__rowselector"
          value={selectedPaginationOption}
        >
          {this.props.paginationOptions.map(option => (
            <option
              key={option}
              value={option}
              className="pagination__rowselector--pageoption"
            >
              {option}
            </option>
          ))}
        </select>
        <div>
          {/* <Link
            to={`?page=${pageIndex}&per_page=${selectedPaginationOption}`}
            className="pagination--nextbtn"
          > */}
          <button
            disabled={this.props.pageIndex === 0}
            onClick={this.props.navigateToPreviousPage}
            className="pagination__previous"
          ></button>
          {/* </Link> */}
          <Link
            to={`?page=${pageIndex + 2}&per_page=${selectedPaginationOption}`}
          >
            <button
              disabled={this.props.pageIndex === this.props.totalPages - 1}
              onClick={() => {
                this.props.navigateToNextPage();
              }}
              className="pagination__next"
            ></button>
          </Link>
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