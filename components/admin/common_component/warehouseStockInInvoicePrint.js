import { Box, Grid, Typography } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { curencyNumbertoWordTwo } from "helper/currenctConvert";
import {
  convertFristCharcapital,
  dateFormatIssueDate,
} from "helper/getMonthToNumber";
import { dateFormatWithoutTime } from "helper/dateFormat";
import GridItem from "components/Grid/GridItem";

const useStyles = makeStyles({
  table: {
    "& .MuiTableCell-root": {
      border: "1px solid black",
    },
  },
});
const InvoicePrint = React.forwardRef(
  ({ defaultprintData, printData, invoiceTitle }, ref) => {
    console.log(defaultprintData);
    const classes = useStyles();

    const productType = printData?.data[0]?.type;

    const stockOutRender = (renData) => {
      const clienObj = {
        name: renData?.customer_name,
        phone: renData?.customer_phone,
        address: renData?.customer_address,
      };

      const adminObj = {
        name: renData?.store_name,
        phone: renData?.store_phone,
        address: renData?.store_address,
      };
      return (
        <Grid container>
          <GridItem xs="6" style={{ textAlign: "start" }}>
            <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
              invoice To
            </Typography>
            <Typography variant="body2">{clienObj?.name}</Typography>
            <Typography variant="body2">{clienObj?.phone}</Typography>
            <Typography variant="body2">{clienObj?.address}</Typography>
          </GridItem>

          <GridItem xs="6" style={{ textAlign: "end" }}>
            <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
              Invoice From
            </Typography>

            <Typography variant="body2">{adminObj?.name}</Typography>
            <Typography variant="body2">{adminObj?.phone}</Typography>
            <Typography variant="body2">{adminObj?.address}</Typography>
          </GridItem>
        </Grid>
      );
    };

    const stockInRender = (renData) => {
      const clienObj = {
        name: renData?.stores_name,
        phone: renData?.stores_phone,
        address: renData?.stores_address,
      };

      const adminObj = {
        name: renData?.warehouse_name,
        phone: renData?.warehouse_phone,
        address: renData?.warehouse_address,
      };
      return (
        <Grid container>
          <GridItem xs="6" style={{ textAlign: "start" }}>
            <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
              invoice To
            </Typography>
            <Typography variant="body2">{clienObj?.name}</Typography>
            <Typography variant="body2">{clienObj?.phone}</Typography>
            <Typography variant="body2">{clienObj?.address}</Typography>
          </GridItem>

          <GridItem xs="6" style={{ textAlign: "end" }}>
            <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
              Invoice From
            </Typography>

            <Typography variant="body2">{adminObj?.name}</Typography>
            <Typography variant="body2">{adminObj?.phone}</Typography>
            <Typography variant="body2">{adminObj?.address}</Typography>
          </GridItem>
        </Grid>
      );
    };

    const stockInWarehouseRender = (renData) => {
      const clienObj = {
        name: renData?.warehouse_name,
        phone: renData?.warehouse_phone,
        address: renData?.supplier_address,
      };

      const adminObj = {
        name: renData?.supplier_name,
        phone: renData?.supplier_phone,
        address: renData?.warehouse_address,
      };
      return (
        <Grid container>
          <GridItem xs="6" style={{ textAlign: "start" }}>
            <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
              invoice To
            </Typography>
            <Typography variant="body2">{clienObj?.name}</Typography>
            <Typography variant="body2">{clienObj?.phone}</Typography>
            <Typography variant="body2">{clienObj?.address}</Typography>
          </GridItem>

          <GridItem xs="6" style={{ textAlign: "end" }}>
            <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
              Invoice From
            </Typography>

            <Typography variant="body2">{adminObj?.name}</Typography>
            <Typography variant="body2">{adminObj?.phone}</Typography>
            <Typography variant="body2">{adminObj?.address}</Typography>
          </GridItem>
        </Grid>
      );
    };

    const ownProductTable = (renData) => {
      return (
        <Table aria-label="simple table" size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{ padding: "1px", textAlign: "center" }}>
                SL#
              </TableCell>
              <TableCell width="65%">Description</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>QTY</TableCell>
        
              <TableCell>Price</TableCell>
              <TableCell>Total(TK)</TableCell>
            
              
            </TableRow>
          </TableHead>

          <TableBody>
            {!!printData?.data &&
              printData?.data?.map((prd, index) => (
                <TableRow>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ fontSize: "12px" }}
                  >
                    {prd.product_name?.slice(0, 55)}
                  </TableCell>
                  <TableCell align="right">{prd.product_unit_name}</TableCell>
                  <TableCell align="right">{prd.qty}</TableCell>
                  <TableCell align="right">{prd.purchase_price}</TableCell>
                  <TableCell align="right">
                    {prd.purchase_price * prd.qty}
                  </TableCell>
                </TableRow>
              ))}

<TableRow>
              <TableCell align="right" colSpan={5}>
                Sub Total
              </TableCell>
              <TableCell align="right">
                {defaultprintData?.grand_total_amount}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    };

    const buyProductTable = (renData) => {
      return (
        <Table aria-label="simple table" size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{ padding: "1px", textAlign: "center" }}>
                SL#
              </TableCell>
              <TableCell width="65%">Description</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>QTY</TableCell>
        
              <TableCell>Price</TableCell>
              <TableCell>Total(TK)</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!!printData?.data &&
              printData?.data?.map((prd, index) => (
                <TableRow>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ fontSize: "12px" }}
                  >
                    {prd.product_name?.slice(0, 55)}
                  </TableCell>
                  <TableCell align="right">{prd.product_unit_name}</TableCell>
                  <TableCell align="right">{prd.qty}</TableCell>
               
                  <TableCell align="right">{prd.purchase_price}</TableCell>
                  <TableCell align="right">
                    {prd.purchase_price * prd.qty}
                  </TableCell>
                </TableRow>
              ))}

            <TableRow>
              <TableCell align="right" colSpan={5}>
                Sub Total
              </TableCell>
              <TableCell align="right">
                {defaultprintData?.grand_total_amount}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="right" colSpan={5}>
                Discount
              </TableCell>
              <TableCell align="right">
                {defaultprintData?.discount_amount}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="right" colSpan={5}>
                After Discount
              </TableCell>
              <TableCell align="right">
                {defaultprintData?.after_discount_amount}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="right" colSpan={5}>
                Less Amount
              </TableCell>
              <TableCell align="right">
                {defaultprintData?.less_amount}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="right" colSpan={5}>
                After Less
              </TableCell>
              <TableCell align="right">
                {defaultprintData?.after_less_amount}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="right" colSpan={5}>
               Grand Total
              </TableCell>
              <TableCell align="right">
                {defaultprintData?.grand_total_amount}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="right" colSpan={5}>
                Payment Type
              </TableCell>
              <TableCell align="right">
                {defaultprintData?.payment_type}
              </TableCell>
            </TableRow>

            {defaultprintData.payment_type == "Cheque" && (
              <TableRow>
                <TableCell align="right" colSpan={5}>
                  Cheque Approved Status
                </TableCell>
                <TableCell align="right">
                  {defaultprintData?.cheque_approved_status}
                </TableCell>
              </TableRow>
            )}

            {defaultprintData.payment_type == "Cheque" && (
              <TableRow>
                <TableCell align="right" colSpan={5}>
                  Cheque Date
                </TableCell>
                <TableCell align="right">
                  {defaultprintData?.cheque_date}
                </TableCell>
              </TableRow>
            )}

            <TableRow>
              <TableCell align="right" colSpan={5}>
                Paid
              </TableCell>
              <TableCell align="right">
                {defaultprintData?.paid_amount}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="right" colSpan={5}>
                Due
              </TableCell>
              <TableCell align="right">
                {defaultprintData?.due_amount}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    };

    return (
      <div ref={ref}>
        {defaultprintData && (
          <div style={{ margin: "15px" }}>
            <Grid container>
              <GridItem xs="6">
                <Typography
                  style={{ textAlign: "start", fontWeight: "bold" }}
                  variant="h5"
                >
                  Islam Garments
                </Typography>
              </GridItem>
              <GridItem xs="6">
                <Typography
                  style={{ textAlign: "end", fontWeight: "bold" }}
                  variant="h5"
                >
                  {invoiceTitle}
                </Typography>
              </GridItem>
            </Grid>

            <Grid
              container
              style={{
                marginTop: "10px",
                borderTop: "1px solid gray",
                borderBottom: "1px solid gray",
                paddingTop: "8px",
                paddingBottom: "8px",
              }}
            >
              <GridItem xs="6">
                <Typography style={{ fontWeight: "bold" }} align="left">
                  date: {dateFormatWithoutTime(defaultprintData.date_time)}
                </Typography>
              </GridItem>
              <GridItem xs="6">
                <Typography style={{ fontWeight: "bold" }} align="right">
                  Invoice No:{" "}
                  {convertFristCharcapital(defaultprintData?.invoice_no)}
                </Typography>
              </GridItem>
            </Grid>

            <Box mt={3}>
              {invoiceTitle == "Store Stock Out" &&
                stockOutRender(printData?.info)}
              {invoiceTitle == "Store Stock In" &&
                stockInRender(printData?.info)}

              {invoiceTitle == "Warehouse Stock In" &&
                stockInWarehouseRender(printData?.info)}

              {invoiceTitle == "Store Stock Request" &&
                stockInRender(printData?.info)}
            </Box>

            <Box mt={4}>
              {productType == "Own" && ownProductTable()}

              {productType == "Buy" && buyProductTable()}
            </Box>

            {productType == "Buy" && (
              <Box mt={2}>
                <Typography variants="body1" style={{ fontWeight: "bold" }}>
                  In Words:
                  {curencyNumbertoWordTwo(defaultprintData?.grand_total_amount)}
                  .
                </Typography>
              </Box>
            )}

            <Box mt={10}>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    align="left"
                    style={{
                      borderTop: "2px solid black",
                    }}
                  >
                    Client Signature
                  </Typography>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    align="left"
                    style={{
                      borderTop: "2px solid black",
                    }}
                  >
                    Admin Signature
                  </Typography>
                </Box>
              </Grid>
            </Box>
          </div>
        )}
      </div>
    );
  }
);
export default InvoicePrint;