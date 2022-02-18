import React from "react";
import { useState } from "react";
import cogoToast from "cogo-toast";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Gurd from "../../components/guard/Gurd";
import axios from "axios";
import { useRootStore } from "../../models/root-store-provider";
import { observer } from "mobx-react-lite";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Box, Chip, Grid } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

// const styles = {
//   cardCategoryWhite: {
//     "&,& a,& a:hover,& a:focus": {
//       color: "rgba(255,255,255,.62)",
//       margin: "0",
//       fontSize: "14px",
//       marginTop: "0",
//       marginBottom: "0",
//     },
//     "& a,& a:hover,& a:focus": {
//       color: "#FFFFFF",
//     },
//   },
//   cardTitleWhite: {
//     color: "#FFFFFF",
//     marginTop: "0px",
//     minHeight: "auto",
//     fontWeight: "300",
//     fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
//     marginBottom: "3px",
//     textDecoration: "none",
//     "& small": {
//       color: "#777",
//       fontSize: "65%",
//       fontWeight: "400",
//       lineHeight: "1",
//     },
//   },
// };

// const useStyles = makeStyles(styles);


const TableList = ({warehouseWiseInformation, storeWiseInformation}) => {
console.log('data',warehouseWiseInformation)
  return (
    
    //   <GridContainer>
    //     <GridItem xs={12} sm={12} md={12}>
    //       <h1>ssss</h1>
    //     </GridItem>
    //   </GridContainer>
    <div>
        <h1>etew</h1>
        <Table
                aria-label="simple table"
                size="small"
            
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ padding: "1px", textAlign: "center" }}>
                      SL#
                    </TableCell>
                    <TableCell>Warehouse Name</TableCell>
                    <TableCell>Total Staff</TableCell>
                    <TableCell>Today Purchase</TableCell>
                    <TableCell>Total Purchase</TableCell>
                    <TableCell>Current Stock</TableCell>
                    <TableCell>Stock Amount</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {!!warehouseWiseInformation &&
                    warehouseWiseInformation?.map((prd, index) => (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ fontSize: "12px" }}
                        >
                          {prd.warehouse_name?.slice(0, 55)}
                        </TableCell>
                        <TableCell align="right">
                          {prd.warehouse_staff}
                        </TableCell>
                        <TableCell align="right">
                          {prd.warehouse_today_purchase_amount}
                        </TableCell>
                        <TableCell align="right">
                          {prd.warehouse_total_purchase_amount}
                        </TableCell>
                        <TableCell align="right">
                          {prd.warehouse_current_stock}
                        </TableCell>
                        <TableCell align="right">
                          {prd.warehouse_current_stock_amount}
                        </TableCell>
                      </TableRow>
                    ))}

                  
                </TableBody>
              </Table>

              <Table
                aria-label="simple table"
                size="small"
            
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ padding: "1px", textAlign: "center" }}>
                      SL#
                    </TableCell>
                    <TableCell>Store Name</TableCell>
                    <TableCell>Total Staff</TableCell>
                    <TableCell>Today Sale</TableCell>
                    <TableCell>Total Sale</TableCell>
                    <TableCell>Current Stock</TableCell>
                    <TableCell>Stock Amount</TableCell>
                  </TableRow>
                </TableHead>

                <Box pl={3} pr={2} mt={2} mb={2}>
                    <h3>Store</h3>
                </Box>

                <TableBody>
                  {!!storeWiseInformation &&
                    storeWiseInformation?.map((prd, index) => (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ fontSize: "12px" }}
                        >
                          {prd.store_name?.slice(0, 55)}
                        </TableCell>
                        <TableCell align="right">
                          {prd.store_staff}
                        </TableCell>
                        <TableCell align="right">
                          {prd.store_today_purchase_amount}
                        </TableCell>
                        <TableCell align="right">
                          {prd.store_total_purchase_amount}
                        </TableCell>
                        <TableCell align="right">
                          {prd.store_current_stock}
                        </TableCell>
                        <TableCell align="right">
                          {prd.store_current_stock_amount}
                        </TableCell>
                      </TableRow>
                    ))}

                  
                </TableBody>
              </Table>
    </div>
  );
};

export default TableList;
