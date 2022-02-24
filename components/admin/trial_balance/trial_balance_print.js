import { Box, Grid, Typography } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React  from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem";

const useStyles = makeStyles({
  table: {
    "& .MuiTableCell-root": {
      border: "1px solid black",
    },
  },
});
const InvoicePrint = React.forwardRef(
  ({ trialData, from,to}, ref) => {

    console.log(trialData)
    const classes = useStyles();

    return (
      <div ref={ref}>
        {trialData && (
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
                  Trial Balance
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
                  Date From: {from}
             
                </Typography>
              </GridItem>
              <GridItem xs="6">
                <Typography style={{ fontWeight: "bold" }} align="right">
                  Date To: {to}
                 
                </Typography>
              </GridItem>
            </Grid>

            <Box mt={3}>
              {/* {invoiceTitle == "Store Stock Out" &&
                stockOutRender(printData?.info)}
              {invoiceTitle == "Store Stock In" &&
                stockInRender(printData?.info)}

              {invoiceTitle == "Warehouse Stock In" &&
                stockInWarehouseRender(printData?.info)} */}
            </Box>

            <Box mt={4}>

            <TableContainer>
                  <Table size="small" aria-label="a dense table">
                    <TableHead style={{ backgroundColor: "green" }}>
                      <TableRow>
                        <TableCell>SL</TableCell>
                        <TableCell>Lager Name</TableCell>
                        <TableCell>Debit</TableCell>
                        <TableCell>Credit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {trialData &&
                        trialData?.ResultTr?.map((item, index) => (
                          <TableRow>
                            <TableCell component="th" scope="row">
                              {index + 1}
                            </TableCell>

                            <TableCell component="th" scope="row">
                              {item.head_name}
                            </TableCell>

                            <TableCell component="th" scope="row">
                              {item.debit == "0.00" ? "" : item.debit}
                            </TableCell>

                            <TableCell component="th" scope="row">
                              {item.credit == "0.00" ? "" : item.credit}
                            </TableCell>
                          </TableRow>
                        ))}
                      <TableRow style={{ backgroundColor: "yellow" }}>
                        <TableCell component="th" scope="row">
                          Total
                        </TableCell>

                        <TableCell component="th" scope="row"></TableCell>
                        <TableCell component="th" scope="row">
                          {trialData?.TotalDebit}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {trialData?.TotalCredit}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
             
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
                  {/* <Typography
                    variant="body1"
                    align="left"
                    style={{
                      borderTop: "2px solid black",
                    }}
                  >
                    Client Signature
                  </Typography> */}
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
