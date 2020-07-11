import React from "react";
import PropTypes from "prop-types";
import TableCell from "./TableCell";
import DropDownMenu from "../cl-dropdown/DropDownMenu";

class TableRow extends React.PureComponent {
  onSelect = e => {
    this.props.onRowSelect(this.props.item, e.target.checked);
  };

  render() {
    let { columns, item, tableRowActions } = this.props;
    return (
      <tr>
        {this.props.selectable ? (
          <td style={{ paddingLeft: "50px" }}>
            <label className="checkboxcontainer">
              <input
                type="checkbox"
                className="checkboxcontainer__bodycheckbox"
                name="tablerow"
                checked={item.selected}
                onChange={this.onSelect}
              />
              <span className="checkboxcontainer__custombcb"></span>
            </label>
          </td>
        ) : null}

        {columns.map(column =>
          column.showColumn ? (
            <TableCell
              key={column["name"] + column["field"] + item["id"]}
              column={column}
              rowItem={item}
              flyoutOnExit={this.props.flyoutOnExit}
            />
          ) : (
            undefined
          )
        )}
        {/* If tableRowActions is undefined, an empty <td></td> will be rendered. */}
        {tableRowActions && item["webhook_status"] !== "archived" ? (
          <td
            key={item["id"] + "actions"}
            style={tableRowActions.style ? tableRowActions.style : null}
          >
            <DropDownMenu
              data={item}
              options={tableRowActions}
              DropdownInlineStyles={this.props.DropdownInlineStyles}
            />
          </td>
        ) : (
          item["webhook_status"] === "archived" && this.props.selectedTab === "archived" 
            ? null 
            : item["source_id"] ? null : tableRowActions ? <td></td> : null
          /*<td></td>*/
          /*null*/
        )}
      </tr> /* blockcss used as inline media query function*/
    );
  }
}
TableRow.propTypes = {
  onRowSelect: PropTypes.func.isRequired,
  item: PropTypes.any,
  columns: PropTypes.any,
  tableRowActions: PropTypes.array,
  flyoutOnExit: PropTypes.func
};
export default TableRow;












// import React from "react";
// import PropTypes from "prop-types";
// import TableCell from "./TableCell";
// import DropDownMenu from "../cl-dropdown/DropDownMenu";

// class TableRow extends React.PureComponent {
//   onSelect = e => {
//     this.props.onRowSelect(this.props.item, e.target.checked);
//   };

//   render() {
//     let { columns, item, tableRowActions } = this.props;
//     return (
//       <tr>
//         {this.props.selectable ? (
//           <td style={{ paddingLeft: "50px" }}>
//             <label className="checkboxcontainer">
//               <input
//                 type="checkbox"
//                 className="checkboxcontainer__bodycheckbox"
//                 name="tablerow"
//                 checked={item.selected}
//                 onChange={this.onSelect}
//               />
//               <span className="checkboxcontainer__custombcb"></span>
//             </label>
//           </td>
//         ) : null}

//         {columns.map(column =>
//           column.showColumn ? (
//             <TableCell
//               key={column["name"] + column["field"] + item["id"]}
//               column={column}
//               rowItem={item}
//               flyoutOnExit={this.props.flyoutOnExit}
//             />
//           ) : (
//             undefined
//           )
//         )}
//         {/* If tableRowActions is undefined, an empty <td></td> will be rendered. */}
//         {tableRowActions && item["webhook_status"] !== "archived" ? (
//           <td
//             key={item["id"] + "actions"}
//             style={tableRowActions.style ? tableRowActions.style : null}
//           >
//             <DropDownMenu
//               data={item}
//               options={tableRowActions}
//               DropdownInlineStyles={this.props.DropdownInlineStyles}
//             />
//           </td>
//         ) : (
//           item["webhook_status"] === "archived" && this.props.selectedTab === "archived" 
//             ? null 
//             : item["source_id"] ? null : <td></td>
//           /*<td></td>*/
//           /*null*/
//         )}
//       </tr> /* blockcss used as inline media query function*/
//     );
//   }
// }
// TableRow.propTypes = {
//   onRowSelect: PropTypes.func.isRequired,
//   item: PropTypes.any,
//   columns: PropTypes.any,
//   tableRowActions: PropTypes.array,
//   flyoutOnExit: PropTypes.func
// };
// export default TableRow;