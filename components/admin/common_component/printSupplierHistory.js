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

    const classes = useStyles();

    const stockOutRender = (renData) => {
      const clienObj = {
        name: renData?.customer_name,
        phone: renData?.customer_phone,
        address: renData?.customer_address,
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

        </Grid>
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
                  date:{" "}
                  {/* {dateFormatWithoutTime(defaultprintData.date_time)} */}
                </Typography>
              </GridItem>
              <GridItem xs="6">
                <Typography style={{ fontWeight: "bold" }} align="right">
                  Invoice No:{" "}
                  {/* {convertFristCharcapital(defaultprintData?.invoice_no)} */}
                </Typography>
              </GridItem>
            </Grid>

            <Box mt={3}>

    
         
                 supplier details

            </Box>

            <Box mt={4}>
              <Table
                aria-label="simple table"
                size="small"
                className={classes.table}
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ padding: "1px", textAlign: "center" }}>
                      SL#
                    </TableCell>
                    <TableCell>Invoice No</TableCell>
                    <TableCell>Memo</TableCell>
                    <TableCell>Invoice Date</TableCell>
                    <TableCell>Total(TK)</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {/* {!!printData?.data &&
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
                        <TableCell align="right">{prd.qty}</TableCell>
                        <TableCell align="right">
                          {prd.product_unit_name}
                        </TableCell>
                        <TableCell align="right">
                          {prd.purchase_price}
                        </TableCell>
                        <TableCell align="right">
                          {prd.purchase_price * prd.qty}
                        </TableCell>
                      </TableRow>
                    ))} */}

    
                  <TableRow>
                    <TableCell align="right" colSpan={4}>
                  Grand Total
                    </TableCell>
                    <TableCell align="right">
                        0
                      {/* {defaultprintData?.due_amount} */}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>

            <Box mt={2}>
              <Typography variants="body1" style={{ fontWeight: "bold" }}>
                In Words:
                {/* {curencyNumbertoWordTwo(defaultprintData?.grand_total_amount)}. */}
              </Typography>
            </Box>

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
