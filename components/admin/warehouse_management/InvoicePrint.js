import { Box, Grid, Typography } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InvoiceHeader from "components/header/InvoiceHeader";
import { curencyNumbertoWordTwo } from "helper/currenctConvert";
import {
  convertFristCharcapital,
  dateFormatIssueDate,
} from "helper/getMonthToNumber";
import { dateFormatWithoutTime } from "helper/dateFormat";

const useStyles = makeStyles({
  table: {
    "& .MuiTableCell-root": {
      border: "1px solid black",
    },
  },
});
const InvoicePosPurchase = React.forwardRef(({ inv, invoiceProduct }, ref) => {
  const classes = useStyles();

//   const [date, setDate] = useState([1, 2, 3]);
//   const [time, setTime] = useState([1, 2]);
//   useEffect(() => {
//     var time = inv ? inv.purchase_date_time.split(" ") : [1, 2];
//     setTime(time);
//   }, [inv, invoiceProduct]);

  return (
    <div ref={ref}>
      {inv && (
        <Grid container direction="column">
          {/* <InvoiceHeader /> */}
          <Box style={{textAlign:"center",marginTop:"10px",marginBottom:"10px"}}>
            <Typography variant="h2">Islam Garments</Typography>
           </Box>
       
          <Box pl={3} pr={2} mt={2} mb={2}>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              style={{ backgroundColor: "#e6eff5", padding: "7px" }}
            >
              <Typography variant="body1" align="center">
                Invoice No: 
                {/* {convertFristCharcapital(inv.invoice_no)} */}
              </Typography>
              <Typography variant="body1" align="center">
                Date: 
                {/* {dateFormatWithoutTime(inv.purchase_date_time)} */}
              </Typography>
              <Typography variant="body1" align="center">
                Time: 
                {/* {`${time[1]}`} */}
              </Typography>
            </Grid>
            <Typography
              style={{ fontWeight: "bold", marginTop: "6px" }}
              variant="body1"
              align="center"
            >
              Stock In Invoice
            </Typography>
            <Typography
              // style={{ paddingLeft: "7px" }}
              variant="body1"
              align="left"
            >
              Supplier Name: 
              {/* {invoiceProduct?.supplier_details?.supplier_name} */}
            </Typography>
            <Typography
              // style={{ paddingLeft: "7px" }}
              variant="body1"
              align="left"
            >
              Supplier Phone:
               {/* {invoiceProduct?.supplier_details?.supplier_phone} */}
            </Typography>
            <Typography
              // style={{ paddingLeft: "7px" }}
              variant="body1"
              align="left"
            >
              Supplier Address:{" "}
              {/* {invoiceProduct?.supplier_details?.supplier_address} */}
            </Typography>
          </Box>
          <Box pl={3} pr={2} py={2}>
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
                  <TableCell width="65%">Description</TableCell>
                  <TableCell>QTY</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {invoiceProduct &&
                  invoiceProduct?.product_whole_purchase_details?.map(
                    (prd, index) => (
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
                        <TableCell align="right">{prd.price}</TableCell>
                        <TableCell align="right">
                          {prd.price * prd.qty}
                        </TableCell>
                      </TableRow>
                    )
                  )}

                <TableRow>
                  <TableCell align="right" colSpan={5}>
                    Sub Total
                  </TableCell>
                  <TableCell align="right">
                      {/* {inv?.sub_total} */}
                      </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={5} align="right">
                    Discount
                  </TableCell>
                  <TableCell align="right">
                      {/* {inv.discount_amount} */}
                      </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={5} align="right">
                    Grand Total
                  </TableCell>
                  <TableCell align="right">
                      {/* {inv.total_amount} */}
                      </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Box mt={2}>
              <Typography variants="body1" style={{ fontWeight: "bold" }}>
                In Words: 
                {/* {curencyNumbertoWordTwo(inv.total_amount)}. */}
              </Typography>
            </Box>
            <Box mt={7}>
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
                    Supplier's Signature
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
                    Admin Sigbature
                  </Typography>
                </Box>
              </Grid>
            </Box>
          </Box>
        </Grid>
      )}
    </div>
  );
});
export default InvoicePosPurchase;
