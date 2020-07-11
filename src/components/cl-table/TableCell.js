import React from "react";
import Toogle from "../cl-toogle/Toogle";
import Indicator from "../cl-indicator/Indicator";
import PropTypes from "prop-types";
import Link from "../cl-link/Link";
const moment = require("moment");

class TableCell extends React.Component {
  viewDetails() {
    alert("View Details Item clicked");
  }
  render() {
    let { rowItem, column } = this.props;
    const type = column["columnType"];
    if (type === undefined) {
      return (
        <td>
          <span style={{ display: "grid", justifyContent: "start" }}>
            <p
              style={{
                width: column.colWidth ? column.colWidth.width : null,
                textOverflow: column["text-overflow"],
                whiteSpace: column["white-space"],
                overflow: column["overflow"]
              }}
            >
              {rowItem[column.field]}
            </p>
          </span>
        </td>
      );
    } else if (type === "toogle") {
      return (
        <td style={{ paddingLeft: "10px" }}>
          <Toogle
            data={rowItem}
            fieldName={column.field}
            callback={column.callback}
            showConfirmAlert={column.showConfirmation}
            timeOut={column.timeOut}
          />
        </td>
      );
    } else if (type === "indicator") {
      const isON = rowItem[column.field];
      return (
        <td>
          <Indicator status={isON} />
        </td>
      );
    } else if (type === "humanize_datetime") {
      const val = rowItem[column.field];
      return (
        <td>
          {/*moment(Date.parse(val)).local().fromNow()*/}
          {moment(Date.parse(val)).format('DD/MM/YYYY HH:mm:ss')}
        </td>
      );
    } else if (type === "link") {
      let text = column.default ? column.default : rowItem[column.field];
      return (
        <td>
          <Link
            onClick={() => {
              column.callback(rowItem);
            }}
          >
            {text}
          </Link>
        </td>
      );
    } else if (type === "editLink" && (rowItem["webhook_status"] !== "archived")) {
      let text = column.field;
      return (
        <td style={{ 
          padding: column.colPadding ? column.colPadding.padding : null 
        }}>
          <Link
            onClick={() => {
              column.callback(rowItem);
            }}
          >
            {text}
          </Link>
        </td>
      ); // newly added
    } else if (type === "logsLink" && rowItem["webhook_status"] === "active") {
      let text = column.field;
      return (
        <td style={{ 
          padding: column.colPadding ? column.colPadding.padding : null 
        }}>
          <Link
            onClick={() => {
              column.callback(rowItem);
            }}
          >
            {text}
          </Link>
        </td>
      ); // newly added
    } else return <td></td>;
  }
}

TableCell.propTypes = {
  rowItem: PropTypes.object.isRequired,
  column: PropTypes.object.isRequired,
  flyoutOnExit: PropTypes.func
};

export default TableCell;