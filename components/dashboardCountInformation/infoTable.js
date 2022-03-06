import React from "react";
import { useRootStore } from "../../models/root-store-provider";
import { observer } from "mobx-react-lite";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const TableList = observer(
  ({ warehouseWiseInformation, storeWiseInformation }) => {
    console.log("data", warehouseWiseInformation);
    const { user } = useRootStore();

    const totalForWarehouse = warehouseWiseInformation && warehouseWiseInformation.reduce(
      (a, item) => {
        return {
          totalStaff: item.warehouse_staff + a.totalStaff,
          todayPurchase: item.warehouse_today_purchase_amount + a.todayPurchase,
          totalPurchase: item.warehouse_total_purchase_amount + a.totalPurchase,
          totalStock: item.warehouse_current_stock + a.totalStock,
          totalStockAmount:
            item.warehouse_current_stock_amount + a.totalStockAmount,
        };
      },
      {
        totalStaff: 0,
        todayPurchase: 0,
        totalPurchase: 0,
        totalStock: 0,
        totalStockAmount: 0,
      }
    );

    console.log(storeWiseInformation)
    const totalForStore = storeWiseInformation && storeWiseInformation.reduce(
        (a, item) => {
          return {
            totalStaff: item.store_staff + a.totalStaff,
            todayPurchase: item.store_today_sale_amount + a.todayPurchase,
            totalPurchase: item.store_total_sale_amount + a.totalPurchase,
            totalStock: item.store_current_stock + a.totalStock,
            totalStockAmount:
              item.store_current_stock_amount + a.totalStockAmount,
          };
        },
        {
          totalStaff: 0,
          todayPurchase: 0,
          totalPurchase: 0,
          totalStock: 0,
          totalStockAmount: 0,
        }
      );

  

    // const totalForWarehouse =warehouseWiseInformation.reduce(
    //     (a, item) => {
    //       return {
    //         totalStaff: item.warehouse_staff + a.warehouse_staff,
    //         todayPurchase: item.warehouse_today_purchase_amount + a.warehouse_today_purchase_amount,
    //         totalSale:item.credit + a.credit,
    //         totalStock: item.credit + a.credit,
    //         totalStockAmount: item.credit + a.credit,
    //       };
    //     },
    //     {
    //       totalStaff: 0,
    //       todaySale: 0,
    //       totalSale: 0,
    //       totalStock: 0,
    //       totalStockAmount: 0,
    //     }
    //   );

    // const totalAmount = reportData.reduce(
    //     (accumulator, currentValue) => accumulator + currentValue.amount,
    //     0
    //   );

    return (
      <div>
        {/* {user?.details?.role === "Super Admin" ? (
          <h3
            style={{
              textAlign: "center",
              fontWeight: "bold",
              paddingBottom: "10px",
              borderBottom: "1px solid gray",
            }}
          >
            Warehouse Wise Information
          </h3>
        ) : (
          ""
        )} */}

        {user?.details?.role === "Super Admin" ? (
          <Card>

      
          <CardBody>

          <Table
            aria-label="simple table"
            size="small"
            // style={{backgroundColor:"gray"}}
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ padding: "1px", textAlign: "center" }}>
                  SL#
                </TableCell>
                <TableCell>Warehouse Name</TableCell>
                <TableCell align="right">Total Staff</TableCell>
                <TableCell align="right">Today Purchase (TK)</TableCell>
                <TableCell align="right">Total Purchase (TK)</TableCell>
                <TableCell align="right">Current Stock (Qty)</TableCell>
                <TableCell align="right">Stock Amount (TK)</TableCell>
                {/* <TableCel align="right" >Stock Amount</TableCell> */}
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
                    <TableCell align="right">{prd.warehouse_staff}</TableCell>
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

              <TableRow>
                <TableCell component="th" scope="row">Total</TableCell>
                <TableCell component="th" scope="row"></TableCell>
                <TableCell align="right">
                  {totalForWarehouse?.totalStaff}
                </TableCell>
                <TableCell align="right">
                  {totalForWarehouse?.todayPurchase}
                </TableCell>
                <TableCell align="right">
                  {totalForWarehouse?.totalPurchase}
                </TableCell>
                <TableCell align="right">
                  {totalForWarehouse?.totalStock}
                </TableCell>
                <TableCell align="right">
                  {totalForWarehouse?.totalStockAmount}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          </CardBody>
          </Card>
        ) : (
          ""
        )}

        {/* {user?.details?.role === "Super Admin" ||
        user?.details?.role === "Store Salesman" ? (
          <h3
            style={{
              textAlign: "center",
              fontWeight: "bold",
              paddingBottom: "10px",
              borderBottom: "1px solid gray",
            }}
          >
            Store Wise Information
          </h3>
        ) : (
          ""
        )} */}
        {user?.details?.role === "Super Admin" ||
        user?.details?.role === "Store Salesman" ? (
          <Card>
            <CardBody>

            <Table
            aria-label="simple table"
            size="small"
            // style={{backgroundColor:"gray"}}
          >
            <TableHead >
              <TableRow>
                <TableCell style={{ padding: "1px", textAlign: "center" }}>
                  SL#
                </TableCell>
                <TableCell>Store Name</TableCell>
                <TableCell align="right">Total Staff</TableCell>
                <TableCell align="right">Today Sale (TK)</TableCell>
                <TableCell align="right"> Total Sale (TK)</TableCell>
                <TableCell align="right">Current Stock (Qty)</TableCell>
                <TableCell align="right">Stock Amount (TK)</TableCell>
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
                    <TableCell align="right">{prd.store_staff}</TableCell>
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


              <TableRow>
                <TableCell component="th" scope="row">Total</TableCell>
                <TableCell component="th" scope="row"></TableCell>
                <TableCell align="right">
                  {totalForStore?.totalStaff}
                </TableCell>
                <TableCell align="right">
                  {totalForStore?.todayPurchase}
                </TableCell>
                <TableCell align="right">
                  {totalForStore?.totalPurchase}
                </TableCell>
                <TableCell align="right">
                  {totalForStore?.totalStock}
                </TableCell>
                <TableCell align="right">
                  {totalForStore?.totalStockAmount}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

            </CardBody>
          </Card>
        
        
  
        ) : (
          ""
        )}
      </div>
    );
  }
);

export default TableList;
