import React from "react";
import { useRootStore } from "../../models/root-store-provider";
import { observer } from "mobx-react-lite";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";


const TableList =observer(({warehouseWiseInformation, storeWiseInformation}) => {
console.log('data',warehouseWiseInformation)
const { user } = useRootStore();
  return (

    <div>
        { user?.details?.role === 'Super Admin' ? (
        <h3 style={{textAlign:"center",fontWeight:'bold',paddingBottom:"10px",borderBottom:"1px solid gray"}}>Warehouse Wise Information</h3>
        ) : ''}

        { user?.details?.role === 'Super Admin' ? (
        <Table
        aria-label="simple table"
        size="small"
        style={{backgroundColor:"gray"}}
    
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
        ) : ''}

        { user?.details?.role === 'Super Admin'  || user?.details?.role === 'Store Salesman' ? (
        <h3  style={{textAlign:"center",fontWeight:'bold',paddingBottom:"10px",borderBottom:"1px solid gray"}} >Store Wise Information</h3>
        ) : ''}
        { user?.details?.role === 'Super Admin'  || user?.details?.role === 'Store Salesman' ? (
        <Table
        aria-label="simple table"
        size="small"
        style={{backgroundColor:"gray"}}
    
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
                    {prd.store_today_sale_amount}
                </TableCell>
                <TableCell align="right">
                    {prd.store_total_sale_amount}
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
        ) : ''}
    </div>
  );
});

export default TableList;
