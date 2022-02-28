import { Box, Divider, Grid, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  table: {
    '& .MuiTableCell-root': {
      border: '1px solid black',
    },
  },
});

const InvoicePosPurchase = React.forwardRef(({ inv, invoiceProduct }, ref) => {
  const classes = useStyles();
  return (
    <div ref={ref}>
      {inv && (
        <Grid container direction="column" style={{ padding: '0px 20px' }}>
          <Box>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center">
              <img src="/logo.png" alt="" />
              <Typography variant="subtitle2" align="center">
                {inv.store_address}
              </Typography>
            </Grid>
          </Box>
          <Box pl={3} pr={2}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center">
              <Grid item xs={5}>
                <Typography variant="body2" align="left">
                  Invoice No :
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography variant="body2" align="right">
                  {inv.invoice_no}
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="body2" align="left">
                  Date & Time :
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography variant="body2" align="right">
                  {inv.sale_date_time}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box pt={1}>
                <Divider />
              </Box>
              <Box pt={1} mb={1}>
                <Divider />
              </Box>
            </Grid>
          </Box>

          <TableContainer component={Paper}>
            <Table
              className={classes.table}
              aria-label="simple table"
              size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">TK</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceProduct &&
                  invoiceProduct.map((prd) => (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {prd.product_name}
                      </TableCell>
                      <TableCell align="right">{prd.qty}</TableCell>
                      <TableCell align="right">৳{prd.mrp_price}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box pl={3} pr={2} py={2}>
            <Grid
              container
              direction="column"
              justify="start"
              alignItems="start">
              <Grid item xs={12}>
                <TableContainer>
                  <Table aria-label="simple table" padding="none" size="small">
          
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Sub Total
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 'bold' }}>
                          {inv.total_amount +
                            inv.discount_amount -
                            inv.total_vat_amount}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Discount
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 'bold' }}>
                          {inv.discount_amount}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          VAT
                        </TableCell>
                        <TableCell align="right">
                          {inv.total_vat_amount}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Grand Total
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 'bold' }}>
                          {inv.total_amount}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Paid
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 'bold' }}>
                          {inv.paid_amount}
                        </TableCell>
                      </TableRow>
           
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Box>
          <Typography variant="body1" align="center">
            Payment Type : {inv.payment_type}
          </Typography>
          <Typography variant="subtitle2" align="center">
            Thanks for your purchase
          </Typography>
          <Typography variant="subtitle2" align="center">
            Boi Bichitra
          </Typography>
        </Grid>
      )}
    </div>
  );
});
export default InvoicePosPurchase;
