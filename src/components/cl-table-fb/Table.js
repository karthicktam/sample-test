import React, { Component } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import TableRow from "./TableRow";
import TableHeaderCell from "./TableHeaderCell";
import TableColumnSelector from "./TableColumnSelector";
import TablePaginator from "./TablePaginator";
import { withRouter } from "react-router-dom";
// import { updateBroswerURL } from "../utils/PropsCallbacks";
import "./_table.scss";

import { getFilteredTableData } from "./utils/TableDataFilter";

class Table extends Component {
  constructor(props) {
    super(props);
    let stateObj = getFilteredTableData(this.props);

    this.state = {
      columns: this.props.columns,
      ...stateObj,
      minWidth: this.props.minWidth
    };
  }

  componentDidUpdate(prevProps) {
    let sameProps = _.isEqual(prevProps.items, this.props.items);
  
    if (!sameProps) {
      let stateObj = getFilteredTableData(this.props);

      this.setState({
        ...stateObj
      });
    }
  }
  componentDidCatch() {}
  // -------------------------search-Functions------------------------------

  clearSearchValue = () => {
    this.setState({ searchValue: "" });
    this.searchRows("");
  };

  searchRows = searchWord => {
    if (searchWord !== "") {
      let items = _.cloneDeep(this.state.items);
      let filteredItems = [];
      items.forEach(item => {
        Object.keys(item).every(key => {
          if (typeof item[key] === "string") {
            if (item[key].indexOf(searchWord) > -1) {
              filteredItems.push(item);
              return false;
            }
          }
          return true;
        });
      });

      var searchObj = {
        search: {
          search: undefined
        }
      };

      if (searchWord !== "") searchObj["search"]["search"] = searchWord;

      // updateBroswerURL(this.props.history, searchObj);

      this.setState({ filteredItems, searchWord });
    } else {
      this.setState(
        { searchWord },
        this.onPaginationSelect(this.state.selectedPaginationOption)
      );
    }
  };

  selectedRows = () => {
    let selectedRows = this.state.items.filter(item => item["selected"]);
    return selectedRows;
  };

  sortItemsByColumn = (column, sortOrder) => {
    let items = _.cloneDeep(this.state.items);
    let sortedItems = _.orderBy(items, [column["field"]], [sortOrder]);
    let filteredItems = sortedItems;
    this.setState({
      filteredItems: filteredItems
    });
  };

  // onPaginationSelect = option => {
  //   option = parseInt(option);
  //   let filteredItems = _.cloneDeep(this.state.items);
  //   filteredItems = filteredItems.splice(0, option);
  //   let totalPages = Math.floor(this.state.items.length / option);
  //   if (this.state.items.length % option !== 0) {
  //     totalPages++;
  //   }
  //   this.setState(
  //     {
  //       pageIndex: 0,
  //       selectedPaginationOption: option,
  //       filteredItems: filteredItems,
  //       totalPages: totalPages
  //     },
  //     updateBroswerURL(this.props.history, {
  //       search: {
  //         page: 1,
  //         per_page: option
  //       }
  //     })
  //   );
  // };

  navigateToPreviousPage = () => {
    let filteredItems = _.cloneDeep(this.state.items);
    this.setState(
      {
        filteredItems: filteredItems
      }
    );
  };
  navigateToNextPage = () => {
    let filteredItems = _.cloneDeep(this.state.items);
    this.setState(
      { filteredItems: filteredItems },
    );
  };

  showOrHideColumn = (column, showColumn) => {
    let columns = _.cloneDeep(this.state.columns);
    columns.forEach(col => {
      if (col["name"] === column["name"]) {
        col["showColumn"] = showColumn;
      }
    });
    this.setState({ columns });
  };

  selectAll = event => {
    const selected = event.target.checked;
    const filteredItemIds = _.map(this.state.filteredItems, "id");
    let items = this.state.items.map(item => {
      if (filteredItemIds.indexOf(item["id"]) !== -1) {
        item["selected"] = selected;
      }
      return item;
    });
    let filteredItems = _.cloneDeep(items);

    this.setState({
      items,
      filteredItems
    });
  };

  onRowSelect = (row, isSelected) => {
    let items = this.state.items.map(item => {
      if (item["id"] === row["id"]) {
        item["selected"] = isSelected;
      }
      return item;
    });
    let filteredItems = _.cloneDeep(items);

    this.setState({
      items,
      filteredItems
    });
  };
  render() {

    let { columns, filteredItems, searchValue } = this.state;

    let tableFlexClassname = "tableflex";
    if (this.props.searchable === false) {
      tableFlexClassname += " tableflex--withoutseachbox"; // this condition changes the align of tableflex when
    } // with/without search box

    return (
      <div key={'id="CLUITable"'}>
        <div
          className={tableFlexClassname}
          style={this.props.tableFlexInlineStyles}
        >
          {this.props.searchable ? (
            <div style={{ display: "flex" }}>
              <input
                defaultValue={this.props.searchWord}
                value={searchValue}
                type="search"
                placeholder="Quick search"
                className="tableflex__sbar1"
                onChange={e => {
                  this.setState({ searchValue: e.target.value });
                  this.searchRows(e.target.value);
                }}
              ></input>
            </div>
          ) : null}
          <div className="tableflex--innerflex">
            {this.props.filterable ? (
              <button className="tableflex__filter-button" />
            ) : null}
            {this.props.refreshable ? (
              <button
                id="tableflex__refresh-button"
                className="tableflex__refresh-img"
                onClick={this.props.onRefresh}
              ></button>
            ) : null}
            {this.props.controlColumnVisibility ? (
              <TableColumnSelector
                columns={this.state.columns}
                showOrHideColumn={this.showOrHideColumn}
              />
            ) : null}

            <TablePaginator
              navigateToPreviousPage={this.navigateToPreviousPage}
              navigateToNextPage={this.navigateToNextPage}
              tablePaginatorInlineStyles={this.props.tablePaginatorInlineStyles}
            />
          </div>
        </div>
        <div
          className="tablewrapper"
          style={this.props.tableWrapperInlineStyles}
        >
          <table id="CLUITable">
            <tbody>
              <tr>
                {this.props.selectable ? (
                  <th style={{ paddingLeft: "50px" }}>
                    <label className="checkboxcontainer">
                      <input
                        type="checkbox"
                        className="checkboxcontainer__checkbox"
                        onClick={this.selectAll}
                      />
                      <span className="checkboxcontainer__customcb"></span>
                    </label>
                  </th>
                ) : null}
                {columns.map(column =>
                  column.showColumn ? (
                    <TableHeaderCell
                      key={column["field"] + column["name"]}
                      column={column}
                      className="clui-table-colum-name"
                      onClick={this.sortItemsByColumn}
                      width={column["width"]}
                      Tabledata={this.props.Tabledata}
                      tableSortable={this.props.sortable}
                      // tableRowActions={this.props.rowActions}
                    />
                  ) : (
                    undefined
                  )
                )}
                  {this.props.rowActions ? <th></th> : null}
              </tr>
              { filteredItems.length === 0 ? 
                <tr>
                  <td 
                    colSpan={this.props.selectable ? columns.length + 2 : columns.length + 1} 
                    style={{textAlign: "center"}}
                  > No Records Found </td>
                </tr> :
                filteredItems.map((item, index) => {
                  return (
                    <TableRow
                      key={item["id"]}
                      columns={columns}
                      item={item}
                      selectable={this.props.selectable}
                      onRowSelect={this.onRowSelect}
                      tableRowActions={this.props.rowActions}
                      DropdownInlineStyles={this.props.DropdownInlineStyles}
                      flyoutOnExit={this.props.flyoutOnExit}
                      selectedTab={this.props.selectedTab} // new
                    />
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

Table.propTypes = {
  onSelect: PropTypes.func,
  controlColumnVisibility: PropTypes.bool,
  sortable: PropTypes.bool,
  searchable: PropTypes.bool,
  searchWord: PropTypes.string,
  selectable: PropTypes.bool,
  filterable: PropTypes.bool,
  refreshable: PropTypes.bool,
  onRefresh: PropTypes.func,
  columns: PropTypes.any,
  items: PropTypes.any,
  paginationOptions: PropTypes.any,
  onSearch: PropTypes.func,
  tableRowActions: PropTypes.array,
  tableActions: PropTypes.array,
  defaultPerPage: PropTypes.number,
  defaultPage: PropTypes.number
};

export default withRouter(Table);
// export default Table;